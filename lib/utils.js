export const isFunction = (object) =>
  Object.prototype.toString.call(object) === "[object Function]";

export const EMPTY_ARRAY = Object.freeze([]);

const STR_CACHE_MAX = 256;

export const hashString = function() {
  let stringCodeCache = {};
  let stringCodeCacheSize = 0;

  return function(str) {
    // a la goog.string.HashCode
    // http://docs.closure-library.googlecode.com/git/local_closure_goog_string_string.js.source.html#line1206
    let cached = stringCodeCache[str];
    if (cached != null) {
      return cached;
    }

    let code = 0;
    for (let i = 0; i < str.length; ++i) {
      code = 31 * code + str.charCodeAt(i);
      code %= 0x100000000;
    }
    stringCodeCacheSize++;

    if (stringCodeCacheSize >= STR_CACHE_MAX) {
      stringCodeCache = {};
      stringCodeCacheSize = 1;
    }
    stringCodeCache[str] = code;

    return code;
  };
}();

export function hashCombine(seed, hash) {
  return seed ^ (hash + 0x9e3779b9 + (seed << 6) + (seed >> 2));
}

export function hashCode(value) {
  if (value == null) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'boolean') return value === true ? 1 : 0;
  if (typeof value === 'string') return hashString(value);

  return value.hashCode();
}
