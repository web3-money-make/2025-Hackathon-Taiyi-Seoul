import {
  REGEX_PARSE_INPUT_EMAIL,
  REGEX_PARSE_INPUT,
  REGEX_PARSE_INPUT_NUMBER_FILTER,
  REGEX_PARSE_INPUT_NUMBER,
  REGEX_PARSE_INPUT_POSITIVE,
  REGEX_PARSE_INPUT_DECIMALS_AMOUNT_POSITIVE,
  REGEX_PARSE_INPUT_DECIMALS_AMOUNT_DECIMALS,
  REGEX_DECIMALS_AMOUNT,
  REGEX_KEY_DOWN_INPUT,
  REGEX_KEY_DOWN_INPUT_NUMBER,
} from '@/configs/regex';
import { isNormalPositive } from './number';

export const parseEmailInput = (value?: string) =>
  (value ?? '').replace(REGEX_PARSE_INPUT_EMAIL, '');
export const parseInput = (value?: string) =>
  (value ?? '').replace(REGEX_PARSE_INPUT, '');
export const parseNumberInput = (value?: string) =>
  (value ?? '')
    .replace(REGEX_PARSE_INPUT_NUMBER_FILTER, '')
    .replace(REGEX_PARSE_INPUT_NUMBER, '$1$2');
export const parsePositiveInput = (value?: string) =>
  (value ?? '').replace(REGEX_PARSE_INPUT_POSITIVE, '');
export const parseDecimalsAmount = (value?: string, decimals?: number) => {
  if (
    !(
      isNormalPositive(value, true) &&
      isNormalPositive(decimals, true) &&
      REGEX_DECIMALS_AMOUNT.test(value ?? '')
    )
  ) {
    return value ?? '';
  }

  return `${(value ?? '').replace(REGEX_PARSE_INPUT_DECIMALS_AMOUNT_POSITIVE, '')}${(value ?? '').replace(REGEX_PARSE_INPUT_DECIMALS_AMOUNT_DECIMALS, '').slice(0, decimals)}`;
};

export const handleEmailInputChange =
  (
    onChange?: React.ChangeEventHandler<HTMLInputElement>,
    option?: { isDisabled?: boolean; isReadonly?: boolean }
  ) =>
  (event: React.ChangeEvent<HTMLInputElement>) =>
    option?.isDisabled || option?.isReadonly
      ? undefined
      : onChange?.({
          ...event,
          target: {
            ...event.target,
            value: parseEmailInput(event.target.value),
          },
        });
export const handleInputChange =
  (
    onChange?: React.ChangeEventHandler<HTMLInputElement>,
    option?: { isDisabled?: boolean; isReadonly?: boolean }
  ) =>
  (event: React.ChangeEvent<HTMLInputElement>) =>
    option?.isDisabled || option?.isReadonly
      ? undefined
      : onChange?.({
          ...event,
          target: {
            ...event.target,
            value: parseInput(event.target.value),
          },
        });
export const handleNumberInputChange =
  (
    onChange?: React.ChangeEventHandler<HTMLInputElement>,
    option?: { isDisabled?: boolean; isReadonly?: boolean }
  ) =>
  (event: React.ChangeEvent<HTMLInputElement>) =>
    option?.isDisabled || option?.isReadonly
      ? undefined
      : onChange?.({
          ...event,
          target: {
            ...event.target,
            value: parseNumberInput(event.target.value),
          },
        });
export const handleDecimalsInputChange =
  (onChange?: React.ChangeEventHandler<HTMLInputElement>, decimals?: number) =>
  (event: React.ChangeEvent<HTMLInputElement>) =>
    onChange?.({
      ...event,
      target: {
        ...event.target,
        value: parseDecimalsAmount(event.target.value, decimals),
      },
    });

export const handleInputScroll = (event: React.MouseEvent<HTMLInputElement>) =>
  event.preventDefault();

export const handleInputKeyDown = (
  event: React.KeyboardEvent<HTMLInputElement>
) => {
  if (
    !(
      !['arrowup', 'arrowdown'].find(
        (word) => event.key.toLowerCase().indexOf(word) >= 0
      ) && REGEX_KEY_DOWN_INPUT.test(event.key)
    )
  ) {
    event.preventDefault();
    return;
  }
};
export const handleNumberInputKeyDown = (
  event: React.KeyboardEvent<HTMLInputElement>
) => {
  if (
    !(
      !['arrowup', 'arrowdown'].find(
        (word) => event.key.toLowerCase().indexOf(word) >= 0
      ) && REGEX_KEY_DOWN_INPUT_NUMBER.test(event.key)
    )
  ) {
    event.preventDefault();
    return;
  }
};
