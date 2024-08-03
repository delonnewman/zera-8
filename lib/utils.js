export const isFunction = (object) =>
  Object.prototype.toString.call(object) === "[object Function]";

export const EMPTY_ARRAY = Object.freeze([]);
