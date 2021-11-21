import React from 'react';
import { Container } from 'react-bootstrap';
import { useWeb3React } from '@web3-react/core';
import Text from '../../components/Text';
import Images from '../../components/Images';
import { useImages } from '../../hooks/useImages';
import { colors } from '../../theme';

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
    <Container className="mt-5 d-flex flex-column justify-content-center align-items-center">
      {!active && <NotActive />}
      {imagesAddress && <Images imagesAddress={imagesAddress} />}
    </Container>
  );
};

export default Home;
