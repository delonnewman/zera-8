export default class ZBinaryOp {
  static add() { return new this('+') }
  static mult() { return new this('*') }
  static div() { return new this('/') }
  static exp() { return new this('**') }
  static mod() { return new this('%') }

  #firstTerm
  #secondTerm
  #operator

  constructor(operator) {
    this.#operator = operator;
  }

  set firstTerm(value) {
    if (this.#firstTerm !== undefined) {
      throw new Error('first term has been set');
    }
    this.#firstTerm = value;
  }

  set secondTerm(value) {
    if (this.#secondTerm !== undefined) {
      throw new Error('second term has been set');
    }
    this.#secondTerm = value;
  }

  perform() {
    const result = eval(`${this.#firstTerm} ${this.#operator} ${this.#secondTerm}`);
    this.#firstTerm = undefined;
    this.#secondTerm = undefined;
    return result;
  }
}
