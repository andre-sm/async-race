class Emitter<TPayload> {
  private subscribers: ((value: TPayload) => void)[] = [];
  private value: TPayload;

  constructor(initialValue: TPayload) {
    this.value = initialValue;
  }

  public emit(payload: TPayload) {
    this.value = payload;
    this.subscribers.forEach((callback) => callback(payload));
  }

  public subscribe(callback: (value: TPayload) => void) {
    callback(this.value);
    this.subscribers.push(callback);
  }
}

export class Store<TState extends object> {
  private state: TState;
  private proxy: TState;
  private emitters: Map<keyof TState, Emitter<TState[keyof TState]>> = new Map();

  constructor(defaultState: TState) {
    this.state = defaultState;
    Object.keys(defaultState).map((key) =>
      this.emitters.set(key as keyof TState, new Emitter(defaultState[key as keyof TState]))
    );
    const emitters = this.emitters;
    this.proxy = new Proxy(this.state, {
      // @ts-expect-error "proxy uses any type"
      set<K extends keyof TState>(target: TState, key: keyof TState, value: TState[K]) {
        target[key] = value;
        emitters.get(key as keyof TState)?.emit(value);
        return true;
      },
    });
  }

  public set(stateSlice: Partial<TState>) {
    Object.keys(stateSlice).forEach((key) => {
      this.proxy[key as keyof TState] = stateSlice[key as keyof TState] as TState[keyof TState];
    });
  }

  public get<K extends keyof TState>(key: K): TState[K] {
    return this.proxy[key];
  }

  public select<K extends keyof TState>(key: K) {
    return (this.emitters.get(key) as unknown) as Emitter<TState[K]>;
  }
}
