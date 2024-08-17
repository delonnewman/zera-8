import ZAlien from './ZAlien.js';
import ZAlienClass from './ZAlienClass.js';
import ZMessage from './ZMessage.js';

export const JSConsole = ZAlien.new(console);
export const JSGlobal = ZAlien.new(globalThis);

export const JSMath = ZAlien.new(Math);
export const JSDate = ZAlienClass.new(Date);
export const JSNumber = ZAlienClass.new(Number);
export const JSBigInt = ZAlienClass.new(BigInt);

export const JSString = ZAlienClass.new(String);
export const JSRegExp = ZAlienClass.new(RegExp);

export const JSArray = ZAlienClass.new(Array);

// new ZDialog(new ZBinding())
//   .dispatch(JSArray, ZMessage.unary('new'))
//   .andAssignVariable('a')
//   .dispatch(new ZVariableReference('a'), ZMessage.binary(0, 1, new Map([['assignment', true]])))
//   .dispatch(JSConsole, ZMessage.binary('log', new ZVariableReference('a')))
//   .execute();
