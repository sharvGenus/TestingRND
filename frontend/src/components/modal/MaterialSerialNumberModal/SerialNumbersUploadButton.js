import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import PropTypes from 'prop-types';
import { Box, Tooltip } from '@mui/material';
import { styled } from '@mui/system';
import { CloudUploadOutlined } from '@ant-design/icons';
import toast from 'utils/ToastNotistack';
import { LoadingIcon } from 'components/buttons/LoadingIcon';

const nameOfSerialNumbersColumn = 'SerialNumbers';

const iconStyles = {
  padding: '10px',
  fontSize: '22px',
  marginRight: '7px'
};

const UploadIcon = styled(CloudUploadOutlined)(iconStyles);
const UploadContainer = styled(Box)({ display: 'flex', justifyContent: 'center', cursor: 'pointer' });
const Input = styled('input')({ display: 'none', cursor: 'pointer' });
const Label = styled('label')({
  verticalAlign: 'middle',
  marginLeft: '10px',
  cursor: 'pointer'
});

const supportedFileExtensions = ['dif', 'xlt', 'xltx', 'fods', 'ots', 'html', 'slk', 'xlsm', 'ods', 'xls', 'csv', 'xlsx'];

const SerialNumbersUploadButton = ({ segments, setSegments, forDevolution = false }) => {
  const [processing, setProcessing] = useState(false);

  const showToast = (message) => {
    toast(message || 'Something went wrong', { variant: 'error' });
    setProcessing(false);
  };

  const handleFileChange = async (event) => {
    const file = event?.target?.files?.[0];

    if (!file) {
      showToast('Something went wrong while picking the file!');
    }

    const fileExtension = file.name.split('.').pop();

    if (!supportedFileExtensions.includes(fileExtension)) {
      showToast('File type not supported');
      return;
    }

    setProcessing(true);

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const [worksheetName] = workbook.SheetNames;
        const worksheet = workbook.Sheets[worksheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });

        if (!jsonData) {
          throw new Error('Something went wrong while parsing the file');
        }

        const columnIndex = jsonData[0].indexOf(nameOfSerialNumbersColumn);
        const columnWasFound = columnIndex !== -1;
        const isATextFile = file.type === 'text/plain';
        const isATextFileButColumnNotFound = isATextFile && !columnWasFound;

        if (!columnWasFound && !isATextFileButColumnNotFound) {
          throw new Error(`Column for serial numbers not found. Looking for column name "${nameOfSerialNumbersColumn}"`);
        }

        const sliceFrom = isATextFileButColumnNotFound ? 0 : 1;
        const sliceTo = jsonData.length;
        const indexToUse = isATextFileButColumnNotFound ? 0 : columnIndex;
        const rawSerialNumbersList = jsonData
          .slice(sliceFrom, sliceTo)
          .map((item) => item[indexToUse])
          .filter((item) => item !== undefined && item.trim() !== '');

        const uniqueSerialNumbersList = [...new Set(rawSerialNumbersList)];

        if (rawSerialNumbersList.length !== uniqueSerialNumbersList.length) {
          throw new Error('Duplicate serial numbers found. Kindly remove them.');
        }

        if (!forDevolution && uniqueSerialNumbersList.length !== segments.length) {
          throw new Error(
            `File contains ${uniqueSerialNumbersList.length > segments.length ? 'more' : 'less'} serial numbers than the quantity used`
          );
        }

        setSegments(uniqueSerialNumbersList);
        setProcessing(false);
      } catch (error) {
        showToast(error?.message);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <UploadContainer>
        <Tooltip title="Import from file" placement="bottom">
          <Label htmlFor="myFile">{processing ? <LoadingIcon className="rotate" /> : <UploadIcon />}</Label>
          <Input type="file" id="myFile" disabled={processing} onChange={handleFileChange} />
        </Tooltip>
      </UploadContainer>
    </>
  );
};

SerialNumbersUploadButton.propTypes = {
  segments: PropTypes.array,
  setSegments: PropTypes.func,
  forDevolution: PropTypes.bool
};

export default SerialNumbersUploadButton;
