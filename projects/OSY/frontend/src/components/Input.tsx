import React, { useCallback, useRef } from 'react';
import { parseNumberInput } from '@/utils/input';

export interface Props extends React.ComponentPropsWithoutRef<'input'> {
  isNumberInput?: boolean;
}

export default React.forwardRef(function Input(
  { disabled, readOnly, isNumberInput, onChange, ...props }: Props,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  // ref
  const inputRef = useRef<HTMLInputElement | null>(null);

  // callback
  const handleWheel = useCallback(
    (event: React.WheelEvent<HTMLInputElement>) => {
      try {
        (event.target as HTMLElement).blur();
      } catch (error) {}
    },
    []
  );
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      disabled || readOnly
        ? undefined
        : onChange?.(
            isNumberInput
              ? {
                  ...event,
                  target: {
                    ...event.target,
                    value: parseNumberInput(event.target.value),
                  },
                }
              : event
          ),
    [disabled, readOnly, onChange, isNumberInput]
  );

  return (
    <input
      {...props}
      className="h-[32px] px-2 text-[#000] rounded-[24px] bg-[#fff]"
      disabled={disabled}
      readOnly={readOnly}
      ref={ref ?? inputRef}
      onWheel={handleWheel}
      onChange={handleChange}
    />
  );
});
