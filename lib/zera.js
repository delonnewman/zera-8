import ZAlien from './ZAlien.js';
import ZAlienClass from './ZAlienClass.js';
import ZMessage from './ZMessage.js';

export * from './ZBasicObject.js';
export * from './ZMessage.js';
export * from './ZAlien.js';
export * from './ZAlienClass.js';

export const JSConsole = ZAlien.new(console);
export const JSGlobal = ZAlien.new(globalThis);

export const JSMath = ZAlien.new(Math);
export const JSDate = ZAlienClass.new(Date);
export const JSNumber = ZAlienClass.new(Number);
export const JSBigInt = ZAlienClass.new(BigInt);

export const JSString = ZAlienClass.new(String);
export const JSRegExp = ZAlienClass.new(RegExp);

export const JSArray = ZAlienClass.new(Array);
export const JSMap = ZAlienClass.new(Map);
export const JSSet = ZAlienClass.new(Set);
export const JSJSON = ZAlien.new(JSON);

export const JSObject = ZAlien.new(Object)
export const JSError = ZAlien.new(Error);

const script = new ZScript(new ZBinding());

script
  .sayAndIdentify(JSArray, ZMessage.unary('new'), { as: 'a' })
  .callUpon('a')
  .andThenSay(ZMessage.indexedAssignment(0, 1))
  .say(JSConsole, ZMessage.binary('log', dialog.callUponAndAwait('a')))
  .perform();
