import ZBasicObject from './ZBasicObject.js';

export default class ZBinding extends ZBasicObject {
  #names;

  constructor() {
    super();
    this.#names = {}
  }

  setName(name, value) {
    this.#names[name] = value;
  }

  getValueOf(name) {
    return this.#names[name];
  }
}
