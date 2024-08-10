import { hashString, hashCombine, hashCode } from './utils';

export default class ZMessageTemplate {
  static unary(name) {
    return new ZUnaryMessageTemplate(name);
  }

  static binary(name) {
    return new ZBinaryMessageTemplate(name);
  }

  static keyword(name, keywords) {
    return new ZKeywordMessageTemplate(name, keywords);
  }

  #name;
  #hashCode;

  constructor(name) {
    this.#name = name;
  }

  get name() { return this.#name }

  hashCode() {
    if (this.#hashCode === undefined) {
      this.#hashCode = hashString(this.name);
    }

    return this.#hashCode;
  }

  toString() {
    return this.name.toString();
  }
}

class ZUnaryMessageTemplate extends ZMessageTemplate {}
class ZBinaryMessageTemplate extends ZMessageTemplate {}

class ZKeywordMessageTemplate extends ZMessageTemplate {
  #keywords;
  #hashCode;

  constructor(name, keywords) {
    super(name);
    this.#keywords = keywords;
  }

  get keywords() { return this.#keywords }

  toString() {
    const buffer = [this.name.toString()];
    buffer.push('(')

    const args = []
    for (const keyword of this.keywords) {
      args.push(`${keyword}:`)
    }

    buffer.push(args.join(', '));
    buffer.push(')');

    return buffer.join('');
  }

  hashCode() {
    if (this.#hashCode === undefined) {
      let code = 0;

      for (const keyword of this.keywords) {
        code += hashCombine(code, hashString(keyword));
      }

      this.#hashCode = code;
    }

    return this.#hashCode;
  }
}
