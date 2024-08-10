import { hashString, hashCombine, hashCode } from './utils';

export default class ZMessage {
  static unary(name) {
    return new ZUnaryMessage(name);
  }

  static binary(name, argument) {
    return new ZBinaryMessage(name, argument);
  }

  static keyword(name, keywordArguments) {
    return new ZKeywordMessage(name, keywordArguments);
  }

  #name;

  constructor(name) {
    this.#name = name;
  }

  get name() { return this.#name }

  toArguments() {
    throw new Error('not implemented');
  }

  hashCode() {
    throw new Error('not implemented');
  }
}

class ZUnaryMessage extends ZMessage {
  #hashCode;

  constructor(name) {
    super(name, undefined, undefined);
  }

  toString() {
    return this.name.toString();
  }

  toArguments() {
    return [];
  }

  hashCode() {
    if (this.#hashCode === undefined) {
      this.#hashCode = hashString(this.name);
    }

    return this.#hashCode;
  }
}

class ZBinaryMessage extends ZMessage {
  #argument;
  #hashCode;

  constructor(name, argument) {
    super(name);
    this.#argument = argument;
  }

  get argument() { return this.#argument }

  toString() {
    return `${this.name}(${this.argument})`
  }

  toArguments() {
    return [this.argument];
  }

  hashCode() {
    if (this.#hashCode === undefined) {
      this.#hashCode = hashString(this.name);
    }

    return this.#hashCode;
  }
}

class ZKeywordMessage extends ZMessage {
  #keywordArguments;
  #hashCode;

  constructor(name, keywordArguments) {
    super(name);
    this.#keywordArguments = keywordArguments;
  }

  get keywords() { return Object.keys(this.#keywordArguments) }

  keywordArgument(keyword) {
    const arg = this.#keywordArguments[keyword];
    if (arg === undefined) {
      throw new Error(`unknown keyword: ${keyword}`)
    }

    return arg;
  }

  toString() {
    const buffer = [this.name.toString()];
    buffer.push('(')

    const args = []
    for (const keyword of this.keywords) {
      args.push(`${keyword}: ${this.keywordArgument(keyword).toString()}`)
    }

    buffer.push(args.join(', '));
    buffer.push(')');

    return buffer.join('');
  }

  toArguments() {
    return this.keywordArguments;
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
