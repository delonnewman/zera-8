import ZBinding from './ZBinding';
import { describe, it, expect } from 'vitest';

describe(ZBinding, () => {
  const describedClass = ZBinding;
  const binding = new describedClass();

  it('names values', () => {
    binding.setName('a', 1);

    expect(binding.getValueOf('a')).to.equal(1);
  });
});
