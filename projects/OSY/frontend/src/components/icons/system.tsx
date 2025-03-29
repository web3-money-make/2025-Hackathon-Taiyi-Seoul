import Icon, { Props } from './Icon';
import {
  SvgIconWallet,
  SvgIconFailFilled,
  SvgIconCheckFilled,
  SvgIconCancelFilled,
  SvgIconSpiner,
} from './svgComponent';

export function IconWallet(props: Props) {
  return <Icon {...props} icon={SvgIconWallet} />;
}

export function IconFailFilled(props: Props) {
  return <Icon {...props} icon={SvgIconFailFilled} />;
}

export function IconCheckFilled(props: Props) {
  return <Icon {...props} icon={SvgIconCheckFilled} />;
}

export function IconCancelFilled(props: Props) {
  return <Icon {...props} icon={SvgIconCancelFilled} />;
}

export function IconSpiner(props: Props) {
  return <Icon {...props} icon={SvgIconSpiner} />;
}
