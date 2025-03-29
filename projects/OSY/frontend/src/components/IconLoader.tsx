import styled, { keyframes } from 'styled-components';
import { IconSpiner } from '@/components/icons';
import Icon, { Props as IconProps } from '@/components/icons/Icon';

export interface Props extends IconProps {
  duration?: number;
}

const DEFAULT_SIZE = '24px';
const DEFAULT_COLOR = '#fff';

const KEYFRAME_SPIN = keyframes`
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
`;

const Root = styled.div<Props>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: ${({ size }) => size ?? DEFAULT_SIZE}px;
  height: ${({ size }) => size ?? DEFAULT_SIZE}px;

  & svg {
    animation-name: ${KEYFRAME_SPIN};
    animation-timing-function: cubic-bezier(0, 0, 1, 1);
    animation-duration: ${({ duration }) => duration ?? 0.5}s;
    animation-iteration-count: infinite;
  }
`;

export default function IconLoader({
  size = DEFAULT_SIZE,
  color = DEFAULT_COLOR,
  ...props
}: Props) {
  return (
    <Root {...props}>
      <Icon icon={IconSpiner} {...props} size={size} color={color} />
    </Root>
  );
}
