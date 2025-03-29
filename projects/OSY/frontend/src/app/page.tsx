import { NAVIGATION_EARN } from '@/configs/navigations';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col gap-[128px] row-start-2 items-center justify-center min-h-[60vh]">
      <div />

      <div className="flex gap-6 text-xl font-light select-none">
        <h1>
          <span className="text-7xl font-normal">O</span>ptimized
        </h1>
        <h1>
          <span className="text-7xl font-normal">S</span>table
        </h1>
        <h1>
          <span className="text-7xl font-normal">Y</span>ield
        </h1>
      </div>

      <div className="flex flex-col gap-6 items-center text-sm font-light">
        <span className="text-center">
          It is a stablecoin revenue optimization platform
          <br />
          that automatically analyzes DeFi protocols across multiple chains to
          provide the highest return
        </span>
        <div className="flex gap-4 items-center">
          <Link
            className="rounded-[24px] border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#cccccc] font-medium text-sm h-12 px-8"
            href={NAVIGATION_EARN.href}
          >
            Start now
          </Link>
        </div>
      </div>
    </main>
  );
}
