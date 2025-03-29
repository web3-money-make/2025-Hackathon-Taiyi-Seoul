import Navigation from '@/types/Navigation';

export const NAVIGATION_HOME: Navigation = { title: 'Home', href: '/' };
export const NAVIGATION_EARN: Navigation = { title: 'Earn', href: '/earn' };
export const NAVIGATION_POSITIONS: Navigation = {
  title: 'Positions',
  href: '/positions',
};

export const NAVIGATIONS_HEADER: Navigation[] = [
  NAVIGATION_EARN,
  NAVIGATION_POSITIONS,
];

const NAVIGATIONS: Navigation[] = [
  NAVIGATION_HOME,
  NAVIGATION_EARN,
  NAVIGATION_POSITIONS,
];

export default NAVIGATIONS;
