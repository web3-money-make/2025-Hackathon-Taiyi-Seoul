import Card from '@/components/Card';
import clipboardCopy from '@/utils/clipboardCopy';
import { address2shorted } from '@/utils/format';
import { ConnectedWallet } from '@privy-io/react-auth';
import { useCallback, useMemo } from 'react';
import { QRCode } from 'react-qrcode-logo';

export interface Props {
  wallet?: ConnectedWallet;
  eoaAddress?: string;
  aaAddress?: string;
}

export default function SectionQr({ aaAddress }: Props) {
  // memo
  const qrcodeValue = useMemo(() => `${aaAddress}`, [aaAddress]);

  // callback
  const handleCopyClick = useCallback(
    (value?: string) => () => {
      if (!value) {
        return;
      }

      clipboardCopy(value);
    },
    []
  );

  return (
    <div>
      <Card className="w-[270px] mr-[24px]">
        <div className="flex flex-col gap-[24px] items-center justify-center">
          {qrcodeValue && (
            <QRCode
              removeQrCodeBehindLogo
              qrStyle="dots"
              bgColor="transparent"
              fgColor="white"
              size={200}
              eyeRadius={14}
              value={qrcodeValue}
            />
          )}
          <div
            className={`transition-opacity ${aaAddress ? 'cursor-pointer hover:opacity-50' : ''}`}
            onClick={handleCopyClick(aaAddress)}
          >
            {aaAddress ? address2shorted(aaAddress) : '-'}
          </div>
          <div>Transfer USDC to Stake</div>
        </div>
      </Card>
    </div>
  );
}
