import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Spinner } from 'react-bootstrap';
import { useWeb3React } from '@web3-react/core';
import { BigNumber } from 'ethers';
import Text from './Text';
import { useContract } from '../hooks/useContract';
import { colors } from '../theme';
import { ImageItem } from './ImageItem';

import DepinterestABI from '../../contract-build/contracts/Depinterest.json';

const ImageState = {
  LOADING: 'LOADING',
  READY: 'READY',
  ERROR: 'ERROR',
};

const StyledDiv = styled.div`
  display: flex;
  max-width: 90%;
  flex-wrap: wrap;
`;

const ShowImages = ({ images }) => {
  const imgs = images;

  if (imgs.length < 1) {
    return <Text>Nothing here 🤷</Text>;
  }

  return (
    <StyledDiv>
      {imgs.map((l) => {
        const id = BigNumber.from(l.id).toNumber();
        return <ImageItem key={id} item={l} />;
      })}
    </StyledDiv>
  );
};

const Images = ({ imagesAddress }) => {
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState(ImageState.LOADING);
  const { active } = useWeb3React();
  const contract = useContract(imagesAddress, DepinterestABI.abi);

  const getImages = useCallback(async (contract) => {
    try {
      const idListLengthBN = await contract.idListLength();
      const idBNs = await Promise.all(Array.from(Array(idListLengthBN.toNumber())).map((_, i) => contract.idList(i)));
      const ids = idBNs.map((n) => n.toNumber());
      const arr = await Promise.all(ids.map((id) => contract.images(id)));
      setImages(arr);
      setStatus(ImageState.READY);
    } catch (e) {
      console.error('error:', e);
      setStatus(ImageState.ERROR);
    }
  }, []);

  useEffect(() => {
    if (active) {
      getImages(contract);
    }
  }, [active]);

  if (!active) {
    return null;
  }

  if (status === ImageState.LOADING) {
    return <Spinner animation="border" size="sm" style={{ color: colors.green, marginTop: '20px' }} />;
  }

  return <ShowImages images={images} />;
};

export default Images;
