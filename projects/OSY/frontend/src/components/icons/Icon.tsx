import SvgIconProps from '@/types/SvgIconProps';

export interface Props {
  size?: string;
  color?: string;
  icon?: React.FC<SvgIconProps>;
}

export default function Icon({ size, color, icon }: Props) {
  return <>{icon?.({ size, color })}</>;
}
