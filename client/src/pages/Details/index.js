import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Container, Spinner } from 'react-bootstrap';
import { useWeb3React } from '@web3-react/core';
import { Link, Redirect } from 'react-router-dom';
import { useContract } from '../../hooks/useContract';
import { useImages } from '../../hooks/useImages';
import Text from '../../components/Text';

import DepinterestABI from '../../../contract-build/contracts/Depinterest.json';

import { colors } from '../../theme';

const DetailsState = {
  LOADING: 'LOADING',
  WAITING: 'WAITING_CONFIRMATIONS',
  READY: 'READY',
  ERROR: 'ERROR',
  TIPPED: 'TIPPED',
};

const CONFIRMATION_COUNT = 2;

const LikeButton = styled(Button).attrs({ variant: 'outline-success' })`
  color: ${colors.green};
  border-color: ${colors.green};
  margin-top: 20px;
`;

const Details = ({ location, imagesAddress }) => {
  const [status, setStatus] = useState(DetailsState.READY);
  const [mmError, setMmError] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [listing, setListing] = useState(undefined);
  const { active, account, chainId } = useWeb3React();
  const contract = useContract(imagesAddress, DepinterestABI.abi);
  const searchParams = new URLSearchParams(location.search);
  const imageId = searchParams.get('id');

  useEffect(() => {
    const getListing = async () => {
      const listing = await contract.images(Number(imageId));
      setListing(listing);
    };
    getListing();
  }, []);

  const onLikeClick = async () => {
    setStatus(DetailsState.LOADING);
    try {
      setStatus(DetailsState.WAITING);
      const transaction = await contract.tipImageOwner(imageId, {
        from: account,
        value: 0,
      });
      const confirmations = chainId === 1337 ? 1 : CONFIRMATION_COUNT;
      await transaction.wait(confirmations);
      setTxHash(transaction.hash);
      setStatus(DetailsState.TIPPED);
    } catch (e) {
      setStatus(DetailsState.ERROR);
      if (e.code && typeof e.code === 'number') {
        setMmError(e.message);
      }
    }
  };

  if (!active) return <Redirect to="/" />;

  const { LOADING, WAITING, READY, TIPPED, ERROR } = DetailsState;

  return (
    <Container fluid className="mt-5 d-flex flex-column justify-content-center align-items-center">
      {status === LOADING ||
        (status === WAITING && (
          <>
            <Spinner
              animation="border"
              size="sm"
              style={{ color: colors.green, marginTop: '20px', marginBottom: '20px' }}
            />
            {status === WAITING && <Text>The apartment is yours after {CONFIRMATION_COUNT} block confirmations.</Text>}
          </>
        ))}
      {status === READY && (
        <LikeButton disabled={!listing} onClick={onLikeClick}>
          Like
        </LikeButton>
      )}
      {status === TIPPED && !!txHash && (
        <>
          <Text t3 color={colors.green} style={{ marginTop: '20px', marginBottom: '20px' }}>
            Thanks for liking!
          </Text>
          <Text>
            See this transaction in{' '}
            <Link to={{ pathname: `https://ropsten.etherscan.io/tx/${txHash}` }} target="_blank">
              Etherscan
            </Link>
          </Text>
        </>
      )}
      {status === ERROR && (
        <>
          <Text style={{ marginTop: '20px', marginBottom: '20px' }} color={colors.red}>
            {mmError || 'Error encountered!'}
          </Text>
        </>
      )}
      <Link style={{ marginTop: '20px' }} to="/">
        Back to front page
      </Link>
    </Container>
  );
};

const DetailsWrapper = ({ location }) => {
  const { imagesAddress } = useImages();
  if (!imagesAddress) return null;
  return <Details location={location} imagesAddress={imagesAddress} />;
};

export default DetailsWrapper;
