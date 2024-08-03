export default class ZDispatch {
  static send(message, toObject) {
    const dispatch = new this();
    return dispatch.send(message, toObject);
  }

  #parent;
  #message;
  #toObject;

  constructor(parent = undefined) {
    this.#parent = parent;
  }

  send(message, toObject) {
    this.#message = message;
    this.#toObject = toObject;

    Object.freeze(this);

    return this;
  }

  then(message) {
    return new ZDispatch(this).send(message, this);
  }

  toString() {
    const buffer = [];

    if (this.#parent === undefined) {
      buffer.push(this.#toObject.toString());
      buffer.push('.')
      buffer.push(this.#message.toString());
    } else {

    }

    return buffer.join('');
  }
}
