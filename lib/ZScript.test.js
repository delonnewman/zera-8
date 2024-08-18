import ZScript, { ZStatement } from './ZScript';
import ZMessage from './ZMessage';
import { describe, expect, it } from 'vitest';

describe(ZScript, () => {
  const script = new ZScript();

  it('stages a series of statements', () => {
    script.say(1, ZMessage.binary('+', 2)).say(2, ZMessage.binary('+', 3));

    expect(script.length).to.equal(2);
  });

  it('enables making statements and waiting for the result', () => {
    const result = script.sayAndAwait(1, ZMessage.binary('+'), 2);

    expect(result).to.be.an.instanceOf(ZStatement);
  });

  it('facilitates naming objects that result from statements', () => {
    const statement = script.sayAndAwait(1, ZMessage.binary('+', 4))
    script.identify(statement, { as: 'a' });

    expect(script.callUpon('a')).to.equal(statement);
  });
});
