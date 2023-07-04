// import { useGetChainProviders } from './useGetChainProviders';
import Web3 from 'web3';
import ABI from './ERC721NonTransferable_abi.json';
import { AbiItem } from 'web3-utils';
import { BSC_RPC_URL, ERC721_TRANSFER_CONTRACT_ADDRESS } from '../../env';

const cache: any = {};
export const OwnBuyContract = (sign = true) => {
  if (cache[sign + '']) return cache[sign + ''];
  let web3;
  if (sign) {
    web3 = new Web3(window.ethereum as any);
  } else {
    const gfProvider = new Web3.providers.HttpProvider(BSC_RPC_URL);
    web3 = new Web3(gfProvider);
  }

  const contractInstance = new web3.eth.Contract(
    ABI as AbiItem[],
    ERC721_TRANSFER_CONTRACT_ADDRESS,
  );
  if (!cache[sign + '']) cache[sign + ''] = contractInstance;
  return contractInstance;
};
