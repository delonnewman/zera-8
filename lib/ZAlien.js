import ZObject from './ZObject';
import { isFunction } from './utils';

export default class ZAlien extends ZObject {

  constructor(subject) {
    super();
    this.receive(function(message) {
      const obj = subject[message.name];
      if (obj === undefined) {
        throw new Error(`unknown method #{message}`);
      }

      if (isFunction(obj)) {
        return obj.apply(subject, message.toArguments());
      } else {
        return obj;
      }
    });
  }
}
