import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Container } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import { useAppContext } from '../AppContext';
import MetamaskConnectButton from './MetamaskConnectButton';
import BalancesCard from './BalancesCard';
import Text from './Text';
import Logo from '../static/logo.png';

const StyledImage = styled.img`
  max-height: 50px;
`;

const StyledDiv = styled.div`
  background: black;
`;

const StyledContainer = styled(Container)`
  background-color: tomato;
  text-align: center;
  justify-content: center;
`;

const GlobalError = () => {
  const { contentError, setContentError } = useAppContext();

  useEffect(() => {
    if (contentError) {
      setTimeout(() => {
        setContentError('');
      }, 5000);
    }
  }, [contentError]);

  if (!contentError) {
    return null;
  }
  return (
    <StyledContainer fluid>
      <Text>{contentError}</Text>
    </StyledContainer>
  );
};

const Header = () => {
  return (
    <StyledDiv>
      <GlobalError />
      <Navbar className="justify-content-between">
        <BalancesCard />
        <StyledImage src={Logo} alt="De-pinterest" />
        <MetamaskConnectButton />
      </Navbar>
    </StyledDiv>
  );
};

export default Header;
