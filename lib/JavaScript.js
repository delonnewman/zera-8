import { isFunction } from './utils.js';

export default class JavaScript {
  static messageDispatch(subject, message) {
    const obj = subject[message.name];
    if (obj === undefined) {
      throw new Error(`unknown method ${message}`);
    }

    if (isFunction(obj)) {
      return obj.apply(subject, message.toArguments());
    } else {
      return obj;
    }
  }
}
