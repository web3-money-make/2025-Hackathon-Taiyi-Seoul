'use client';

export type Props = React.ComponentPropsWithoutRef<'button'> & {
  readonly?: boolean;
};

export default function Button({
  className,
  disabled,
  readonly,
  ...props
}: Props) {
  return (
    <button
      className={`select-none rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-1 font-medium text-xs h-8 px-8 ${disabled || readonly ? `${disabled ? 'opacity-50 cursor-disallow ' : ''}pointer-events-none` : 'hover:bg-[#cccccc] cursor-pointer'} ${className}`}
      {...props}
    />
  );
}
