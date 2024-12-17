import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Grid, TableContainer, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import SerialNumbersUploadButton from './SerialNumbersUploadButton';
import { HeaderCell } from './SerialInputElements';
import SerialInputRow from './SerialInputRow';
import SerialViewRow from './SerialViewRow';
import MainCard from 'components/MainCard';

const tabs = {
  enterSerialNumbers: 'ENTER_SERIAL_NUMBERS',
  generateSerialNumbers: 'GENERATE_SERIAL_NUMBERS'
};

const ModalContent = ({ handleCloseSerial, closeCss, quantity, serialNumbers, setSerialNumbers, hideAuto = false }) => {
  const [selectedTab, setSelectedTab] = useState(tabs.enterSerialNumbers);
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [rangeFrom, setRangeFrom] = useState('');
  const [error, setError] = useState(false);
  const [segments, setSegments] = useState([]);
  const [generatedSerialNumbers, setGeneratedSerialNumbers] = useState([]);

  const handleOnChange = (value, index) => {
    const arr = segments;
    arr[index] = value;
    setSegments(arr);
  };

  const filterSegments = (data) => {
    return data.filter((val) => val !== '');
  };

  const checkSNo = () => {
    let content = [];

    if (selectedTab === tabs.generateSerialNumbers) {
      content = generatedSerialNumbers;
    } else {
      content = filterSegments(segments);
    }

    const hasError = content.length !== parseInt(quantity);

    setError(hasError);
    if (!hasError) {
      setSerialNumbers(content);
      handleCloseSerial(true);
    }
  };

  const onPaste = (event, index) => {
    const pasted = event.clipboardData.getData('text/plain');
    const newSegments = segments.slice();

    for (let i = 0, lines = pasted.split('\n'); i < quantity && i < lines.length && i + index < segments.length; i++) {
      let updatedLine = lines[i]?.replace(/[^\w]/gi, '').toUpperCase().trim();
      newSegments[i + index] = updatedLine;
    }

    setSegments(newSegments);
  };

  const generateSerial = (p, s, rf) => {
    if (rf) {
      const limit = parseInt(rf) + parseInt(quantity);
      const srnos = Array(limit - rf)
        .fill()
        .map((_, i) => `${p}${i + parseInt(rf)}${s}`);
      setGeneratedSerialNumbers(srnos);
    }
  };

  useEffect(() => {
    if (serialNumbers?.length) {
      setSegments(serialNumbers);
    } else {
      setSegments(Array(parseInt(quantity)).fill(''));
    }
  }, [quantity, serialNumbers]);

  return (
    <MainCard sx={{ width: 520 }} modal darkTitle content={false}>
      <Grid container spacing={2} alignItems={'center'} sx={{ mt: -1 }}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', marginRight: 1 }}>
          <CloseCircleOutlined onClick={handleCloseSerial} style={closeCss} />
        </Grid>
      </Grid>

      <Grid container spacing={2} alignItems={'center'} sx={{ mt: 0 }}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', padding: '0px' }}>
          <Box>
            {selectedTab === tabs.enterSerialNumbers && (
              <Box position="absolute" marginLeft="-61px">
                <SerialNumbersUploadButton segments={segments} setSegments={setSegments} />
              </Box>
            )}
            <Typography
              color={selectedTab === tabs.enterSerialNumbers ? '#FFFFFF' : '#111111'}
              onClick={() => {
                setSelectedTab(tabs.enterSerialNumbers);
              }}
              style={{
                cursor: 'pointer',
                fontWeight: 700,
                padding: 10,
                background: selectedTab === tabs.enterSerialNumbers ? '#1677FF' : '#FFFFFF'
              }}
            >
              Multiple Serial Number
            </Typography>
          </Box>
          {!hideAuto && (
            <Typography
              color={selectedTab === tabs.generateSerialNumbers ? '#FFFFFF' : '#111111'}
              onClick={() => {
                setSelectedTab(tabs.generateSerialNumbers);
              }}
              style={{
                cursor: 'pointer',
                fontWeight: 700,
                padding: 10,
                background: selectedTab === tabs.generateSerialNumbers ? '#1677FF' : '#FFFFFF'
              }}
            >
              With Serial Number
            </Typography>
          )}
        </Grid>

        {selectedTab === tabs.enterSerialNumbers && (
          <Grid item xs={12} m={5} mt={1} style={{ height: 400, display: 'flex', flexDirection: 'column' }}>
            <TableContainer style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Box display="flex">
                <HeaderCell width="20%">S.No.</HeaderCell>
                <HeaderCell width="80%">Serial Number</HeaderCell>
              </Box>
              <Box style={{ flex: 1, display: 'flex' }}>
                <AutoSizer>
                  {({ height, width }) => (
                    <FixedSizeList
                      height={height}
                      width={width}
                      itemCount={segments.length}
                      itemSize={60}
                      itemData={{ segments, handleOnChange, onPaste }}
                      overscanCount={5}
                    >
                      {SerialInputRow}
                    </FixedSizeList>
                  )}
                </AutoSizer>
              </Box>
            </TableContainer>
          </Grid>
        )}

        {selectedTab === tabs.generateSerialNumbers && !hideAuto && (
          <>
            <Grid container xs={12} m={1} ml={6} mr={6}>
              <Grid item xs={2} m={1}>
                Prefix
              </Grid>
              <Grid item xs={3} mr={3}>
                <TextField
                  name="prefix"
                  value={prefix}
                  onChange={(e) => {
                    if (e.target.value) {
                      let val = e.target.value;
                      val = val.replace(/[^\w]/gi, '').toUpperCase();
                      setPrefix(val);
                      generateSerial(val, suffix, rangeFrom);
                    } else {
                      setPrefix('');
                      generateSerial('', suffix, rangeFrom);
                    }
                  }}
                />
              </Grid>
              <Grid item xs={2} m={1}>
                Suffix
              </Grid>
              <Grid item xs={3}>
                <TextField
                  name="suffix"
                  value={suffix}
                  onChange={(e) => {
                    if (e.target.value) {
                      let val = e.target.value;
                      val = val.replace(/[^\w]/gi, '').toUpperCase();
                      setSuffix(val);
                      generateSerial(prefix, val, rangeFrom);
                    } else {
                      setSuffix('');
                      generateSerial(prefix, '', rangeFrom);
                    }
                  }}
                />
              </Grid>
            </Grid>
            <Grid container xs={12} ml={6} mr={7} pr={0.5}>
              <Grid item xs={3} p={1}>
                Range From
              </Grid>
              <Grid item xs={9} mb={1}>
                <TextField
                  fullWidth
                  type="text"
                  name="rangeFrom"
                  value={rangeFrom}
                  onChange={(e) => {
                    const regex = /^[0-9\b]+$/;
                    if (e.target.value === '' || regex.test(e.target.value)) {
                      setRangeFrom(e.target.value);
                      generateSerial(prefix, suffix, e.target.value);
                      if (e.target.value === '') setGeneratedSerialNumbers([]);
                    }
                  }}
                />
              </Grid>
              <Grid item xs={3} p={1}>
                Range To
              </Grid>
              <Grid item xs={9}>
                <TextField fullWidth name="rangeTo" type="number" value={parseInt(rangeFrom) + parseInt(quantity) - 1} disabled />
              </Grid>
            </Grid>
            <Grid item xs={12} mx={5} mt={1} mb={2} style={{ height: 300, display: 'flex', flexDirection: 'column' }}>
              <TableContainer style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box display="flex" style={{ height: 45 }}>
                  <HeaderCell width="20%">S.No.</HeaderCell>
                  <HeaderCell width="80%">Serial Number</HeaderCell>
                </Box>

                <Box style={{ flex: 1, display: 'flex' }}>
                  <AutoSizer>
                    {({ height, width }) => (
                      <FixedSizeList
                        height={height}
                        width={width}
                        itemCount={generatedSerialNumbers.length}
                        itemSize={45}
                        itemData={{ originalData: generatedSerialNumbers }}
                        overscanCount={5}
                      >
                        {SerialViewRow}
                      </FixedSizeList>
                    )}
                  </AutoSizer>
                </Box>
              </TableContainer>
            </Grid>
          </>
        )}
      </Grid>

      {error && (
        <Typography m={5} mt={-4} color={'red'}>
          Enter valid serial numbers
        </Typography>
      )}

      <Grid item xs={12} mb={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button size="small" onClick={checkSNo} variant="contained" color="primary">
          Save
        </Button>
      </Grid>
    </MainCard>
  );
};

ModalContent.propTypes = {
  closeCss: PropTypes.any,
  handleCloseSerial: PropTypes.func,
  quantity: PropTypes.number,
  serialNumbers: PropTypes.array,
  setSerialNumbers: PropTypes.func,
  hideAuto: PropTypes.bool
};

export default ModalContent;
