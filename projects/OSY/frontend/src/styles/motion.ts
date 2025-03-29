import { Variants } from 'framer-motion';

export const dialogDimVariant: Variants = {
  incoming: {
    opacity: 0,
  },
  active: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

export const dialogCardVariant: Variants = {
  incoming: {
    scale: 0.9,
  },
  active: {
    scale: 1,
  },
  exit: {
    scale: 0.9,
  },
};
