/* eslint-disable react/no-array-index-key */
import React, { useRef, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';
import { Box, Checkbox, FormControlLabel, IconButton, ListItemIcon, Menu, MenuItem, Stack, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { toPng } from 'html-to-image';
import DashboardNoResults from './DashboardNoResults';
import MainCard from 'components/MainCard';
import { chartHeadingBgColor } from 'pages/dashboards/executive-dashboard/elements';
import useAuth from 'hooks/useAuth';
import toast from 'utils/ToastNotistack';

export const excelPalettePieChart = ['#4472C4', '#5B9BD5', '#ED7D31', '#A5A5A5', '#FFC000'];

const pieChartPalette = [
  ...excelPalettePieChart,
  '#70AD47',
  '#264478',
  '#FF6EB4',
  '#FFD966',
  '#A64D79',
  '#FF5733',
  '#6C757D',
  '#FFC0CB',
  '#FFD700',
  '#00FF00'
];

const DashboardPieChart = ({ data, nameKey = 'name', title }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showValues, setShowValues] = useState(false);
  const chartRef = useRef();
  const { user } = useAuth();

  const keys = data && data.length > 0 ? Object.keys(data[0]).filter((key) => key !== 'name') : [];

  const allValuesZero = () => {
    return data?.every((item) =>
      keys.every((key) => {
        const value = item[key];
        return value === 0 || value === 'NaN' || (typeof value === 'number' && isNaN(value));
      })
    );
  };

  if (!data || data.length === 0 || allValuesZero()) {
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

  const handleExportPNG = () => {
    const formattedDate = getFormattedDate();
    if (chartRef.current) {
      const container = document.createElement('div');
      container.style.position = 'relative';
      container.style.width = `${chartRef.current.clientWidth}px`;
      container.style.height = `${chartRef.current.clientHeight + 50}px`;
      container.style.backgroundColor = 'white';

      const titleElement = document.createElement('div');
      titleElement.style.textAlign = 'center';
      titleElement.style.marginBottom = '10px';
      titleElement.innerHTML = `<h2>${title}</h2>`;
      container.appendChild(titleElement);

      const chartClone = chartRef.current.cloneNode(true);
      container.appendChild(chartClone);
      document.body.appendChild(container);

      toPng(container, { cacheBust: true })
        .then((dataUrl) => {
          saveAs(dataUrl, `${title.replace(/\s+/g, '_')}_${formattedDate}.png`);
          toast('Chart Exported as PNG successfully.', { variant: 'success', autoHideDuration: 1000 });
          document.body.removeChild(container);
        })
        .catch(() => {
          document.body.removeChild(container);
          toast('Failed to export chart as PNG.', { variant: 'error', autoHideDuration: 1000 });
        });
    }
    handleMenuClose();
  };

  const handleExportPDF = () => {
    const formattedDate = getFormattedDate();
    if (chartRef.current) {
      html2canvas(chartRef.current)
        .then((canvas) => {
          const pdf = new jsPDF();
          pdf.text(title, pdf.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

          const dataUrl = canvas.toDataURL('image/png');
          const imgProps = pdf.getImageProperties(dataUrl);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

          pdf.addImage(dataUrl, 'PNG', 0, 30, pdfWidth, pdfHeight);
          pdf.save(`${title.replace(/\s+/g, '_')}_${formattedDate}.pdf`);
          toast('Chart Exported as PDF successfully.', { variant: 'success', autoHideDuration: 1000 });
        })
        .catch(() => {
          toast('Failed to export chart as PDF.', { variant: 'error', autoHideDuration: 1000 });
        });
    }
    handleMenuClose();
  };

  const handleExportExcel = () => {
    const formattedDate = getFormattedDate();

    const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    const headers = [capitalizeFirstLetter(nameKey), 'Value'];

    const filteredData = data
      .filter((item) => !selectedCategories.includes(item[nameKey]))
      .map((item) => ({
        [capitalizeFirstLetter(nameKey)]: item[nameKey],
        Value: item.value
      }));

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const titleRow = Array(headers.length).fill('');
    titleRow[0] = title;
    XLSX.utils.sheet_add_aoa(worksheet, [titleRow], { origin: 'A1' });
    worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }];
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A2' });

    const dataRows = filteredData.map((item) => headers.map((header) => item[header] || ''));
    XLSX.utils.sheet_add_aoa(worksheet, dataRows, { origin: 'A3' });

    const workbook = XLSX.utils.book_new();
    const safeSheetTitle = title.length > 31 ? title.substring(0, 31) : title;
    XLSX.utils.book_append_sheet(workbook, worksheet, safeSheetTitle);

    XLSX.writeFile(workbook, `${title.replace(/\s+/g, '_')}_${formattedDate}.xlsx`);
    toast('Chart Exported as Excel successfully.', { variant: 'success', autoHideDuration: 1000 });
    handleMenuClose();
  };

  const handleLegendClick = (category) => {
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(category)) {
        return prevSelected.filter((key) => key !== category);
      } else {
        return [...prevSelected, category];
      }
    });
  };

  const getFilteredData = () => {
    return data.map((item) => ({
      ...item,
      hide: selectedCategories.includes(item[nameKey])
    }));
  };

  return (
    <MainCard>
      <Stack sx={{ border: '1px solid #97E7E1' }}>
        <Box
          sx={{
            backgroundColor: chartHeadingBgColor,
            py: 0.7,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            px: 2
          }}
        >
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
            <Typography variant="h6" color="common.white">
              {title}
            </Typography>
          </Box>
          <IconButton
            aria-label="export options"
            aria-controls="menu"
            aria-haspopup="true"
            onClick={handleMenuClick}
            sx={{ color: 'white', display: 'none' }}
          >
            <MenuIcon />
          </IconButton>
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
      <Box sx={{ p: 2, display: 'none', justifyContent: 'flex-end', alignItems: 'center' }}>
        <FormControlLabel
          control={<Checkbox checked={showValues} onChange={(e) => setShowValues(e.target.checked)} />}
          label="Show Values"
        />
      </Box>
      <ResponsiveContainer width="100%" height={267} ref={chartRef}>
        <PieChart>
          <Tooltip
            formatter={(value, name) => [
              `${value} (${((value / data.reduce((acc, entry) => acc + entry.value, 0)) * 100).toFixed(2)}%)`,
              name
            ]}
          />
          <Legend
            layout="vertical"
            verticalAlign="left"
            align="flex-start"
            iconType="square"
            onClick={(entry) => handleLegendClick(entry.value)}
            wrapperStyle={{
              display: 'flex',
              justifyContent: 'space-evenly',
              fontSize: '14px',
              fontWeight: 'bold',
              marginTop: '5px'
            }}
            formatter={(value, entry) => {
              const isCategorySelected = selectedCategories.includes(value);
              return <span style={{ color: isCategorySelected ? 'gray' : entry.color }}>{value}</span>;
            }}
          />

          <Pie
            data={getFilteredData()}
            dataKey="value"
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={250 / 2 - 20}
            fill="#8884d8"
            label={showValues ? ({ value, percent }) => `${value} (${(percent * 100).toFixed(2)}%)` : null}
          >
            {getFilteredData().map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={pieChartPalette[index % pieChartPalette.length]}
                style={{ display: entry.hide ? 'none' : 'block' }}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </MainCard>
  );
};

DashboardPieChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  nameKey: PropTypes.string,
  title: PropTypes.string.isRequired
};

export default DashboardPieChart;
