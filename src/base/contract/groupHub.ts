// import { useGetChainProviders } from './useGetChainProviders';
import Web3 from 'web3';
import ABI from './group_hub.json';
import { AbiItem } from 'web3-utils';
import { BSC_RPC_URL, GROUP_HUB_CONTRACT_ADDRESS } from '../../env/';
export const GroupHubContract = () => {
  // const gfProvider = new Web3.providers.HttpProvider(BSC_RPC_URL);
  const web3 = new Web3(window.ethereum as any);
  const contractInstance = new web3.eth.Contract(
    ABI as AbiItem[],
    GROUP_HUB_CONTRACT_ADDRESS,
  );
  return contractInstance;
};