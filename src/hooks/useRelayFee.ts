import { useEffect, useState } from 'react';
import { MarketPlaceContract } from '../base/contract/marketPlaceContract';

export const useRelayFee = () => {
  const [relayFee, setRelayFee] = useState(0);

  useEffect(() => {
    MarketPlaceContract(false)
      .methods.getMinRelayFee()
      .call()
      .then((result: any) => {
        setRelayFee(result);
      });
  }, []);

  return { relayFee };
};
