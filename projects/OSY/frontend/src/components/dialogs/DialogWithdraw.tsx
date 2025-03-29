import React, { useCallback, useEffect, useState } from 'react';
import Dialog, { Props as DialogProps } from '@/components/Dialog';
import StatusIcon from '../StatusIcon';
import Button from '../Button';
import Input from '../Input';
import Select from '../Select';
import { ConnectedWallet, usePrivy } from '@privy-io/react-auth';
import { isNormalPositive } from '@/utils/number';
import {
  encodeApproveCallData,
  encodeWithdraw,
  getUserOpByHashkey,
} from '@/libs/aa';
import axios from 'axios';
import { API_HOST_BUNDLER } from '@/configs/apiHost';

export interface Props extends DialogProps {
  isShow?: boolean;
  wallet?: ConnectedWallet;
  eoaAddress?: string;
  aaAddress?: string;
  onDimClick?: () => void;
}

export default function DialogWithdraw({
  isShow,
  wallet,
  eoaAddress,
  aaAddress,
  onDimClick,
  ...props
}: Props) {
  // privy
  const { signMessage } = usePrivy();

  // state
  const [amount, setAmount] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  // callback
  const handleClick = useCallback(async () => {
    if (
      !(
        wallet &&
        eoaAddress &&
        aaAddress &&
        amount &&
        isNormalPositive(amount, true)
      )
    ) {
      return;
    }

    setConfirmed(true);

    try {
      const withdrawAmount = amount;
      const callDataInfo = [
        {
          dest: '0xa4DB7798981453A2c8075fe5162cFD0E2479926E',
          func: await encodeApproveCallData(
            '0x14D314ee090AD27aA98e95a582b513965F4B6105',
            withdrawAmount,
            '6'
          ),
        },
        {
          dest: '0x14D314ee090AD27aA98e95a582b513965F4B6105',
          func: await encodeWithdraw(aaAddress, withdrawAmount, '6'),
        },
      ];
      console.log('eoaAddress', eoaAddress);
      console.log('callDataInfo', callDataInfo);
      const userOpInfo = await getUserOpByHashkey(eoaAddress, callDataInfo);
      console.log('userOpInfo', userOpInfo);
      const userOp = userOpInfo.userOp;
      const userOpByHash = userOpInfo.userOpByHash;
      const message = userOpByHash;
      console.log('message', message);

      // Metamask 연동
      const { signature } = await signMessage({ message });
      userOp.signature = signature;
      console.log('userOp.signature', userOp.signature);

      try {
        const requestBody = {
          userOp: userOp,
          entryPointInput: '0x', // EntryPoint 컨트랙트 주소
        };

        const response = await axios.post(
          `${API_HOST_BUNDLER}/sendUserOperation`,
          requestBody
        );
        console.log('Response:', response.data);

        onDimClick?.();
      } catch (error) {
        throw error;
      }
    } catch (error) {
      console.log('error', error);
    }

    setConfirmed(false);
  }, [aaAddress, amount, eoaAddress, onDimClick, signMessage, wallet]);
  const handleDimClick = useCallback(() => {
    if (confirmed) {
      return;
    }

    onDimClick?.();
  }, [confirmed, onDimClick]);
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setAmount(event.target.value);
    },
    []
  );

  // effect
  useEffect(() => {
    setConfirmed(false);
  }, [isShow]);

  return (
    <Dialog isShow={isShow} onDimClick={handleDimClick} {...props}>
      <div className="flex flex-col gap-4 w-[300px]">
        <div className="flex flex-col font-light text-center">Withdraw</div>

        <div className="flex flex-col gap-1">
          <div className="font-light text-sm">Chain</div>
          <Select disabled={confirmed}>
            <option value="hashkey">Hash Key</option>
            <option value="ethereum">Ethereum</option>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <div className="font-light text-sm">Amount</div>
          <Input
            isNumberInput
            type="number"
            disabled={confirmed}
            value={amount}
            onChange={handleInputChange}
          />
        </div>

        <div>
          {confirmed ? (
            <div className="flex items-center justify-center pb-4">
              <StatusIcon value="progress" size="32px" />
            </div>
          ) : (
            ''
          )}

          <Button
            className="w-[100%]"
            onClick={handleClick}
            disabled={confirmed}
          >
            Withdraw
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
