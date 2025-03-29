import { ICON_DEFAULT_COLOR, ICON_DEFAULT_SIZE } from '@/configs/icons';
import SvgIconProps from '@/types/SvgIconProps';

export const SvgIconWallet: React.FC<SvgIconProps> = ({
  size = ICON_DEFAULT_SIZE,
  color = ICON_DEFAULT_COLOR,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path
        d="M17.4105 12.1053H14.2852V13.9725H17.4105V12.1053Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 6.86778C3 6.63555 3.07877 6.4096 3.22343 6.22793L4.68941 4.38695C4.88411 4.14244 5.17964 4 5.49219 4H18.1944C18.7612 4 19.2206 4.45945 19.2206 5.02621V7.28783H20.1742C20.741 7.28783 21.2004 7.74729 21.2004 8.31404V18.1784C21.2004 18.7452 20.7409 19.2046 20.1742 19.2046H4.02621C3.46265 19.2046 3.0052 18.7503 3.00004 18.188C3.00002 18.185 3 18.182 3 18.179V6.86778ZM4.86717 7.16112L5.89755 5.86717H17.3534V7.28783H6.66158V9.15501H19.3332V17.3374H4.86717V7.16112Z"
        fill={color}
      />
    </g>
  </svg>
);

export const SvgIconFailFilled: React.FC<SvgIconProps> = ({
  size = ICON_DEFAULT_SIZE,
  color = ICON_DEFAULT_COLOR,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.07812 12C4.07812 7.58172 7.73677 4 12.155 4C16.5733 4 20.232 7.58172 20.232 12C20.232 16.4183 16.5733 20 12.155 20C7.73677 20 4.07812 16.4183 4.07812 12ZM14.9969 16L12.1935 13.1966L9.39009 16L8.23197 14.8419L11.0354 12.0385L8.23197 9.23504L9.39009 8.07692L12.1935 10.8803L14.9969 8.07692L16.155 9.23504L13.3516 12.0385L16.155 14.8419L14.9969 16Z"
        fill={color}
      />
    </g>
  </svg>
);

export const SvgIconCheckFilled: React.FC<SvgIconProps> = ({
  size = ICON_DEFAULT_SIZE,
  color = ICON_DEFAULT_COLOR,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 12C4 7.58172 7.65865 4 12.0769 4C16.4952 4 20.1538 7.58172 20.1538 12C20.1538 16.4183 16.4952 20 12.0769 20C7.65865 20 4 16.4183 4 12ZM15.4872 8.61538L10.5311 13.5605L8.42683 11.2021L7.15385 12.3328L9.80634 15.3057C10.1605 15.7027 10.7765 15.7205 11.1532 15.3447L16.6923 9.81785L15.4872 8.61538Z"
        fill={color}
      />
    </g>
  </svg>
);

export const SvgIconCancelFilled: React.FC<SvgIconProps> = ({
  size = ICON_DEFAULT_SIZE,
  color = ICON_DEFAULT_COLOR,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <g>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM16 11H8V13H16V11Z"
        fill={color}
      />
    </g>
  </svg>
);

export const SvgIconSpiner: React.FC<SvgIconProps> = ({
  size = ICON_DEFAULT_SIZE,
  color = ICON_DEFAULT_COLOR,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 4C10.7561 4 9.52928 4.29008 8.41708 4.84719C7.30488 5.4043 6.33792 6.2131 5.59301 7.20933C4.8481 8.20556 4.34578 9.36178 4.12593 10.5861C3.90609 11.8105 3.97478 13.0692 4.32656 14.2624C4.67834 15.4555 5.30351 16.5502 6.15241 17.4595C7.00131 18.3687 8.05054 19.0675 9.21676 19.5002C10.383 19.933 11.6341 20.0879 12.8706 19.9525C14.1071 19.8171 15.2951 19.3953 16.34 18.7204L14.2623 15.5031C13.7176 15.8548 13.0984 16.0747 12.4538 16.1453C11.8092 16.2159 11.1571 16.1351 10.5492 15.9096C9.94132 15.684 9.3944 15.3197 8.9519 14.8458C8.50941 14.3718 8.18353 13.8012 8.00017 13.1793C7.8168 12.5573 7.78099 11.9012 7.89559 11.263C8.01018 10.6248 8.27202 10.0221 8.66031 9.50283C9.0486 8.98354 9.55263 8.56195 10.1324 8.27155C10.7121 7.98115 11.3516 7.82994 12 7.82994L12 4Z"
      fill={`url(#icon_paint_spiner_${color})`}
    />
    <defs>
      <linearGradient
        id={`icon_paint_spiner_${color}`}
        x1="12"
        y1="19.6"
        x2="12"
        y2="4"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor={color} stopOpacity="0" />
        <stop offset="1" stopColor={color} />
      </linearGradient>
    </defs>
  </svg>
);
