import ZBasicObject from './ZBasicObject.js';

export default class ZNumberRegister extends ZBasicObject {
  static SAFE_OPS = Object.freeze(new Set(['+', '-', '*', '/', '%', '**']));
  static BINARY_OPS = Object.freeze(new Set(['+', '*', '/', '%', '**']));
  static REGISTERS = {};

  static isValidOp(symbol) {
    return this.SAFE_OPS.has(symbol);
  }

  static select(symbol) {
    if (!this.isValidOp(symbol)) {
      throw new Error(`unknown operation ${symbol}`);
    }

    let reg = this.REGISTERS[symbol];
    if (reg === undefined) {
      reg = this.REGISTERS[symbol] = new this(symbol);
    }

    return reg;
  }

  #operator;
  #terms;
  #isBinary;

  constructor(operator) {
    super();
    this.#operator = operator;
    this.#isBinary = ZNumberRegister.BINARY_OPS.has(operator);
    this.#terms = [];
  }

  push(term) {
    this.validateTerm(term);
    this.#terms.push(term);
    return this;
  }

  validateTerm(term) {
    if (this.#terms.length > 1) {
      throw new Error(`only up to two terms are supported`);
    }
    if (typeof term !== 'number') {
      throw new Error(`terms must be numbers, got ${term} instead`);
    }
  }

  isBinary() {
    return this.#isBinary;
  }

  reset() {
    this.#terms = [];
  }

  validate() {
    if (this.#terms.length < 1) {
      throw new Error('at least one term must be set');
    }

    if (this.#isBinary && this.#terms.length < 2) {
      throw new Error(`both terms must be set for ${this.#operator}`);
    }
  }

  toJavaScript() {
    this.validate();

    if (this.#isBinary) {
      return `${this.#terms[0]} ${this.#operator} ${this.#terms[1]}`;
    } else {
      return `${this.#operator}${this.#terms[0]}`;
    }
  }

  perform() {
    const result = eval(this.toJavaScript());
    this.reset();

    return result;
  }
}
