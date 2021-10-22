import { AnyObject, createSubscriber, DynamicProxy, DynamicProxyApi } from 'anux-common';
import { useMemo, useRef } from 'react';
import { createInternalApi, InternalApi } from './internalApi';

const __FORM_PROXY__ = Symbol('__FORM_PROXY__');
const __PROXY_ROOT__ = Symbol('__PROXY_ROOT__');

const apiCache = new WeakMap<AnyObject, Map<PropertyKey, ProxyFieldApi>>();

interface ProxyFieldApi<T = unknown> {
  isTouched: boolean;
  original: DynamicProxyApi<T>;
  current: DynamicProxyApi<T>;
  onTouched(callback: (isTouched: boolean) => void): () => void;
}

function createApi<T>(original: DynamicProxyApi<T>, current: DynamicProxyApi<T>, internalApi: InternalApi, isRoot: boolean): ProxyFieldApi<T> {
  let isTouched = false;
  const { subscribe: onTouched, invoke: invokeOnTouched } = createSubscriber<(isTouched: boolean) => void>();

  internalApi.onSetTouched(updatedIsTouched => {
    if (isTouched === updatedIsTouched) return;
    isTouched = updatedIsTouched;
    invokeOnTouched(isTouched);
  });

  if (!isRoot) { // can't register onChanged on root
    current.onChanged(() => {
      if (isTouched) return;
      isTouched = true;
      invokeOnTouched(isTouched);
    });
  }

  return {
    get isTouched() { return isTouched; },
    original,
    current,
    onTouched,
  };
}

function createProxy(originalProxy: AnyObject, currentProxy: AnyObject, parentProperty: PropertyKey, internalApi: InternalApi): unknown {
  return new Proxy({}, {
    get: (target: AnyObject, property: PropertyKey) => {
      if (property === __FORM_PROXY__) {
        const innerMap = apiCache.get(currentProxy) ?? new Map<PropertyKey, ProxyFieldApi>();
        const api = innerMap.get(parentProperty) ?? createApi(DynamicProxy.with(originalProxy), DynamicProxy.with(currentProxy), internalApi, parentProperty === __PROXY_ROOT__);
        innerMap.set(parentProperty, api);
        apiCache.set(currentProxy, innerMap);
        return api;
      } else {
        return createProxy(Reflect.get(originalProxy as object, property), Reflect.get(currentProxy as object, property), property, internalApi);
      }
    },
  });
}

export function useProxy<T>(target: T, onChanged: () => void) {
  const lastSubscriptionRef = useRef<() => void>();

  return useMemo(() => {
    const internalApi = createInternalApi();
    const original = Object.clone(target);
    const current = Object.clone(target);

    const proxy = createProxy(DynamicProxy.create(original), DynamicProxy.create(current), __PROXY_ROOT__, internalApi) as T;

    if (lastSubscriptionRef.current) lastSubscriptionRef.current();
    const api = (proxy as never)[__FORM_PROXY__] as ProxyFieldApi;
    lastSubscriptionRef.current = api.current.onSubPropertyChanged(() => onChanged());

    return {
      proxy,
      current,
      original,
      setAllFieldsIsTouched: internalApi.setTouched,
    };
  }, [target]);
}

export function useProxyField<T>(field: T): ProxyFieldApi<T> {
  return (field as never)[__FORM_PROXY__];
}