import { AnyObject, bind } from 'anux-common';
import { Field } from '../internalModels';
import { FieldProxy } from './fieldProxy';

interface Props {
  record: AnyObject | undefined;
  parent?: ObjectProxy;
  path?: string;
  propertyKey?: string | number | symbol;
  hadValue?: boolean;
  onValueChanged(): void;
}

export class ObjectProxy {
  constructor(props: Props) {
    this.#props = {
      ...props,
    };
    this.#children = new Map();
    this.#proxy = new Proxy({}, {
      get: this.handleGet,
    });
  }

  #props: Props;
  // #hadValue: boolean;
  #field: FieldProxy | undefined;
  #children: Map<string | number | symbol, ObjectProxy>;
  #proxy: AnyObject;

  public get proxy() { return this.#proxy; }
  public get record() { return this.getRecord(true); }

  public setTouched(hasBeenTouched: boolean): void {
    this.#children.forEach(child => child.setTouched(hasBeenTouched));
    this.#field?.setTouched(hasBeenTouched);
  }

  @bind
  private handleGet(target: AnyObject, propertyKey: string | number | symbol, receiver: unknown) {
    if (propertyKey === Field) return this.selfAsField();
    if (this.#field != null) throw new Error('You cannot call any values on this field without using the correct hooks.');
    if (this.#children.has(propertyKey)) return this.#children.get(propertyKey)?.proxy;
    const record = this.#props.record;
    if (!record) return this.createChild(propertyKey, undefined, false);
    return this.createChild(propertyKey, Reflect.get(record, propertyKey, receiver), Reflect.has(record, propertyKey));
  }

  private hasTouchedFields(): boolean {
    return (this.#field?.hasBeenTouched ?? false) || this.#children.toValuesArray().some(child => child.hasTouchedFields());
  }

  private createChild(propertyKey: string | number | symbol, value: AnyObject | undefined, hadValue: boolean): AnyObject {
    const { path, onValueChanged } = this.#props;
    const childProxy = new ObjectProxy({
      parent: this,
      propertyKey: propertyKey.toString(),
      path: [path ?? '', propertyKey.toString()].filter(item => item.trim().length > 0).join('.'),
      record: value,
      hadValue,
      onValueChanged,
    });
    this.#children.set(propertyKey, childProxy);
    return childProxy.proxy;
  }

  private selfAsField(): FieldProxy {
    if (this.#field) return this.#field;
    const { parent, hadValue = false, propertyKey, onValueChanged } = this.#props;
    this.#children.clear();
    if (!parent) throw new Error('The root object for a form must be a plain object.');
    if (!propertyKey) throw new Error('Unable to retrieve the property key for this field.');
    return this.#field = new FieldProxy({
      getRecord: parent.getRecord,
      propertyKey,
      hadValue,
      onValueChanged,
      removeEmptyFields: this.removeEmptyFields,
    });
  }

  private getRecord(ensureValue: true): AnyObject;
  private getRecord(ensureValue: false): AnyObject | undefined;
  @bind
  private getRecord(ensureValue: boolean) {
    let { record, parent, propertyKey } = this.#props;
    if (record || !ensureValue) return record;
    if (!parent) throw new Error('Unable to get the parent object to create a property for this child object.');
    const parentRecord = parent.getRecord(true);
    if (!propertyKey) throw new Error('This object proxy does not have a property key.');
    record = this.#props.record = {};
    Reflect.set(parentRecord, propertyKey, record);
    return record;
  }

  @bind
  private removeEmptyFields(): void {
    const { parent, hadValue, propertyKey } = this.#props;
    if (parent) parent.removeEmptyFields();
    if (hadValue) return;
    if (this.hasTouchedFields()) return;
    if (!parent) return;
    const parentRecord = parent.getRecord(false);
    if (!parentRecord) return;
    if (!propertyKey) throw new Error('Unable to clear record on parent because there is no property key for this field.');
    Reflect.deleteProperty(parentRecord, propertyKey);
  }

  private toJSON(): AnyObject {
    const { record, propertyKey, hadValue, path } = this.#props;
    return {
      record,
      propertyKey,
      hadValue,
      path,
      field: this.#field?.['toJSON'](),
      children: this.#children.toValuesArray().map(child => child.toJSON()),
    };
  }

}