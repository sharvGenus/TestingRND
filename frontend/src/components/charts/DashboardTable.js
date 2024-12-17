/* eslint-disable react/no-array-index-key */
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Stack,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  IconButton
} from '@mui/material';
import PropTypes from 'prop-types';
import MenuIcon from '@mui/icons-material/Menu';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Skeleton } from '@mui/material';
import { useState } from 'react';
import DashboardNoResults from './DashboardNoResults';
import { convertIfDate } from 'utils';
import MainCard from 'components/MainCard';
import toast from 'utils/ToastNotistack';
import useAuth from 'hooks/useAuth';

export const TableSkeleton = ({ columns }) => {
  return (
    <>
      {Array.from({ length: 10 }).map((_, rowIndex) => (
        <TableRow key={rowIndex} sx={{ height: '24px' }}>
          {columns.map((column, colIndex) => (
            <TableCell key={colIndex} sx={{ padding: '4px' }}>
              <Skeleton variant="text" width="100%" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

TableSkeleton.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired
    })
  ).isRequired
};

const DashboardTable = ({
  minWidth = 750,
  containerSx = {},
  data = [],
  columns = [],
  highlightedColumnsCount = 0,
  loadingCondition,
  size,
  title,
  backgroundColor
}) => {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const tableId = `dashboard-table-${title}`;

  if (!data || data.length === 0) {
    return <DashboardNoResults title={title} />;
  }

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getFormattedDate = () => {
    const formatName = (name) => {
      const [firstName, ...rest] = name.trim().split(' ');
      const initials = rest.map((word) => word.charAt(0)?.toUpperCase()).join('');
      return initials ? `${firstName} ${initials}` : firstName;
    };

    const date = new Date();
    const istOffset = 5 * 60 * 60 * 1000 + 30 * 60 * 1000;
    const istDate = new Date(date.getTime() + istOffset);
    const year = istDate.getUTCFullYear();
    const month = String(istDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(istDate.getUTCDate()).padStart(2, '0');
    const hours = String(istDate.getUTCHours()).padStart(2, '0');
    const minutes = String(istDate.getUTCMinutes()).padStart(2, '0');
    const seconds = String(istDate.getUTCSeconds()).padStart(2, '0');

    const formattedName = formatName(user?.name);

    return `${formattedName}_${year}-${month}-${day}_${hours}-${minutes}-${seconds} IST`;
  };

  const handleExportPNG = async () => {
    const formattedDate = getFormattedDate();
    const tableElement = document.getElementById(tableId);
    if (!tableElement) return;

    try {
      const tableCanvas = await html2canvas(tableElement);
      const tableWidth = tableCanvas.width;
      const tableHeight = tableCanvas.height;

      const titleHeight = title !== 'none' ? 50 : 0;

      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = tableWidth;
      finalCanvas.height = tableHeight + titleHeight;
      const ctx = finalCanvas.getContext('2d');

      if (title !== 'none') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, finalCanvas.width, titleHeight);

        ctx.fillStyle = '#000000';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, finalCanvas.width / 2, titleHeight / 2);
      }

      ctx.drawImage(tableCanvas, 0, titleHeight);

      const dataUrl = finalCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = title === 'none' ? `${formattedDate}.png` : `${title.replace(/\s+/g, '_')}_${formattedDate}.png`;
      link.click();
      toast(`Table exported as PNG successfully.`, { variant: 'success', autoHideDuration: 1000 });
    } catch (error) {
      toast(error.message || `Can't export as PNG.`, { variant: 'error', autoHideDuration: 1000 });
    } finally {
      handleMenuClose();
    }
  };

  const handleExportPDF = async () => {
    const formattedDate = getFormattedDate();
    const tableElement = document.getElementById(tableId);
    if (!tableElement) return;

    try {
      const canvas = await html2canvas(tableElement);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();

      if (title !== 'none') {
        pdf.setFontSize(24);
        pdf.setFont('Arial', 'bold');
        pdf.text(title, pdf.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
      }

      pdf.addImage(imgData, 'PNG', 10, 30, 190, (canvas.height * 190) / canvas.width);
      pdf.save(title === 'none' ? `${formattedDate}.pdf` : `${title.replace(/\s+/g, '_')}_${formattedDate}.pdf`);
      toast(`Table exported as PDF successfully.`, { variant: 'success', autoHideDuration: 1000 });
    } catch (error) {
      toast(error.message || `Can't export as PDF.`, { variant: 'error', autoHideDuration: 1000 });
    } finally {
      handleMenuClose();
    }
  };

  const handleExportExcel = () => {
    const formattedDate = getFormattedDate();
    const ws = XLSX.utils.json_to_sheet([]);
    const wb = XLSX.utils.book_new();

    let startRow = 0;

    if (title !== 'none') {
      XLSX.utils.sheet_add_aoa(ws, [[title]], { origin: 'A1' });

      const endCol = columns.length - 1;
      ws['!merges'] = [{ s: { r: startRow, c: 0 }, e: { r: startRow, c: endCol } }];
      startRow += 1;
    }

    XLSX.utils.sheet_add_aoa(ws, [columns.map((col) => col.Header)], { origin: `A${startRow + 1}` });
    startRow += 1;

    XLSX.utils.sheet_add_json(ws, data, { skipHeader: true, origin: `A${startRow + 1}` });

    XLSX.utils.book_append_sheet(wb, ws, 'Dashboard Data');

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    saveAs(blob, title === 'none' ? `${formattedDate}.xlsx` : `${title.replace(/\s+/g, '_')}_${formattedDate}.xlsx`);
    toast(`Table exported as XLSX successfully.`, { variant: 'success', autoHideDuration: 1000 });

    handleMenuClose();
  };

  return (
    <MainCard>
      {title && (
        <Stack sx={{ border: '1px solid #97E7E1' }}>
          <Box
            sx={{
              backgroundColor: backgroundColor,
              py: 0.7,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: title !== 'none' ? 'normal' : 'flex-end',
              px: 2
            }}
          >
            {title !== 'none' && (
              <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <Typography variant="h6" color="common.white">
                  {title}
                </Typography>
              </Box>
            )}
            {data?.length > 0 && (
              <IconButton
                aria-label="export options"
                aria-controls="menu"
                aria-haspopup="true"
                onClick={handleMenuClick}
                sx={{ color: 'white', display: 'none' }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Menu id="menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleExportPNG}>
                <ListItemIcon>
                  <InsertPhotoIcon fontSize="small" />
                </ListItemIcon>
                Export as PNG
              </MenuItem>
              <MenuItem onClick={handleExportPDF}>
                <ListItemIcon>
                  <PictureAsPdfIcon fontSize="small" />
                </ListItemIcon>
                Export as PDF
              </MenuItem>
              <MenuItem onClick={handleExportExcel}>
                <ListItemIcon>
                  <DescriptionIcon fontSize="small" />
                </ListItemIcon>
                Export as Excel
              </MenuItem>
            </Menu>
          </Box>
        </Stack>
      )}
      <TableContainer id={tableId} component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto', ...containerSx }}>
        <Table size={size} stickyHeader aria-label="customized table" sx={{ minWidth }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  sx={{
                    backgroundColor: '#C6E0B4',
                    paddingX: '6px',
                    paddingY: '6px',
                    fontSize: '0.6rem',
                    fontWeight: 'bold',
                    lineHeight: '1.2'
                  }}
                  key={column.accessor}
                  align={column.align || 'left'}
                >
                  {column.Header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingCondition ? (
              <TableSkeleton columns={columns} />
            ) : data.length > 0 ? (
              data.map((row, index) => (
                <TableRow key={index} sx={{ height: '24px' }}>
                  {columns.map((column, columnIndex) => (
                    <TableCell
                      sx={{
                        paddingX: '6px',
                        paddingY: '4px',
                        fontSize: '0.7rem',
                        ...((highlightedColumnsCount ? columnIndex + 1 <= highlightedColumnsCount : columnIndex === 0) && {
                          backgroundColor: '#FFF2CC'
                        })
                      }}
                      key={column.accessor}
                      align={column.align || 'left'}
                    >
                      {column.Header.match(/date/i) ? convertIfDate(row[column.accessor]) : row[column.accessor]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : null}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
};

DashboardTable.propTypes = {
  containerSx: PropTypes.any,
  minWidth: PropTypes.number,
  headerCellSx: PropTypes.any,
  size: PropTypes.string,
  data: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      align: PropTypes.string
    })
  ).isRequired,
  highlightedColumnsCount: PropTypes.number,
  loadingCondition: PropTypes.bool,
  title: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string.isRequired
};

export default DashboardTable;
