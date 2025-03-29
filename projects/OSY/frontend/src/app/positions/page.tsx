import { useMemo } from 'react';
import CurrentStatus from './CurrentStatus';
import RebalanceHistory from './RebalanceHistory';
import { formatCommas } from '@/utils/format';

export default function Positions() {
  const totalAverageApy = useMemo(() => 13.1, []);

  return (
    <section className="flex flex-col gap-[128px] row-start-2 items-center justify-center">
      <h1 className="text-xl font-light">
        Total Average APY{' '}
        <span className="text-4xl font-normal">
          {formatCommas(totalAverageApy)}
        </span>
        %
      </h1>

      <div className="flex flex-col gap-[64px] items-center justify-center w-[900px] font-light">
        <div className="w-[100%]">
          <CurrentStatus />
        </div>

        <div className="w-[100%]">
          <RebalanceHistory />
        </div>
      </div>
    </section>
  );
}
