import React, { useCallback, useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Spinner } from 'react-bootstrap';
import { useWeb3React } from '@web3-react/core';
import { BigNumber } from 'ethers';
import { formatEther } from '@ethersproject/units';
import Text from './Text';
import { useContract } from '../hooks/useContract';
import { colors } from '../theme';

import DepinterestABI from '../../contract-build/contracts/Depinterest.json';

const imageState = {
  LOADING: 'LOADING',
  READY: 'READY',
  ERROR: 'ERROR',
};

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
  max-width: 90%;
  flex-wrap: wrap;
`;

const StyledItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  max-width: 175px;
`;

const StyledItemTextContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
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

const ImageItem = ({ item }) => {
  const { url, description, totalTip } = item;
  return (
    <StyledItem>
      <StyledItemTextContainer>
        <Text center>{description}</Text>
        <Text center bold color={colors.green}>
          {formatEther(totalTip)} ETH/mo
        </Text>
        <img src={url} alt="" style={{ maxWidth: '420px' }} />
      </StyledItemTextContainer>
    </StyledItem>
  );
};

const Images = ({ imagesAddress }) => {
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState(imageState.LOADING);
  const { active } = useWeb3React();
  const contract = useContract(imagesAddress, DepinterestABI.abi);
  const getImages = useCallback(async (contract) => {
    try {
      const idListLengthBN = await contract.idListLength();
      const idBNs = await Promise.all(Array.from(Array(idListLengthBN.toNumber())).map((_, i) => contract.idList(i)));
      const ids = idBNs.map((n) => n.toNumber());
      const arr = await Promise.all(ids.map((id) => contract.images(id)));
      setImages(arr);
      setStatus(imageState.READY);
    } catch (e) {
      console.error('error:', e);
      setStatus(imageState.ERROR);
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

  if (status === imageState.LOADING) {
    return <Spinner animation="border" size="sm" style={{ color: colors.green, marginTop: '20px' }} />;
  }

  return <ShowImages images={images} />;
};

export default Images;
