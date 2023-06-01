// import { useGetChainProviders } from './useGetChainProviders';
import Web3 from 'web3';
import ABI from '../base/contract/abi.json';
import { AbiItem } from 'web3-utils';
import { BSC_RPC_URL, MARKETPLACE_CONTRACT_ADDRESS, GF_RPC_URL } from '../env';

export const useWeb3 = () => {
  const gfProvider = new Web3.providers.HttpProvider(BSC_RPC_URL);
  const web3 = new Web3(gfProvider);
  const contractInstance = new web3.eth.Contract(
    ABI as AbiItem[],
    MARKETPLACE_CONTRACT_ADDRESS,
  );
  return contractInstance;
};
