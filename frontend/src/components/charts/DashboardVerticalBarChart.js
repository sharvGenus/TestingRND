import React, { useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';
import MenuIcon from '@mui/icons-material/Menu';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { toPng } from 'html-to-image';
import { Box, IconButton, Menu, MenuItem, Stack, Typography, FormControlLabel, Checkbox, ListItemIcon } from '@mui/material';
import DashboardNoResults from './DashboardNoResults';
import { generateChartMargins } from 'utils';
import MainCard from 'components/MainCard';
import toast from 'utils/ToastNotistack';
import { chartHeadingBgColor } from 'pages/dashboards/executive-dashboard/elements';
import useAuth from 'hooks/useAuth';

const DashboardVerticalBarChart = ({ chartData, xAxis = 'key', title }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showValues, setShowValues] = useState(false);
  const chartRef = useRef();
  const { user } = useAuth();

  if (!chartData || chartData.length === 0) {
    return <DashboardNoResults title={title} />;
  }

  const valueKey = Object.keys(chartData[0]).find((item) => item !== xAxis);
  const maxValue = Math.max(...chartData.map((item) => item[valueKey]));
  const yAxisMax = maxValue + Math.ceil(maxValue * 0.1);
  const ticketInterval = Math.ceil(yAxisMax / 6);

  const getYTicks = () => {
    const ticks = [];
    let tickValue = yAxisMax;

    while (tickValue >= 0) {
      ticks.push(tickValue);
      tickValue -= ticketInterval;
    }

    if (!ticks.includes(0)) {
      ticks.push(0);
    }

    return ticks;
  };

  const maxLabelLength = Math.max(...chartData.map((data) => data[xAxis].length));
  const [leftMargin, bottomMargin] = generateChartMargins(maxLabelLength);
  const isHighData = chartData.length > 5;

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
          toast('Exported as PNG successfully.', { variant: 'success', autoHideDuration: 1000 });
          document.body.removeChild(container);
        })
        .catch(() => {
          toast('Failed to export PNG.', { variant: 'error', autoHideDuration: 1000 });
          document.body.removeChild(container);
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
          toast('Exported as PDF successfully.', { variant: 'success', autoHideDuration: 1000 });
        })
        .catch(() => {
          toast('Failed to export PDF.', { variant: 'error', autoHideDuration: 1000 });
        });
    }
    handleMenuClose();
  };

  const handleExportExcel = () => {
    const formattedDate = getFormattedDate();

    const keys = Object.keys(chartData[0]).filter((key) => key !== xAxis);
    const effectiveCategories = selectedCategories.length > 0 ? keys.filter((key) => !selectedCategories.includes(key)) : keys;

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    const headers = [xAxis, ...effectiveCategories.map(capitalize)];

    const filteredData = chartData.map((item) =>
      headers.reduce((acc, key) => {
        acc[key] = item[key] || '';
        return acc;
      }, {})
    );

    const worksheet = XLSX.utils.json_to_sheet(filteredData);

    const titleRow = Array(headers.length).fill('');
    titleRow[0] = title;
    XLSX.utils.sheet_add_aoa(worksheet, [titleRow], { origin: 'A1' });

    worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }];

    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A2' });

    const dataRows = filteredData.map((item) => headers.map((header) => item[header] || ''));
    XLSX.utils.sheet_add_aoa(worksheet, dataRows, { origin: 'A3' });

    const applyCellStyles = (ws, cellRange) => {
      const range = XLSX.utils.decode_range(cellRange);
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          if (!ws[cellAddress]) ws[cellAddress] = {};
          ws[cellAddress].s = { alignment: { horizontal: 'center', vertical: 'center' } };
        }
      }
    };

    applyCellStyles(worksheet, 'A1:' + XLSX.utils.encode_col(headers.length - 1) + '1');
    applyCellStyles(worksheet, 'A2:' + XLSX.utils.encode_col(headers.length - 1) + '2');
    applyCellStyles(worksheet, 'A3:' + XLSX.utils.encode_col(headers.length - 1) + (filteredData.length + 2));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, `${title.replace(/\s+/g, '_')}_${formattedDate}.xlsx`);

    toast(`Chart exported as XLSX successfully.`, { variant: 'success', autoHideDuration: 1000 });
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

      <ResponsiveContainer width="100%" height={250} ref={chartRef}>
        <BarChart
          width={500}
          height={250}
          data={chartData}
          layout="horizontal"
          margin={{ left: isHighData ? leftMargin : 0, bottom: isHighData ? bottomMargin : 0, right: 10, top: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxis} />
          <YAxis domain={[0, yAxisMax]} ticks={getYTicks()} />
          <Tooltip />
          <Legend
            layout="horizontal"
            verticalAlign="top"
            align="center"
            onClick={(event) => handleLegendClick(event.dataKey)}
            iconType="square"
            wrapperStyle={{
              display: 'flex',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '5px'
            }}
            formatter={(value, entry) => {
              const isCategorySelected = selectedCategories.includes(value);
              return <span style={{ color: isCategorySelected ? 'gray' : entry.color }}>{value}</span>;
            }}
          />
          <Bar dataKey={valueKey} hide={selectedCategories.includes(valueKey)} fill="#0097A7" maxBarSize={30} stackId="a">
            {showValues && <LabelList dataKey={valueKey} position="top" fill="black" fontSize={10} offset={10} />}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </MainCard>
  );
};

DashboardVerticalBarChart.propTypes = {
  chartData: PropTypes.arrayOf(PropTypes.object).isRequired,
  xAxis: PropTypes.string,
  title: PropTypes.string.isRequired
};

export default DashboardVerticalBarChart;
