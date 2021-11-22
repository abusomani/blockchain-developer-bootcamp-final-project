import React, { useState } from 'react';
import styled from 'styled-components';
import { formatEther } from '@ethersproject/units';
import TipButton from '../static/tip-icon.png';
import Text from './Text';
import { colors } from '../theme';
import { DetailsWrapper } from './Details';
import { useImages } from '../hooks/useImages';

export const StyledImage = styled.img`
  border-radius: 50%;
  max-width: 25px;
  max-height: 25px;
`;

const StyledItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const StyledItemTextContainer = styled.div`
  background: #eee;
  border-radius: 5px;
  box-shadow: 8px 8px 8px -4px lightblue;
  margin-top: 10px;
  padding: 5px;
  display: flex;
  flex-direction: column;
`;

const StyledItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const ImageItem = ({ item }) => {
  const [show, setShow] = useState(false);
  const [image] = useState(item);
  const { imagesAddress } = useImages();

  const { url, description, totalTip } = item;

  return (
    <>
      <StyledItem>
        <StyledItemTextContainer>
          <img src={url} alt="" style={{ maxWidth: '420px', borderRadius: '5px' }} />
          <Text center maxWidth={'420px'} ellipsis title={description} padding={'10px'}>
            {description}
          </Text>
          <StyledItemContainer>
            <Text left paddingLeft={'5px'} bold color={colors.black} maxWidth="120px">
              {formatEther(totalTip)} ETH/mo
            </Text>
            <Text right paddingRight={'5px'} maxWidth="25px">
              <StyledImage src={TipButton} alt="" onClick={() => setShow(true)} />
            </Text>
          </StyledItemContainer>
        </StyledItemTextContainer>
      </StyledItem>
      {imagesAddress && show && (
        <DetailsWrapper show={show} image={image} imagesAddress={imagesAddress} modalShowHandler={setShow} />
      )}
    </>
  );
};
