export default class ZObject {
  static CURRENT_ID = 1;

  #objectId;
  #variables;
  #eigenClass;
  #class;

  constructor(klass = undefined) {
    this.#objectId = ZObject.CURRENT_ID++;
    this.#variables = {};
    this.#class = klass;
  }

  get class() {
    if (this.#class !== undefined) {
      return this.#class;
    }

    if (this.#eigenClass === undefined) {
      this.#eigenClass = new ZClass();
    }

    return this.#eigenClass;
  }

  get objectId() { return this.#objectId }

  setVariable(name, value) {
    if (this.isSlotUndefined(name)) {
      return this.slotUndefined(name, value);
    }

    this.#variables[name] = value;
    return value;
  }

  getVariable(name) {
    return this.#variables[name];
  }

  isSlotUndefined(name) {
    return !this.class.hasSlot(name);
  }

  slotUndefined(name, _value) {
    throw new Error(`undefined variable ${name}`);
  }

  defineMethod(...args) {
    return this.class.defineInstanceMethod(...args);
  }

  receive(message) {
    const block = this.class.getMethodBlock(message);
    const args = message.toArguments();

    if (block === undefined) {
      return this.methodMissing(message, args);
    }

    return block.invoke(args);
  }

  methodMissing(method, args) {
    throw new Error(`undefined method ${method}`);
  }

  privateMethodCalled(method, args) {
    throw new Error(`private method ${method} called from `);
  }

  respondsTo(method) {
    return this.class.hasMethod(method);
  }
}
