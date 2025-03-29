'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import Link from 'next/link';
import Logo from '../Logo';
import {
  NAVIGATION_EARN,
  NAVIGATION_HOME,
  NAVIGATIONS_HEADER,
} from '@/configs/navigations';
import ButtonConnectWallet from './ButtonConnectWallet';
import Card from '../Card';

export default function Header() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 w-[100vw] h-[72px] p-2">
      <Card className="flex justify-between items-center h-[100%] max-w-[900px] m-auto py-0 px-6 pr-3">
        <div className="flex items-center gap-12">
          <Logo />

          <div className="flex items-center gap-6 text-sm font-normal">
            {NAVIGATIONS_HEADER.map(({ title, href }, index) => (
              <Link
                className={`transition-all hover:underline hover:underline-offset-4 ${pathname === href ? 'underline underline-offset-4' : ''}`}
                href={href}
                key={index}
              >
                {title}
              </Link>
            ))}
          </div>
        </div>

        <aside className="flex items-center gap-3">
          {pathname === NAVIGATION_HOME.href ? (
            <Link
              className="rounded-[24px] border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#cccccc] font-medium text-xs h-8 px-8"
              href={NAVIGATION_EARN.href}
            >
              Start now
            </Link>
          ) : (
            <ButtonConnectWallet />
          )}
        </aside>
      </Card>
    </nav>
  );
}
