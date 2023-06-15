// import { useGetChainProviders } from './useGetChainProviders';
import Web3 from 'web3';
import ABI from './multi_call.json';
import { AbiItem } from 'web3-utils';
import { BSC_RPC_URL, MULTI_CALL_CONTRACT_ADDRESS } from '../../env/';
import Multicall from '@dopex-io/web3-multicall';

export const MultiCallContract = () => {
  const contractInstance = new Multicall({
    multicallAddress: MULTI_CALL_CONTRACT_ADDRESS,
    provider: new Web3.providers.HttpProvider(BSC_RPC_URL),
  });

  return contractInstance;
};

export const multiCallFun = async (list: any) => {
  console.log(list);

  try {
    const dpxContract = MultiCallContract();
    return await dpxContract.aggregate(list);
  } catch (e: any) {
    console.log(e);
    return [];
  }
};
