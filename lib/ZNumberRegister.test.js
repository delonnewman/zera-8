import ZNumberRegister from './ZNumberRegister';
import { describe, it, expect } from 'vitest';

describe(ZNumberRegister, () => {
  const describedClass = ZNumberRegister;

  it('performs operations atomically', () => {
    const op = describedClass.select('+');
    op.push(1)
    op.push(3)

    expect(op.perform()).toBe(4);
  });

  it('performs unary operations', () => {
    const neg = describedClass.select('-');
    neg.push(2);

    expect(neg.perform()).to.equal(-2);
  });

  it('resets the terms when the operation is performed', () => {
    const op = describedClass.select('+');
    op.push(1);
    op.push(3);
    op.perform();
    op.push(4);
    op.push(5);

    expect(op.perform()).toBe(9);
  });

  it('esures that both terms are set for binary operations', () => {
    const mult = describedClass.select('*');
    mult.push(1);

    expect(() => { mult.perform() }).to.throw(/both terms must be set/);
  });

  it('ensures that the first term is set for unary operations', () => {
    const neg = describedClass.select('-');

    expect(() => { neg.perform() }).to.throw(/at least one term must be set/);
  });

  it('ensures that the first term is a number', () => {
    const div = describedClass.select('/');

    expect(() => { div.push('`rm -rf /`' ) }).to.throw(/terms must be numbers/);
  });

  it('ensures that the second term is a number', () => {
    const div = describedClass.select('/');

    expect(() => { div.push('`rm -rf /`') }).to.throw(/terms must be numbers/);
  });

  it('only supports up to two terms at a time for now', () => {
    const div = describedClass.select('/');
    div.push(3);
    div.push(4);

    expect(() => { div.push(5) }).to.throw(/only up to two terms are supported/);
  });

  describe('.select', () => {
    it('ensures that only valid operations can be performed', () => {
      expect(() => { describedClass.select('`rm -rf /`') }).to.throw(/unknown operation/);
    });

    it('ensures that only one register per operation is created', () => {
      const mult = describedClass.select('*');

      expect(describedClass.select('*')).to.equal(mult);
    });
  });
});
