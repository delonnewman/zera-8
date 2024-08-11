import { hashString, hashCombine, hashCode } from './utils';

export default class ZMessageTemplate {
  static unary(name, metaData = new Map()) {
    return new ZUnaryMessageTemplate(name, metaData);
  }

  static binary(name, metaData = new Map()) {
    return new ZBinaryMessageTemplate(name, metaData);
  }

  static keyword(name, keywords, metaData = new Map()) {
    return new ZKeywordMessageTemplate(name, keywords, metaData);
  }

  #name;
  #hashCode;
  #metaData;

  constructor(name, metaData) {
    this.#name = name;
    this.#metaData = metaData;
  }

  get name() { return this.#name }
  get metaData { return this.#metaData }

  // response / return value expected
  isQuery() {
    return this.metaData.get('query') || this.isPredicate();
  }

  // response / return value expected of a boolean or nil value
  isPredicate() {
    return this.metaData.get('predicate');
  }

  // no response / return value
  isCommand() {
    return true;
  }

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

class ZUnaryMessageTemplate extends ZMessageTemplate {
  withMetaData(metaData) {
    return new ZUnaryMessageTemplate(this.name, metaData);
  }
}

class ZBinaryMessageTemplate extends ZMessageTemplate {
  withMetaData(metaData) {
    return new ZBinaryMessageTemplate(this.name, metaData);
  }
}

class ZKeywordMessageTemplate extends ZMessageTemplate {
  #keywords;
  #hashCode;

  constructor(name, keywords) {
    super(name);
    this.#keywords = keywords;
  }

  get keywords() { return this.#keywords }

  withMetaData(metaData) {
    return new ZKeywordMessageTemplate(this.name, this.keywords, metaData);
  }

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
