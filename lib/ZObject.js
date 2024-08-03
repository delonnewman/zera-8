export default class ZObject {
  static CURRENT_ID = 0;

  #object_id;
  #variables;

  constructor(klass = undefined) {
    this.#object_id = this.CURRENT_ID++;
    this.#variables = {};
  }

  get object_id() { return this.#object_id }

  defineVariable(name) {

  }

  defineMethod(...args) {
    return this.class.defineInstanceMethod(...args);
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

  findMethodData(method) {
    return this.class.findMethodData(method);
  }
}
