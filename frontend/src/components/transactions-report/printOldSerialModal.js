import React, { useEffect, useState } from 'react';
import { Modal, Button, Box, Typography } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import PropTypes from 'prop-types';
import './printSerialModal.css';
import { printStyles, serialTableStyles } from './styles';
import Loader from 'components/Loader';
import request from 'utils/request';

const containerBoxSx = { width: '85%', height: '80%', backgroundColor: 'white', overflow: 'auto' };
const modalSx = { display: 'flex', alignItems: 'center', justifyContent: 'center' };

const noOfColumns = 4;
const pageSize = 44;

const createPairs = (data) => {
  return (
    data &&
    data.length > 0 &&
    data.reduce((acc, curr, idx) => {
      const pageIdx = Math.floor(idx / pageSize);
      const colIdx = Math.floor(pageIdx / noOfColumns);
      if (!acc[colIdx]) acc[colIdx] = [];
      if (!acc[colIdx][pageIdx % noOfColumns]) acc[colIdx][pageIdx % noOfColumns] = [];
      acc[colIdx][pageIdx % noOfColumns].push(curr);
      return acc;
    }, [])
  );
};

const PrintOldSerialModal = ({ onClose, selectedMaterial }) => {
  const [data, setData] = useState({});
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');

  const componentRef = React.useRef();
  const tableRef = React.useRef();

  useEffect(() => {
    const getOldSerialNo = (selectedData) => {
      const chunkSize = 10000; // Adjust chunk size based on memory
      let filteredData = [];

      for (let i = 0; i < selectedData.length; i += chunkSize) {
        const chunk = selectedData.slice(i, i + chunkSize); // Process chunk
        filteredData = filteredData.concat(chunk.map((item) => item.oldSerialNo));
      }

      return filteredData; // Save the filtered data
    };

    const fetchSerialNumbers = async (materialItem) => {
      setMessage('');
      setPending(true);
      const receivedData = await request('/devolution-material-list', {
        method: 'GET',
        query: {
          devolutionId: materialItem.id,
          ...(materialItem.approvalStatus === '0' && { listType: 0 })
        }
      });

      if (!receivedData?.success) {
        setMessage('An error occurred while fetching the old serial numbers.');
        setPending(false);
      }

      const serialNos = receivedData?.data?.data?.rows || [];

      setData({
        materialName: 'Old Materials',
        serialNumbers: getOldSerialNo(serialNos)
      });
      setPending(false);
    };

    if (selectedMaterial && selectedMaterial?.id) fetchSerialNumbers(selectedMaterial);
  }, [selectedMaterial]);

  const handlePrint = async () => {
    var printContents = componentRef.current.innerHTML;

    var printWindow = window.open('', '_blank');

    printWindow.document.open();
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Material Serial Numbers</title>
          <style>
            ${printStyles}
            ${serialTableStyles}
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    printWindow.document.close();

    printWindow.print();

    setTimeout(() => {
      printWindow.close();
    }, 1);

    printWindow.onfocus = () => {
      printWindow.close();
    };
  };

  return (
    <>
      <Modal open={true} onClose={onClose} style={modalSx}>
        <Box style={containerBoxSx}>
          <Box margin="2rem" ref={componentRef}>
            {pending && <Loader />}
            {message && <Typography variant="body">{message}</Typography>}
            <table cellSpacing={0} ref={tableRef} className="table-container">
              <React.Fragment key={`${data?.materialName}`}>
                <tbody className="table-head">
                  <tr rowSpan={2}>
                    <th colSpan={noOfColumns}>{`${data?.materialName ? data?.materialName : ''}`}</th>
                  </tr>
                </tbody>

                {(() => {
                  const { serialNumbers } = data;
                  const pages = createPairs(serialNumbers);

                  return (
                    pages &&
                    pages.length > 0 &&
                    pages.map((columns, pageIndex) => {
                      const rowsLength = columns[0].length;

                      return (
                        <>
                          <tbody className={pageIndex !== 0 ? 'page-br' : ''}>
                            {Array.from({ length: rowsLength })
                              .map((item2, index) => index + 1)
                              .map((item1, rowIndex) => (
                                <tr key={item1}>
                                  <>
                                    {Array.from({ length: noOfColumns })
                                      .map((it, index) => index + 1)
                                      .map((item2, colIndex) => {
                                        const serialNumber = pageIndex * pageSize * noOfColumns + colIndex * pageSize + rowIndex + 1;
                                        return (
                                          <td key={item2}>
                                            {columns?.[colIndex]?.[rowIndex] ? `${serialNumber}. ${columns[colIndex][rowIndex]}` : ''}
                                          </td>
                                        );
                                      })}
                                  </>
                                </tr>
                              ))}
                          </tbody>
                        </>
                      );
                    })
                  );
                })()}
              </React.Fragment>
            </table>
          </Box>

          <Box style={{ paddingLeft: '2rem', paddingBottom: '2rem' }}>
            <Button
              disabled={pending || message.length > 0}
              variant="contained"
              color="secondary"
              onClick={handlePrint}
              startIcon={<PrintIcon />}
            >
              Print
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

PrintOldSerialModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  selectedMaterial: PropTypes.any,
  forDevolution: PropTypes.bool
};

PrintOldSerialModal.defaultProps = {
  selectedMaterial: {}
};

export default PrintOldSerialModal;
