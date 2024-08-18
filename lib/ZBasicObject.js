import JavaScript from './JavaScript';
import { isFunction } from './utils.js';

export default class ZBasicObject {
  static CURRENT_ID = 1;

  #id;

  constructor() {
    this.#id = ZBasicObject.CURRENT_ID++;
  }

  get id() {
    return this.#id;
  }

  subclassShouldImplement() {
    throw new Error('subclass should implement');
  }

  async send(message) {
    return JavaScript.send(this, message.evaluateArguments());
  }
}
