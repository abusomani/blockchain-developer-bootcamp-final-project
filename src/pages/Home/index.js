import React from 'react';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import Text from '../../components/Text';
import Images from '../../components/Images';
import { useImages } from '../../hooks/useImages';
import { colors } from '../../theme';

import FileUploadModal from '../../components/FileUploadModal';

export const Container = styled.div`
  display: flex;
  max-width: 90%;
  height: 100%;
  flex-wrap: wrap;
`;

const Home = () => {
  const { active } = useWeb3React();
  const { imagesAddress } = useImages();

  const NotActive = () => {
    return (
      <Text>
        Connect{' '}
        {
          <Text>
            <a style={{ color: colors.green }} href="https://faucet.ropsten.be/" target="blank">
              Ropsten
            </a>
          </Text>
        }{' '}
        wallet to continue.
      </Text>
    );
  };

  return (
    <Container>
      {!active && <NotActive />}
      {imagesAddress && <FileUploadModal imagesAddress={imagesAddress} />}
      {imagesAddress && <Images imagesAddress={imagesAddress} />}
    </Container>
  );
};

export default Home;