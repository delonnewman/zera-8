import ZBasicObject from './ZBasicObject.js';
import JavaScript from './JavaScript';

export default class ZAlien extends ZBasicObject {
  #subject;

  constructor(subject) {
    super();
    this.#subject = subject;
  }

  async send(message) {
    return JavaScript.send(this.#subject, message);
  }
}
