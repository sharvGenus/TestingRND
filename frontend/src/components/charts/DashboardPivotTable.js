/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon
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
import { TableSkeleton } from './DashboardTable';
import DashboardNoResults from './DashboardNoResults';
import MainCard from 'components/MainCard';
import useAuth from 'hooks/useAuth';
import toast from 'utils/ToastNotistack';
import { RHFTextField } from 'hook-form';

const processData = (data, categoryName, subCategoryNames) => {
  if (!data || data.length === 0) {
    return { categories: [], subCategories: subCategoryNames, processedData: [], categoryRowSpan: {} };
  }

  const categories = [...new Set(data.map((item) => item[categoryName]))];
  const subCategories = subCategoryNames;

  const processedData = [];
  const categoryRowSpan = {};

  categories.forEach((category) => {
    const categoryData = data.filter((item) => item[categoryName] === category);
    const groupedData = {};

    categoryData.forEach((item) => {
      const textSubCategory = subCategories.find((key) => isNaN(item[key]));
      const textSubCategoryIndex = subCategories.indexOf(textSubCategory);

      const textSubCategoryData = item[textSubCategory];

      if (!groupedData[textSubCategoryData]) {
        groupedData[textSubCategoryData] = {
          category,
          [textSubCategory]: textSubCategoryData,
          ...Object.fromEntries(subCategories.slice(textSubCategoryIndex + 1).map((subCategory) => [subCategory, 0]))
        };
      }
      subCategories.slice(textSubCategoryIndex + 1).forEach((subCategory) => {
        groupedData[textSubCategoryData][subCategory] += parseInt(item[subCategory], 10);
      });
    });

    const groupedDataArray = Object.values(groupedData);
    categoryRowSpan[category] = groupedDataArray.length;
    processedData.push(...groupedDataArray);
  });

  return { categories, subCategories, processedData, categoryRowSpan };
};

const DashboardPivotTable = ({
  data,
  categoryName,
  subCategoryName,
  loadingCondition,
  title,
  backgroundColor,
  dateTimeFrom,
  dateTimeTo,
  setValue
}) => {
  const { subCategories, processedData, categoryRowSpan } = processData(data, categoryName, subCategoryName);

  let currentCategory = null;
  let currentCategoryRowSpan = 0;

  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const tableId = `dashboard-table-${title}`;

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

      const endCol = subCategories.length;
      ws['!merges'] = [{ s: { r: startRow, c: 0 }, e: { r: startRow, c: endCol } }];
      startRow += 1;
    }

    XLSX.utils.sheet_add_aoa(ws, [[categoryName, ...subCategories]], { origin: `A${startRow + 1}` });
    startRow += 1;

    processedData.forEach((row, rowIndex) => {
      const rowData = [];

      if (rowIndex === 0 || row.category !== processedData[rowIndex - 1].category) {
        rowData.push(row.category);
      } else {
        rowData.push('');
      }

      subCategories.forEach((subCategory) => {
        rowData.push(row[subCategory] || '');
      });

      XLSX.utils.sheet_add_aoa(ws, [rowData], { origin: `A${startRow + rowIndex + 1}` });
    });

    XLSX.utils.book_append_sheet(wb, ws, 'Pivot Table Data');

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
              justifyContent: 'space-between',
              px: 2
            }}
          >
            {title !== 'none' && (
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center'
                }}
              >
                <Typography variant="h6" color="common.white">
                  {title}
                </Typography>
              </Box>
            )}
            <Box
              sx={{
                display: 'flex',
                gap: 1.5,
                alignItems: 'center',
                flex: '0 1 auto'
              }}
            >
              <Box sx={{ display: 'flex', gap: 0.7, alignItems: 'center' }}>
                <Typography variant="h6" color={'#fff'}>
                  From:
                </Typography>
                <RHFTextField
                  name={'dateTimeFrom'}
                  value={dateTimeFrom}
                  onChange={(e) => setValue('dateTimeFrom', e.target.value)}
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                    style: { padding: '0 4px' }
                  }}
                  InputProps={{
                    style: { color: '#fff' }
                  }}
                  sx={{ borderRadius: 1 }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 0.7, alignItems: 'center' }}>
                <Typography variant="h6" color={'#fff'}>
                  To:
                </Typography>
                <RHFTextField
                  name={'dateTimeTo'}
                  value={dateTimeTo}
                  onChange={(e) => setValue('dateTimeTo', e.target.value)}
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                    style: { padding: '0 4px' }
                  }}
                  InputProps={{
                    style: { color: '#fff' }
                  }}
                  sx={{ borderRadius: 1 }}
                />
              </Box>
            </Box>
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
          </Box>
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
        </Stack>
      )}
      <TableContainer id={tableId} component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
        <Table stickyHeader aria-label="pivot table" sx={{ minWidth: 750 }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: '#C6E0B4',
                  paddingX: '6px',
                  paddingY: '6px',
                  fontSize: '0.6rem',
                  fontWeight: 'bold',
                  lineHeight: '1.2'
                }}
              >
                {categoryName}
              </TableCell>
              {subCategories.map((subCategory) => (
                <TableCell
                  key={subCategory}
                  sx={{
                    backgroundColor: '#C6E0B4',
                    paddingX: '6px',
                    paddingY: '6px',
                    fontSize: '0.6rem',
                    fontWeight: 'bold',
                    lineHeight: '1.2'
                  }}
                >
                  {subCategory}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingCondition ? (
              <TableSkeleton columns={[categoryName, ...subCategories]} />
            ) : processedData.length > 0 ? (
              processedData.map((row, index) => {
                const isNewCategory = row.category !== currentCategory;
                if (isNewCategory) {
                  currentCategory = row.category;
                  currentCategoryRowSpan = categoryRowSpan[currentCategory];
                }

                return (
                  <TableRow key={index} sx={{ height: '24px' }}>
                    {isNewCategory ? (
                      <TableCell
                        rowSpan={currentCategoryRowSpan}
                        sx={{
                          paddingX: '6px',
                          paddingY: '4px',
                          fontSize: '0.7rem',
                          backgroundColor: '#FFF2CC',
                          border: '1px solid #e2e2e2'
                        }}
                      >
                        {row.category}
                      </TableCell>
                    ) : (
                      <TableCell sx={{ display: 'none' }} />
                    )}
                    {subCategories.map((subCategory) => (
                      <TableCell key={subCategory} sx={{ paddingX: '6px', paddingY: '4px', fontSize: '0.7rem' }}>
                        {row[subCategory]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow sx={{ height: 300 }}>
                <DashboardNoResults />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
};

DashboardPivotTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  categoryName: PropTypes.string,
  subCategoryName: PropTypes.arrayOf(PropTypes.string),
  loadingCondition: PropTypes.bool,
  title: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  dateTimeFrom: PropTypes.string.isRequired,
  dateTimeTo: PropTypes.string.isRequired,
  setValue: PropTypes.string.isRequired
};

export default DashboardPivotTable;
