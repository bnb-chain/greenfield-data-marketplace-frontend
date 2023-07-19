// import { useGetChainProviders } from './useGetChainProviders';
import Web3 from 'web3';
import ABI from './group_hub_abi.json';
import { AbiItem } from 'web3-utils';
import { BSC_RPC_URL, GROUP_HUB_CONTRACT_ADDRESS } from '../../env/';

export const GroupHubContract = (sign = true) => {
  let isTrustWallet = '';
  try {
    isTrustWallet = JSON.parse(localStorage.getItem('wagmi.wallet') || '');
  } catch (e) {}

  let web3;
  if (sign) {
    web3 = new Web3(
      isTrustWallet === 'injected'
        ? (window.trustWallet as any)
        : (window.ethereum as any),
    );
  } else {
    const gfProvider = new Web3.providers.HttpProvider(BSC_RPC_URL);
    web3 = new Web3(gfProvider);
  }

  const contractInstance = new web3.eth.Contract(
    ABI as AbiItem[],
    GROUP_HUB_CONTRACT_ADDRESS,
  );
  return contractInstance;
};
