export const REGEX_EMAIL =
  /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

export const REGEX_PARSE_INPUT_EMAIL = /[^\.|\d|a-z|A-Z|\_|\-|@]/g;
export const REGEX_PARSE_INPUT = /[^\.|\d|a-z|A-Z]/g;
export const REGEX_PARSE_INPUT_NUMBER_FILTER = /[^.\d]/g;
export const REGEX_PARSE_INPUT_NUMBER = /^(\d*\.?)|(\d*)\.?/g;
export const REGEX_PARSE_INPUT_POSITIVE = /[^\d]/g;
export const REGEX_PARSE_INPUT_DECIMALS_AMOUNT_POSITIVE = /\.\d*/g;
export const REGEX_PARSE_INPUT_DECIMALS_AMOUNT_DECIMALS = /\d*/;

export const REGEX_DECIMALS_AMOUNT = /\d\.\d/;

export const REGEX_KEY_DOWN_INPUT = /^[\.|\d|a-z|A-Z]+$/;
export const REGEX_KEY_DOWN_INPUT_NUMBER = /^[\.|\d|a-z|A-Z]+$/;
