import { AnyObject, bind, Unsubscribe } from 'anux-common';

interface Props {
  propertyKey: string | number | symbol;
  hadValue: boolean;
  getRecord(ensureValue: false): AnyObject | undefined;
  getRecord(ensureValue: true): AnyObject;
  onValueChanged(): void;
  removeEmptyFields(): void;
}

export class FieldProxy<T = unknown, R extends {} = {}> {
  constructor(props: Props) {
    this.#props = props;
    this.#onUpdateHandlers = new Set();
    this.#hasBeenTouched = false;
  }

  #props: Props;
  #onUpdateHandlers: Set<() => void>;
  #hasBeenTouched: boolean;

  public get recordType(): R { return null as unknown as R; }

  public get get(): T {
    const { getRecord, propertyKey } = this.#props;
    const record = getRecord(false);
    if (record == null) return undefined as unknown as T;
    return Reflect.get(record, propertyKey);
  }

  public get hasBeenTouched() { return this.#hasBeenTouched; }

  @bind
  public set(value: unknown) {
    const { getRecord, propertyKey, hadValue, removeEmptyFields } = this.#props;
    const record = getRecord(true);
    value = this.convertValue(value);
    Reflect.set(record, propertyKey, value);
    if (value == null && !hadValue) {
      this.#hasBeenTouched = false; // must be done before a reset
      removeEmptyFields();
    }
    this.updated();
  }

  @bind
  public onUpdate(handler: () => void): Unsubscribe {
    this.#onUpdateHandlers.add(handler);
    return () => this.#onUpdateHandlers.delete(handler);
  }

  public setTouched(hasBeenTouched: boolean): void {
    this.#hasBeenTouched = hasBeenTouched;
  }

  private updated(): void {
    const { onValueChanged } = this.#props;
    this.#hasBeenTouched = true;
    this.#onUpdateHandlers.forEach(handler => {
      if (!this.#onUpdateHandlers.has(handler)) return;
      handler();
    });
    onValueChanged();

  }

  private convertValue(value: unknown): unknown {
    const { hadValue = false } = this.#props;
    if (value != null && (typeof (value) === 'string' && value.length > 0)) return value;
    if (hadValue) return value;
    return undefined;
  }

  private toJSON(): AnyObject {
    const { propertyKey, hadValue } = this.#props;
    return {
      propertyKey,
      hadValue,
      hasBeenTouched: this.#hasBeenTouched,
    };
  }
}

/*
{
    get: T;
    recordType: R;
    hasBeenTouched: boolean;
    set(value: T): void;
    onUpdate(handler: () => void): Unsubscribe;
  }
  */