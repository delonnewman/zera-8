import ZObject from './ZObject';

export default class ZClass extends ZObject {
  #slots;
  #instanceMethods;

  constructor(name = undefined, superclass = undefined) {
    super();
    this.name = name;
    this.superclass = superclass;
    this.#instanceMethods = new Map();
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

  defineInstanceMethod(message, block) {
    this.#instanceMethods.set(message.hashCode(), block);
    return name;
  }

  allocate() {
    return new ZObject(this);
  }

  getMethodBlock(message) {
    let klass = this;

    if (this.superclass === undefined || this.#instanceMethods.has(message)) {
      return this.#instanceMethods.get(message.hashCode());
    }

    return this.superclass.getMethodBlock(message);
  }

  subclass(name) {
    return new ZClass(name, self);
  }
}
