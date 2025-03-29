import { ContractInterface, ethers } from 'ethers';
import AbiEntrypoint from '@/assets/abi/entrypoint.json';
import AbiErc20 from '@/assets/abi/erc20.json';
import AbiSimpleAccount from '@/assets/abi/simpleAccount.json';
import AbiSimpleAccountFactory from '@/assets/abi/simpleAccountFactory.json';
import AbiVault from '@/assets/abi/vault.json';
import {
  TOKEN_ADDRESS_ETHEREUM_USDC,
  TOKEN_ADDRESS_HASHKEY_OSY,
  TOKEN_ADDRESS_HASHKEY_USDC,
} from '@/configs/token';
import { formatUnit } from '@/utils/format';
import { RPC_ETHEREUM, RPC_HASHKEY } from '@/configs/rpc';

const hashkeyProvider = new ethers.providers.JsonRpcProvider(RPC_HASHKEY);
const sepoliaProvider = new ethers.providers.JsonRpcProvider(RPC_ETHEREUM);
const saltNumber = 13;

export async function encodeApproveCallData(
  to: string,
  amount: string,
  decimal: ethers.BigNumberish
) {
  const transferInterface = new ethers.utils.Interface([
    'function approve(address spender, uint256 value) external returns (bool)',
  ]);
  return transferInterface.encodeFunctionData('approve', [
    to,
    ethers.utils.parseUnits(amount, decimal),
  ]);
}

export async function encodeDeposit(
  to: string,
  amount: string,
  decimal: ethers.BigNumberish
) {
  const path = {
    actionChainId: '133', // Example bytes32
    protocolId: '1', // Example bytes32
    amount: ethers.utils.parseUnits(amount, decimal), // Example address
    recipient: to, // Example address
  };
  console.log('path', path);
  const hashkeyVault = await createContractFromFile(
    '0x14D314ee090AD27aA98e95a582b513965F4B6105',
    hashkeyProvider,
    AbiVault as ContractInterface
  );
  const hashkeyVaultInterface = new ethers.utils.Interface(
    hashkeyVault.interface.format(ethers.utils.FormatTypes.json)
  );
  const bridgeCallData = await hashkeyVaultInterface.encodeFunctionData(
    'deposit',
    [[path]]
  );
  return bridgeCallData;
}

export async function encodeWithdraw(
  to: string,
  amount: string,
  decimal: ethers.BigNumberish
) {
  const path = {
    actionChainId: '11155111', // Example bytes32
    protocolId: '0', // Example bytes32
    amount: ethers.utils.parseUnits(amount, decimal), // Example address
    recipient: to, // Example address
  };

  console.log('path', path);

  const hashkeyVault = await createContractFromFile(
    '0x14D314ee090AD27aA98e95a582b513965F4B6105',
    hashkeyProvider,
    AbiVault as ContractInterface
  );
  const hashkeyVaultInterface = new ethers.utils.Interface(
    hashkeyVault.interface.format(ethers.utils.FormatTypes.json)
  );
  const bridgeCallData = await hashkeyVaultInterface.encodeFunctionData(
    'withdraw',
    [[path]]
  );
  return bridgeCallData;
}

export async function encodeExecuteCallData(dest: string[], func: string[]) {
  const simpleAccountInterface = new ethers.utils.Interface([
    'function executeBatch(address[] calldata dest, bytes[] calldata func) external',
  ]);
  return simpleAccountInterface.encodeFunctionData('executeBatch', [
    dest,
    func,
  ]);
}

export async function getNonceHashkey(walletAddr: string) {
  const accountContractHashkey = new ethers.Contract(
    walletAddr, // Contract address
    AbiSimpleAccount as ContractInterface, // ABI (ContractInterface)
    hashkeyProvider // Provider
  );

  const codeHashkey = await hashkeyProvider.getCode(walletAddr);
  if (codeHashkey != '0x') {
    return (await accountContractHashkey.getNonce()).toString();
  } else {
    return '0';
  }
}

export async function getNonceSepolia(walletAddr: string) {
  const accountContractSepolia = new ethers.Contract(
    walletAddr, // Contract address
    AbiSimpleAccount as ContractInterface, // ABI
    sepoliaProvider // Provider
  );

  const codeSepolia = await sepoliaProvider.getCode(walletAddr);
  if (codeSepolia != '0x') {
    return (await accountContractSepolia.getNonce()).toString();
  } else {
    return '0';
  }
}

export async function getHashByHashkey(userOp: { [key: string]: string }) {
  const entryPointContractHashkey = new ethers.Contract(
    '0xcfB2F03F531d381e2f2f45D8DBB6474c1843Bd38', // Contract address
    AbiEntrypoint as ContractInterface, // ABI
    hashkeyProvider // Provider
  );
  return entryPointContractHashkey.getUserOpHash(userOp);
}

export async function getHashBySepolia(userOp: { [key: string]: string }) {
  const entryPointContractSepolia = new ethers.Contract(
    '0xcfB2F03F531d381e2f2f45D8DBB6474c1843Bd38', // Contract address
    AbiEntrypoint as ContractInterface, // ABI
    sepoliaProvider // Provider
  );
  return entryPointContractSepolia.getUserOpHash(userOp);
}

export async function getAddressSepolia(owner: string) {
  const accountFactoryContractSepolia = new ethers.Contract(
    '0x4Bcb18B7eF23d0A1dc0931476E497D29fd467007', // Contract address
    AbiSimpleAccountFactory as ContractInterface, // ABI
    sepoliaProvider // Provider
  );

  const walletAddr = await accountFactoryContractSepolia.getAddress(
    owner,
    saltNumber
  );
  return walletAddr;
}

export async function getAddressHashkey(owner: string) {
  const accountFactoryContractHashkey = new ethers.Contract(
    '0x4Bcb18B7eF23d0A1dc0931476E497D29fd467007', // Contract address
    AbiSimpleAccountFactory as ContractInterface, // ABI
    hashkeyProvider // Provider
  );

  const walletAddr = await accountFactoryContractHashkey.getAddress(
    owner,
    saltNumber
  );
  return walletAddr;
}

export async function getBalance(
  walletAddr: string,
  tokenAddr: string,
  provider: ethers.providers.JsonRpcProvider,
  decimals: number = 6
) {
  const accountContractHashkey = new ethers.Contract(
    tokenAddr, // Contract address
    AbiErc20 as ContractInterface, // ABI (ContractInterface)
    provider // Provider
  );

  const codeHashkey = await provider.getCode(tokenAddr);
  if (codeHashkey != '0x') {
    return formatUnit(
      (await accountContractHashkey.balanceOf(walletAddr)).toString(),
      decimals
    ).toString();
  } else {
    return '0';
  }
}
export async function getBalanceHashkey(
  walletAddr: string,
  tokenAddr: string,
  decimals: number = 6
) {
  return getBalance(walletAddr, tokenAddr, hashkeyProvider, decimals);
}
export async function getBalanceEthereum(
  walletAddr: string,
  tokenAddr: string,
  decimals: number = 6
) {
  return getBalance(walletAddr, tokenAddr, sepoliaProvider, decimals);
}
export async function getBalanceHashkeyOsy(walletAddr: string) {
  return getBalanceHashkey(walletAddr, TOKEN_ADDRESS_HASHKEY_OSY, 6);
}
export async function getBalanceHashkeyUsdc(walletAddr: string) {
  return getBalanceHashkey(walletAddr, TOKEN_ADDRESS_HASHKEY_USDC, 6);
}
export async function getBalanceEthereumUsdc(walletAddr: string) {
  return getBalanceEthereum(walletAddr, TOKEN_ADDRESS_ETHEREUM_USDC, 6);
}

export async function createContractFromFile(
  contractAddress: string,
  provider: ethers.providers.JsonRpcProvider,
  contractInterface: ContractInterface
) {
  const abi = contractInterface;
  return new ethers.Contract(contractAddress, abi, provider);
}

export async function encodeCreateAccountCallDataByHashkey(
  owner: string,
  salt: number
) {
  const accountFactoryContract = new ethers.Contract(
    '0x4Bcb18B7eF23d0A1dc0931476E497D29fd467007', // Contract address
    AbiSimpleAccountFactory as ContractInterface, // ABI
    hashkeyProvider // Provider
  );

  const walletAddr = await accountFactoryContract.getAddress(owner, salt);
  const accountFactory = await createContractFromFile(
    '0x4Bcb18B7eF23d0A1dc0931476E497D29fd467007',
    sepoliaProvider,
    AbiSimpleAccountFactory as ContractInterface
  );
  const simpleAccountFactoryInterface = new ethers.utils.Interface(
    accountFactory.interface.format(ethers.utils.FormatTypes.json)
  );
  const createAccountCalldata =
    simpleAccountFactoryInterface.encodeFunctionData('createAccount', [
      owner,
      salt,
    ]);
  let addressAndCalldata =
    '0x4Bcb18B7eF23d0A1dc0931476E497D29fd467007' +
    createAccountCalldata.slice(2); // Remove '0x' from calldata

  const codeHashkey = await hashkeyProvider.getCode(walletAddr);
  if (codeHashkey != '0x') {
    addressAndCalldata = '0x';
  }
  return { address: walletAddr, callData: addressAndCalldata };
}

export async function encodeCreateAccountCallDataBySepolia(
  owner: string,
  salt: number
) {
  const accountFactoryContract = new ethers.Contract(
    '0x4Bcb18B7eF23d0A1dc0931476E497D29fd467007', // Contract address
    AbiSimpleAccountFactory as ContractInterface, // ABI
    sepoliaProvider // Provider
  );

  const walletAddr = await accountFactoryContract.getAddress(owner, salt);
  const accountFactory = await createContractFromFile(
    '0x4Bcb18B7eF23d0A1dc0931476E497D29fd467007',
    sepoliaProvider,
    AbiSimpleAccountFactory as ContractInterface
  );
  const simpleAccountFactoryInterface = new ethers.utils.Interface(
    accountFactory.interface.format(ethers.utils.FormatTypes.json)
  );
  const createAccountCalldata =
    simpleAccountFactoryInterface.encodeFunctionData('createAccount', [
      owner,
      salt,
    ]);

  let addressAndCalldata =
    '0x4Bcb18B7eF23d0A1dc0931476E497D29fd467007' +
    createAccountCalldata.slice(2); // Remove '0x' from calldata
  const codeSepolia = await sepoliaProvider.getCode(walletAddr);

  if (codeSepolia != '0x') {
    addressAndCalldata = '0x';
  }
  return { address: walletAddr, callData: addressAndCalldata };
}

export async function createUserOperationFormat() {
  const AddressZero = ethers.constants.AddressZero;
  return {
    sender: AddressZero,
    nonce: '0',
    initCode: '0x',
    callData: '0x',
    callGasLimit: '500000', // Increased gas limit
    verificationGasLimit: '600000', // Increased verification gas limit
    preVerificationGas: '21000', // should also cover calldata cost.
    maxFeePerGas: '0',
    maxPriorityFeePerGas: '1000000000',
    paymasterAndData: '0x',
    signature: '0x',
  };
}

export async function getUserOpByHashkey(
  eoaAddr: string,
  callDataInfo: { dest: string; func: string }[]
) {
  const useropHashkey = await createUserOperationFormat();
  console.log('useropHashkey', useropHashkey);
  const accountInfo = await encodeCreateAccountCallDataByHashkey(
    eoaAddr,
    saltNumber
  );
  console.log('accountInfo', accountInfo);
  useropHashkey.initCode = accountInfo.callData;
  useropHashkey.sender = accountInfo.address;
  console.log(111);
  useropHashkey.nonce = await getNonceHashkey(accountInfo.address);
  console.log('useropHashkey.nonce', useropHashkey.nonce);
  console.log(222);
  if (callDataInfo.length > 0) {
    const dest = [];
    const func = [];
    for (let i = 0; i < callDataInfo.length; i++) {
      dest.push(callDataInfo[i].dest);
      func.push(callDataInfo[i].func);
    }
    useropHashkey.callData = await encodeExecuteCallData(dest, func);
    console.log('useropHashkey', useropHashkey);
    console.log(333);
  } else {
    useropHashkey.callData = '0x'; // CallData 넣기
  }
  const useropHashkeyHash = await getHashByHashkey(useropHashkey);

  return { userOp: useropHashkey, userOpByHash: useropHashkeyHash };
}

export async function getUserOpBySepolia(
  eoaAddr: string,
  callDataInfo: { dest: string; func: string }[]
) {
  const useropSepolia = await createUserOperationFormat();
  const accountInfo = await encodeCreateAccountCallDataBySepolia(
    eoaAddr,
    saltNumber
  );
  useropSepolia.initCode = accountInfo.callData;
  useropSepolia.sender = accountInfo.address;
  useropSepolia.nonce = await getNonceSepolia(accountInfo.address);
  if (callDataInfo.length > 0) {
    const dest = [];
    const func = [];
    for (let i = 0; i < callDataInfo.length; i++) {
      dest.push(callDataInfo[i].dest);
      func.push(callDataInfo[i].func);
    }
    useropSepolia.callData = await encodeExecuteCallData(dest, func);
  } else {
    useropSepolia.callData = '0x'; // CallData 넣기
  }
  const useropSepoliaHash = await getHashBySepolia(useropSepolia);
  return { userOp: useropSepolia, userOpByHash: useropSepoliaHash };
}

export const toEthSignedMessageHash = (messageHash: string) => {
  const prefix = '\x19Ethereum Signed Message:\n32';
  return ethers.utils.keccak256(
    ethers.utils.solidityPack(['string', 'bytes32'], [prefix, messageHash])
  );
};

// export {
//   encodeApproveCallData,
//   encodeDeposit,
//   encodeWithdraw,
//   encodeExecuteCallData,
//   getNonceHashkey,
//   getNonceSepolia,
//   getHashByHashkey,
//   getHashBySepolia,
//   getAddressSepolia,
//   getAddressHashkey,
//   createContractFromFile,
//   encodeCreateAccountCallDataByHashkey,
//   encodeCreateAccountCallDataBySepolia,
//   createUserOperationFormat,
//   getUserOpByHashkey,
//   getUserOpBySepolia,
//   toEthSignedMessageHash,
// };
