import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import DepinterestABI from '../../contract-build/contracts/Depinterest.json';

export function useImages() {
  const { chainId } = useWeb3React();
  const [imagesAddress, setImagesAddress] = useState(null);

  useEffect(() => {
    if (chainId) {
      setImagesAddress(DepinterestABI.networks[chainId]?.address);
    }
  }, [chainId]);

  return {
    imagesAddress,
  };
}
