import React, { useState } from 'react';
import { Modal, Spinner, Toast } from 'react-bootstrap';
import ToastContainer from 'react-bootstrap/ToastContainer';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import { Link } from 'react-router-dom';
import { useContract } from '../hooks/useContract';
import Text from './Text';
import DepinterestABI from '../../contract-build/contracts/Depinterest.json';
import { colors } from '../theme';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3Utils = require('web3-utils');

const StyledDiv = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
`;

export const StyledToastDiv = styled.div`
  position fixed;
  z-index: 9998;
  top: 10px;
  right: 10px;
  width: 100%;
  display: flex;
  justify-content: end;
`;

const SpinnerDiv = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const StyledImageContainer = styled.div`
  justify-content: center;
  display: flex;
`;

const DetailsState = {
  LOADING: 'LOADING',
  WAITING: 'WAITING_CONFIRMATIONS',
  READY: 'READY',
  ERROR: 'ERROR',
  TIPPED: 'TIPPED',
};

const CONFIRMATION_COUNT = 2;

const Details = ({ image, imagesAddress, show, modalShowHandler }) => {
  const [status, setStatus] = useState(DetailsState.READY);
  const [mmError, setMmError] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const { account, chainId } = useWeb3React();
  const [showToast, setShowToast] = useState(false);
  const toggleToast = () => setShowToast(!showToast);
  const contract = useContract(imagesAddress, DepinterestABI.abi);
  const imageId = image.id;

  const onTipClick = async () => {
    setStatus(DetailsState.LOADING);
    try {
      setStatus(DetailsState.WAITING);
      const transaction = await contract.tipImageOwner(imageId, {
        from: account,
        value: Web3Utils.toWei('0.01', 'Ether'), // 0.01ETH
      });
      const confirmations = chainId === 1337 ? 1 : CONFIRMATION_COUNT;
      await transaction.wait(confirmations);
      toggleToast();
      setTxHash(transaction.hash);
      setStatus(DetailsState.TIPPED);
    } catch (e) {
      setStatus(DetailsState.ERROR);
      console.log(e);
      if (e.code && typeof e.code === 'number') {
        setMmError(e.message);
      }
    }
  };

  const { LOADING, WAITING, READY, TIPPED, ERROR } = DetailsState;

  return (
    <>
      <StyledToastDiv>
        <ToastContainer>
          <Toast show={showToast} onClose={toggleToast} autohide bg={'success'}>
            <Toast.Body>Tip successful.</Toast.Body>
          </Toast>
        </ToastContainer>
      </StyledToastDiv>
      <Modal show={show} onHide={() => modalShowHandler(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Tip the owner of this image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <StyledDiv>
            <img src={image.url} alt="" width="100%" height="100%" />
            <Text center title={image.description} padding={'10px'}>
              {image.description}
            </Text>
          </StyledDiv>
          {status === LOADING ||
            (status === WAITING && (
              <>
                <SpinnerDiv>
                  <Spinner
                    animation="border"
                    size="sm"
                    style={{ color: colors.green, marginTop: '20px', marginBottom: '20px' }}
                  />
                </SpinnerDiv>
                {status === WAITING && (
                  <Text>The tip would be confirmed after {CONFIRMATION_COUNT} block confirmations.</Text>
                )}
              </>
            ))}
          {status === READY && (
            <StyledImageContainer>
              <Text center color={colors.white} bold onClick={onTipClick} backgroundColor={colors.purple} padding="5px">
                TIP 0.01ETH
              </Text>
            </StyledImageContainer>
          )}
          {status === TIPPED && !!txHash && (
            <>
              <Text bold color={colors.purple} style={{ marginTop: '20px', marginBottom: '20px' }}>
                Thanks for liking! See this transaction in{' '}
                <Link to={{ pathname: `https://ropsten.etherscan.io/tx/${txHash}` }} target="_blank">
                  Etherscan
                </Link>
              </Text>
            </>
          )}
          {status === ERROR && (
            <Text center style={{ marginTop: '20px', marginBottom: '20px' }} color={colors.red}>
              {mmError || 'Error encountered!'}
            </Text>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export const DetailsWrapper = ({ image, imagesAddress, show, modalShowHandler }) => {
  if (!imagesAddress) return null;
  return <Details image={image} imagesAddress={imagesAddress} show={show} modalShowHandler={modalShowHandler} />;
};
