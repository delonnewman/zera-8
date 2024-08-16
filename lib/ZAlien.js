import ZObject from './ZObject.js';
import JavaScript from './JavaScript';

export default class ZAlien extends ZObject {
  #subject;

  constructor(subject) {
    super();
    this.#subject = subject;
  }

  async send(message) {
    return JavaScript.messageDispatch(this.#subject, message);
  }
}
