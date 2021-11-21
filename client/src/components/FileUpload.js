import React, { useRef } from 'react';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import { create } from 'ipfs-http-client';
import { colors } from '../theme';
import { useContract } from '../hooks/useContract';
import DepinterestABI from '../../contract-build/contracts/Depinterest.json';

const client = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

export const FormField = styled.input`
  font-size: 18px;
  display: block;
  border: none;
  text-transform: none;
`;

export const UploadFileBtn = styled(Button).attrs({ variant: 'outline-success' })`
  color: ${colors.green};
  border-color: ${colors.green};
  margin-top: 20px;
`;

const FileUpload = ({ imagesAddress }) => {
  const contract = useContract(imagesAddress, DepinterestABI.abi);

  const onUploadClick = async (e) => {
    const file = e.target.files[0];
    try {
      await client.add(file).then((result) => {
        const url = `https://ipfs.infura.io/ipfs/${result.path}`;
        contract.uploadImage(url, 'Hello world');
      });
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  };
  return (
    <>
      {/* <UploadFileBtn type="button" onClick={handleUploadBtnClick}>
        <i className="fas fa-file-upload" />
        <span> Upload file</span>
      </UploadFileBtn> */}
      <FormField type="file" onChange={onUploadClick} title="" value="" />
    </>
  );
};

export default FileUpload;
