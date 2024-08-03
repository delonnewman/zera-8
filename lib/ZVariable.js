export default class ZVariable {
  #value;
  #default;
  #observers;

  constructor(defaultValue) {
    this.#default = defaultValue;
    this.#observers = [];
  }

  setValue(value) {
    for (const observer of this.#observers) {
      observer.update(this.getValue(), value);
    }

    this.#value = value;

    return this;
  }

  getValue() {
    if (this.isNotSet()) {
      return this.#default;
    }

    return this.#value;
  }

  isNotSet() {
    return this.#value === undefined;
  }

  addObserver(observer) {
    this.#observers.push(observer);
    return this;
  }
}
