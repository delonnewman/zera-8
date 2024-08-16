import { hashString, hashCombine, hashCode } from './utils.js';

export default class ZMessage {
  static unary(name, metaData = new Map()) {
    return new ZUnaryMessage(name, metaData);
  }

  static binary(name, argument, metaData = new Map()) {
    return new ZBinaryMessage(name, argument, metaData);
  }

  static keyword(name, keywordArguments, metaData = new Map()) {
    return new ZKeywordMessage(name, keywordArguments, metaData);
  }

  static argumentList(name, arglist, metaData = new Map()) {
    return new ZArgumentListMessage(name, arglist, metaData);
  }

  #name;
  #metaData;

  constructor(name, metaData) {
    this.#name = name;
    this.#metaData = metaData;
  }

  get name() { return this.#name }
  get metaData() { return this.#metaData }

  withMetaData(metaData) {
    throw new Error('not implemented');
  }

  toArguments() {
    throw new Error('not implemented');
  }

  hashCode() {
    throw new Error('not implemented');
  }

  isAssignment() { return false }
}

class ZUnaryMessage extends ZMessage {
  #hashCode;

  withMetaData(metaData) {
    return new ZUnaryMessage(this.name, metaData);
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

  constructor(name, argument, metaData) {
    super(name, metaData);
    this.#argument = argument;
  }

  get argument() { return this.#argument }

  withMetaData(metaData) {
    return new ZBinaryMessage(this.name, this.argument, metaData);
  }

  isAssignment() {
    return this.metaData.has('assignment');
  }

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

  constructor(name, keywordArguments, metaData) {
    super(name, metaData);
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

  withMetaData(metaData) {
    return new ZKeywordMessage(this.name, this.#keywordArguments, metaData);
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

class ZArgumentListMessage extends ZMessage {
  #argumentList;
  #hashCode;

  constructor(name, argumentList, metaData) {
    super(name, metaData);
    this.#argumentList = argumentList;
  }

  get argumentList() { return this.#argumentList }

  toArguments() {
    return this.argumentsList;
  }

  withMetaData(metaData) {
    return new ZArgumentListMessage(this.name, this.argumentsList, metaData);
  }

  hashCode() {
    if (this.#hashCode === undefined) {
      let code = 0;

      for (const arg of this.argumentList) {
        code += hashCombine(code, hashCode(arg));
      }

      this.#hashCode = code;
    }

    return this.#hashCode;
  }
}
