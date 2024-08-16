import { isFunction } from './utils.js';

export default class JavaScript {
  static send(subject, message) {
    const obj = subject[message.name];
    if (obj === undefined) {
      throw new Error(`unknown method ${message}`);
    }

    if (message.isAssignment()) {
      subject[message.name] = message.argument;
      return subject;
    } else if (isFunction(obj)) {
      return obj.apply(subject, message.toArguments());
    } else {
      return obj;
    }
  }
}
