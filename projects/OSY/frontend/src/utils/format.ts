import UnknownNumber from '@/types/UnknownNumber';
import BN from 'bignumber.js';

export const compareLowerStr = (a?: string, b?: string) =>
  typeof a === 'string' &&
  typeof b === 'string' &&
  a.toLowerCase() === b.toLowerCase();

export const isValidAddress = (address?: string): boolean =>
  !!address?.match(/^(0x)?[0-9a-fA-F]{40}$/);

export const formatDecimal = (value: UnknownNumber, decimalPlaceLength = 2) =>
  new BN(new BN(value).toFixed(decimalPlaceLength, BN.ROUND_FLOOR)).toFixed();
export const formatCommas = (value: UnknownNumber, decimalPlaceLength = 2) => {
  const [integerPlaces, decimalPlaces] = formatDecimal(
    value,
    decimalPlaceLength
  ).split('.');
  return `${integerPlaces.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${
    decimalPlaces ? `.${decimalPlaces.slice(0, decimalPlaceLength)}` : ''
  }`;
};

export const formatUnit = (value: UnknownNumber, decimalPlaces = 18) =>
  new BN(value).dividedBy(new BN('10').pow(decimalPlaces));
export const parseUnit = (value: UnknownNumber, decimalPlaces = 18) =>
  BN(value).multipliedBy(new BN('10').pow(decimalPlaces));

export const address2shorted = (
  value: string,
  prelength = 4,
  appendlength = 4
) =>
  value && value.length > prelength + appendlength
    ? `${value.slice(0, prelength)}...${value.slice(-appendlength)}`
    : '';
