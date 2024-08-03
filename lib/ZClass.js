import ZObject from './ZObject';

export default class ZClass extends ZObject {
  #slots;
  #instanceMethods;

  constructor(name = NIL, superclass = NIL) {
    super();
    this.name = name;
    this.superclass = superclass;
    this.#instanceMethods = {};
    this.#slots = {};
    // expose these methods for the ancestral classes
    this.class.defineInstanceMethods("allocate", this.allocate.bind(this));
    this.class.defineInstanceMethods("subclass", this.subclass.bind(this));
    this.class.defineInstanceMethods("class", () => Class);
  }

  defineSlot(name) {
    this.#slots[name] = true;
    return name;
  }

  hasSlot(name) {
    return this.#slots[name];
  }

  defineInstanceMethod(name, body, parameters = EMPTY_ARRAY, meta = {}) {
    this.#instanceMethods[name] = { parameters, body, meta };
    return name;
  }

  allocate() {
    return new ZObject(this);
  }

  hasMethod(method) {
    if (this.superclass === NIL) {
      return this.#instanceMethods[method] !== undefined;
    }
  }

  subclass(name) {
    return new ZClass(name, self);
  }
}
