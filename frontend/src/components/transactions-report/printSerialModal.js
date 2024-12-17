import React from 'react';
import { Modal, Button, Box, Typography } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import PropTypes from 'prop-types';
import './printSerialModal.css';
import useSerialNumbers from './useSerialNumbers';
import { printStyles, serialTableStyles } from './styles';
import Loader from 'components/Loader';

const containerBoxSx = { width: '85%', height: '80%', backgroundColor: 'white', overflow: 'auto' };
const modalSx = { display: 'flex', alignItems: 'center', justifyContent: 'center' };

const noOfColumns = 4;
const pageSize = 44;

const createPairs = (data) => {
  return data.reduce((acc, curr, idx) => {
    const pageIdx = Math.floor(idx / pageSize);
    const colIdx = Math.floor(pageIdx / noOfColumns);
    if (!acc[colIdx]) acc[colIdx] = [];
    if (!acc[colIdx][pageIdx % noOfColumns]) acc[colIdx][pageIdx % noOfColumns] = [];
    acc[colIdx][pageIdx % noOfColumns].push(curr);
    return acc;
  }, []);
};

const PrintSerialModal = ({ onClose, selectedMaterialList }) => {
  const componentRef = React.useRef();
  const tableRef = React.useRef();

  const { data, pending, message } = useSerialNumbers(selectedMaterialList);

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
              {data.map((item) => {
                return (
                  <React.Fragment key={`${item.materialName} - ${item.materialCode}`}>
                    <tbody className="table-head">
                      <tr rowSpan={2}>
                        <th colSpan={noOfColumns}>{`${item.materialName} - ${item.materialCode}`}</th>
                      </tr>
                    </tbody>

                    {(() => {
                      const { serialNumbers } = item;
                      const pages = createPairs(serialNumbers);

                      return pages.map((columns, pageIndex) => {
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
                      });
                    })()}
                  </React.Fragment>
                );
              })}
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

PrintSerialModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  selectedMaterialList: PropTypes.array.isRequired
};

PrintSerialModal.defaultProps = {
  selectedMaterialList: []
};

export default PrintSerialModal;
