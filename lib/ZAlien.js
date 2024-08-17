import ZBasicObject from './ZBasicObject.js';
import JavaScript from './JavaScript';

export default class ZAlien extends ZBasicObject {
  static OBJECTS = new WeakMap();

  static new(constructor) {
    if (!this.OBJECTS.has(constructor)) {
      this.OBJECTS.set(constructor, new this(constructor));
    }

    return this.OBJECTS.get(constructor);
  }

  #subject;

  constructor(subject) {
    super();
    this.#subject = subject;
  }

  get subject() { return this.#subject }

  async send(message) {
    return JavaScript.send(this.#subject, message);
  }
}
