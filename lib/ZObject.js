export default class ZObject {
  static CURRENT_ID = 1;

  #id;
  #receiving;

  constructor() {
    this.#id = ZObject.CURRENT_ID++;
    this.#receiving = false;
  }

  get id() {
    return this.#id;
  }

  isReceiving() {
    return this.#receiving === true;
  }

  async send(message) {
    if (!this.isReceiving()) {
      throw new Error(`unable to recieve message ${message}`);
    }
  }
}
