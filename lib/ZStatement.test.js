import ZScript, { ZStatement } from './ZScript';
import ZMessage from './ZMessage';
import { describe, expect, it, describe as context } from 'vitest';

describe(ZStatement, () => {
  const script = new ZScript();
  const statement = new ZStatement(script, 1, ZMessage.binary('+', 2));

  it('enables the continuation of a statement', () => {
    expect(statement.andThenSay(ZMessage.binary('+', 3))).to.equal(statement)
  });

  context('when a statement is continued', () => {
    it('increases the length of the statement', () => {
      expect(() => {
        statement.andThenSay(ZMessage.binary('+', 3));
      }).to.change(() => statement.length);
    });

    it('contintues the script when the statement is complete', () => {
      expect(statement.say(1, ZMessage.binary('-', 5))).to.equal(script);
    });
  });
});
