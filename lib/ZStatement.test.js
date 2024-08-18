import ZAlien from './ZAlien';
import ZMessage from './ZMessage';
import ZScript, { ZStatement } from './ZScript';
import { describe, expect, it, describe as context } from 'vitest';

describe(ZStatement, () => {
  const script = new ZScript();
  const statement = new ZStatement(script, 1, ZMessage.binary('+', 2));

  it('enables the continuation of a statement', () => {
    expect(statement.andThenSay(ZMessage.binary('+', 3))).to.equal(statement)
  });

  it('can be executed', async () => {
    const alien = ZAlien.new({
      a: 1,
    });

    new ZStatement(script, alien, ZMessage.binary('a', 2, new Map([['assignment', true]])))
      .execute();

    await expect(alien.send(ZMessage.unary('a'))).resolves.to.equal(2);
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
