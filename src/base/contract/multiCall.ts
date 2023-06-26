import Web3 from 'web3';
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
  try {
    const dpxContract = MultiCallContract();
    return await dpxContract.aggregate(list);
  } catch (e: any) {
    return [];
  }
};
