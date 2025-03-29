import UnknownNumber from '@/types/UnknownNumber';
import BN from 'bignumber.js';

export const isNormalPositive = (
  value?: UnknownNumber | undefined | null,
  noZero?: boolean
) => {
  if (!value) {
    return false;
  }

  const bn = new BN(value);

  return !!(
    (noZero ? bn.gt('0') : bn.gte('0')) &&
    !bn.isNaN() &&
    bn.isFinite()
  );
};
