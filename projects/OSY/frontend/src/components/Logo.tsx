import React from 'react';
import Link from 'next/link';
import { NAVIGATION_HOME } from '@/configs/navigations';

export default function Logo() {
  return (
    <Link
      className="text-xl font-light select-none"
      href={NAVIGATION_HOME.href}
    >
      OSY
    </Link>
  );
}
