import { CloseCircleOutlined as CloseCircleOutlinedIcon } from '@ant-design/icons';
import { Button, Grid, Modal, Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import SerialNumbersUploadButton from './SerialNumbersUploadButton';
import { BodyCell, HeaderCell, TableContainer } from './SerialInputElements';
import { CheckboxComponent, DevolutionSerialViewRow } from './SerialViewRow';
import InputSerialNumbersModal from './InputSerialNumbersModal';
import { DevolutionRejectedSerialViewRow, DevolutionSelectedSerialViewRow } from './SelectedSerialViewRow';
import MainCard from 'components/MainCard';
import toast from 'utils/ToastNotistack';
import { CSVExport } from 'components/third-party/ReactTable';
import tableExportData from 'utils/tablesExportData';

const closeCss = { cursor: 'pointer', fontSize: 24 };

const DevolutionMaterialSerialNumberModal = ({
  open,
  onClose: handleClose,
  serialNumberData,
  showCheckboxes,
  showRejectSection,
  onSave: handleSave,
  selectedSerials: selectedSerialsProps
}) => {
  const [selectedSerials, setSelectedSerials] = useState([]);
  const [rejectedSerials, setRejectedSerials] = useState([]);
  const maxQuantity = serialNumberData.length;

  useEffect(() => {
    if (open) {
      setSelectedSerials([]);
      setRejectedSerials([]);
    }
  }, [open]);

  useEffect(() => {
    if (selectedSerialsProps) {
      setSelectedSerials(selectedSerialsProps);
      setRejectedSerials([]);
    }
  }, [selectedSerialsProps]);

  const originalData = useMemo(() => serialNumberData || [], [serialNumberData]);

  const setAllChecked = (event) => {
    if (event && originalData.length > maxQuantity) {
      toast(`Only the first ${maxQuantity} serial numbers will be selected`, { variant: 'info' });
      setSelectedSerials(originalData.slice(0, maxQuantity));
      return 'indeterminate';
    }

    if (event) {
      setSelectedSerials(originalData);
      return true;
    }

    setSelectedSerials([]);

    return true;
  };

  const handleCheckboxChange = (event, value) => {
    // if (event && selectedSerials.length + 1 > maxQuantity) {
    //   toast(`Cannot select more serial numbers than the used quantity`, { variant: 'info' });
    //   return false;
    // }

    if (event) {
      setSelectedSerials((prev) => prev.concat(value));
    } else {
      setSelectedSerials((prev) => prev.filter((item) => item !== value));
    }
    return true;
  };

  // const checkOldSrNos = (sr) => {
  //   if (!sr?.[0]?.oldSerialNo) return sr;
  //   else return sr.map((v) => v.oldSerialNo);
  // };

  // const saveSelectedSerials = () => {
  //   let selectedData = checkOldSrNos(selectedSerials);
  //   handleSave(originalData.filter((item) => selectedData.includes(item.oldSerialNo)));
  //   handleClose();
  // };

  const checkOldSrNos = (sr) => {
    // If no oldSerialNo is found, return the original array
    if (!sr?.[0]?.oldSerialNo) return sr;

    // Create a Set of oldSerialNos for O(1) lookups
    return new Set(sr.map((v) => v.oldSerialNo));
  };

  const saveSelectedSerials = () => {
    const selectedData = checkOldSrNos(selectedSerials);
    if (selectedData instanceof Set) {
      const chunkSize = 10000; // Adjust chunk size based on memory
      let filteredData = [];

      for (let i = 0; i < originalData.length; i += chunkSize) {
        const chunk = originalData.slice(i, i + chunkSize); // Process chunk
        filteredData = filteredData.concat(chunk.filter((item) => selectedData.has(item.oldSerialNo)));
      }

      handleSave(filteredData); // Save the filtered data
    }
    handleClose();
  };

  const [segments, setSegments] = useState([]);

  const setSegmentsFromSource = useCallback(
    (values) => {
      // const isInvalid = values.some((item) => !originalData.includes(item));

      // if (isInvalid) {
      //   toast(`${source} contains serial number(s) which are not in the store`, { variant: 'error' });
      //   return;
      // }
      // serialNumberData

      const availableData = serialNumberData.map((vl) => vl.oldSerialNo);
      const selectedData = values
        .filter((v) => availableData.includes(v))
        .map((v) => {
          return { oldSerialNo: v };
        });
      const rejectedData = values
        .filter((v) => !availableData.includes(v))
        .map((v) => {
          return { oldSerialNo: v };
        });
      setSelectedSerials(selectedData);
      setRejectedSerials(rejectedData);
    },
    [serialNumberData]
  );

  useEffect(() => {
    setSegments(Array(parseInt(maxQuantity)).fill(''));
  }, [maxQuantity, setSegments]);

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title">
      <MainCard sx={{ width: showCheckboxes ? 1000 : 500 }} modal darkTitle content={false}>
        <Box display="flex" mt="1rem" mx="2.4rem">
          <Typography variant="h3" mt="5px">
            Serial Numbers
          </Typography>

          {showCheckboxes && (
            <>
              <SerialNumbersUploadButton segments={segments} setSegments={setSegmentsFromSource} forDevolution />
              <InputSerialNumbersModal
                segments={segments}
                setSegments={(seg) => {
                  setSegmentsFromSource(seg);
                }}
                forDevolution
              />
            </>
          )}

          <Box position="absolute" top="15px" right="21px">
            <CloseCircleOutlinedIcon onClick={handleClose} style={closeCss} />
          </Box>
        </Box>
        <Grid container spacing={2} style={{ display: 'grid', gridTemplateColumns: 'auto auto' }}>
          <Grid item xs={6} mx={5} mt={1} mb={!showCheckboxes ? 2 : 1} style={{ height: 450, display: 'flex', flexDirection: 'column' }}>
            <TableContainer style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Box display="flex" style={{ height: 48 }}>
                <HeaderCell width="20%">S.No.</HeaderCell>
                <HeaderCell width={showCheckboxes ? '60%' : '80%'}>Serial Number</HeaderCell>
                {showCheckboxes && (
                  <HeaderCell width="20%">
                    <CheckboxComponent
                      blueBackground
                      checked={selectedSerials.length === originalData.length ? true : selectedSerials.length ? 'indeterminate' : false}
                      onChecked={setAllChecked}
                    />
                  </HeaderCell>
                )}
              </Box>

              <Box style={{ flex: 1, display: 'flex' }}>
                <AutoSizer>
                  {({ height, width }) => (
                    <FixedSizeList
                      height={height}
                      width={width}
                      itemCount={originalData.length}
                      itemSize={48}
                      itemData={{ originalData, showCheckboxes, selectedSerials, handleCheckboxChange }}
                      overscanCount={5}
                    >
                      {DevolutionSerialViewRow}
                    </FixedSizeList>
                  )}
                </AutoSizer>
              </Box>
            </TableContainer>
          </Grid>

          {showCheckboxes && (
            <Grid item xs={6} mx={5} mt={1} mb={!showCheckboxes ? 2 : 1} style={{ height: 450, display: 'flex', flexDirection: 'column' }}>
              <TableContainer style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box display="flex" style={{ height: 48 }}>
                  <HeaderCell width="20%">S.No.</HeaderCell>
                  <HeaderCell width={showCheckboxes ? '60%' : '80%'}>Selected Serial Numbers</HeaderCell>
                  <HeaderCell width={'20%'}></HeaderCell>
                </Box>

                <Box style={{ flex: 1, display: 'flex' }}>
                  {selectedSerials && selectedSerials.length > 0 && (
                    <AutoSizer>
                      {({ height, width }) => (
                        <FixedSizeList
                          height={height}
                          width={width}
                          itemCount={selectedSerials.length}
                          itemSize={48}
                          itemData={{ selectedSerials, showCheckboxes, handleCheckboxChange }}
                          overscanCount={5}
                        >
                          {DevolutionSelectedSerialViewRow}
                        </FixedSizeList>
                      )}
                    </AutoSizer>
                  )}
                  {selectedSerials && selectedSerials.length === 0 && (
                    <>
                      <BodyCell width="20%"></BodyCell>
                      <BodyCell width={showCheckboxes ? '60%' : '80%'}>No serial numbers selected</BodyCell>
                      <BodyCell width={'20%'}></BodyCell>
                    </>
                  )}
                </Box>
              </TableContainer>
              {showRejectSection && (
                <TableContainer style={{ flex: 1, marginTop: 15, display: 'flex', flexDirection: 'column' }}>
                  <Box display="flex" style={{ height: 48 }}>
                    <HeaderCell width="20%">S.No.</HeaderCell>
                    <HeaderCell width={showCheckboxes ? '60%' : '80%'}>Rejected Serial Numbers</HeaderCell>
                    <HeaderCell width={'20%'}>
                      <CSVExport
                        disabled={!rejectedSerials?.length}
                        data={tableExportData.getData(
                          rejectedSerials,
                          [
                            {
                              Header: 'Rejected Serial Numbers',
                              accessor: 'oldSerialNo'
                            }
                          ],
                          true
                        )}
                        filename={'Rejected List'}
                        forRejected
                      />
                    </HeaderCell>
                  </Box>

                  <Box style={{ flex: 1, display: 'flex' }}>
                    {rejectedSerials && rejectedSerials.length > 0 && (
                      <AutoSizer>
                        {({ height, width }) => (
                          <FixedSizeList
                            height={height}
                            width={width}
                            itemCount={rejectedSerials.length}
                            itemSize={48}
                            itemData={{ rejectedSerials, showCheckboxes, handleCheckboxChange }}
                            overscanCount={5}
                          >
                            {DevolutionRejectedSerialViewRow}
                          </FixedSizeList>
                        )}
                      </AutoSizer>
                    )}
                    {rejectedSerials && rejectedSerials.length === 0 && (
                      <>
                        <BodyCell width="20%"></BodyCell>
                        <BodyCell width={showCheckboxes ? '60%' : '80%'}>No serial numbers rejected</BodyCell>
                        <BodyCell width={'20%'}></BodyCell>
                      </>
                    )}
                  </Box>
                </TableContainer>
              )}
            </Grid>
          )}
        </Grid>

        {showCheckboxes && (
          <Grid item xs={12} sx={{ textAlign: 'center' }} mb={2}>
            <Button
              disabled={(selectedSerials && selectedSerials.length === 0) || rejectedSerials.length > 0}
              variant="contained"
              onClick={saveSelectedSerials}
            >
              Add
            </Button>
          </Grid>
        )}
      </MainCard>
    </Modal>
  );
};

DevolutionMaterialSerialNumberModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  serialNumberData: PropTypes.array,
  noDisable: PropTypes.bool,
  showCheckboxes: PropTypes.bool,
  showRejectSection: PropTypes.bool,
  onSave: PropTypes.func,
  selectedSerials: PropTypes.array,
  edit: PropTypes.bool
};

export default DevolutionMaterialSerialNumberModal;
