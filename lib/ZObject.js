export default class ZObject {
  static CURRENT_ID = 1;

  #id;
  #receiver;

  constructor() {
    this.#id = ZObject.CURRENT_ID++;
  }

  get id() {
    return this.#id;
  }

  receive(fn) {
    this.#receiver = fn;
  }

  async send(message) {
    if (this.#receiver) {
      return this.#receiver.call(this, message);
    }
  }
}
