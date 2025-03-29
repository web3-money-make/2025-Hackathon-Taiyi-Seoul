import { createContext } from 'react';
import { WalletProps } from './type';

const WalletContext = createContext<WalletProps>({} as WalletProps);

export default WalletContext;
