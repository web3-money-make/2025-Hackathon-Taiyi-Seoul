import { useMemo } from 'react';
import {
  IconCancelFilled,
  IconCheckFilled,
  IconFailFilled,
} from '@/components/icons';
import Icon, { Props as IconProps } from '@/components/icons/Icon';
import IconLoader from './IconLoader';

const STATUSES = ['progress', 'success', 'fail', 'cancel'] as const;

export type StatusIconValue = (typeof STATUSES)[number];

export interface Props extends IconProps {
  value?: StatusIconValue;
  statusProps?: {
    progress?: IconProps;
    success?: IconProps;
    fail?: IconProps;
    cancel?: IconProps;
  };
}

const STATUS_PROPS_PROGRESS: IconProps = {
  color: '#fff',
  icon: IconLoader,
};
const STATUS_PROPS_SUCCESS: IconProps = {
  color: 'positive',
  icon: IconCheckFilled,
};
const STATUS_PROPS_FAIL: IconProps = {
  color: 'negative',
  icon: IconFailFilled,
};
const STATUS_PROPS_CANCEL: IconProps = {
  color: 'notice',
  icon: IconCancelFilled,
};

export default function StatusIcon({ value, statusProps, ...props }: Props) {
  const mergedStatusProps: { [key in StatusIconValue]: IconProps } = useMemo(
    () => ({
      progress: STATUS_PROPS_PROGRESS,
      success: STATUS_PROPS_SUCCESS,
      fail: STATUS_PROPS_FAIL,
      cancel: STATUS_PROPS_CANCEL,
      ...statusProps,
    }),
    [statusProps]
  );
  const iconProps = useMemo(
    () => (value ? mergedStatusProps[value] : undefined),
    [mergedStatusProps, value]
  );

  return (
    <div className="inline-flex items-center justify-center">
      <Icon {...props} {...iconProps} />
    </div>
  );
}
