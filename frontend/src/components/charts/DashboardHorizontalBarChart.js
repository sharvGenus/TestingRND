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
import { calculateChartDomain } from 'utils';
import toast from 'utils/ToastNotistack';
import { chartHeadingBgColor } from 'pages/dashboards/executive-dashboard/elements';
import MainCard from 'components/MainCard';
import useAuth from 'hooks/useAuth';

const DashboardHorizontalBarChart = ({ chartData, yAxis = 'key', title, height }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showValues, setShowValues] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const chartRef = useRef();
  const { user } = useAuth();

  if (!chartData || chartData.length === 0) {
    return <DashboardNoResults title={title} />;
  }

  const valueKey = Object.keys(chartData[0] || {}).find((item) => item !== yAxis);
  const yAxisMaxLabelLength = Math.max(...chartData.map((data) => String(data[yAxis]).length));
  const maxLengthOfXAxisLabel = Math.max(...chartData.map((item) => item[yAxis].length));
  const shouldAngleXAxis = chartData.length > 15;
  const isXAxisLabelLargeAndAngled = shouldAngleXAxis && maxLengthOfXAxisLabel > 10;

  const topMargin = isXAxisLabelLargeAndAngled ? 0 : 2;
  const bottomMargin = shouldAngleXAxis ? maxLengthOfXAxisLabel * 5.3 : 5;
  const leftMargin = isXAxisLabelLargeAndAngled ? 40 : 15;

  const maxBarSize = chartData.length > 15 ? 15 : 50;

  const dataMax = Math.max(...chartData.map((data) => data[valueKey]));
  const xAxisDomain = calculateChartDomain(dataMax);

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

    const effectiveCategories = Array.isArray(valueKey)
      ? selectedCategories.length > 0
        ? valueKey.filter((key) => !selectedCategories.includes(key))
        : valueKey
      : [valueKey];

    const filteredData = chartData.map((item) => {
      const filteredItem = {};
      filteredItem[yAxis] = item[yAxis];

      effectiveCategories.forEach((key) => {
        if (key in item) {
          const value = item[key];
          filteredItem[key] = typeof value === 'object' && value !== null ? JSON.stringify(value) : value;
        }
      });
      return filteredItem;
    });

    const worksheet = XLSX.utils.json_to_sheet([], { origin: 'A3' });
    XLSX.utils.sheet_add_json(worksheet, filteredData, { skipHeader: true, origin: 'A3' });

    const titleRow = [Array(effectiveCategories.length + 1).fill('')];
    titleRow[0][0] = title;
    XLSX.utils.sheet_add_aoa(worksheet, titleRow, { origin: 'A1' });
    worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: effectiveCategories.length } }];

    const headers = [yAxis, ...effectiveCategories];
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A2' });

    const capitalizedHeaders = headers.map((header) =>
      typeof header === 'string' ? header.charAt(0).toUpperCase() + header.slice(1).toLowerCase() : header
    );
    XLSX.utils.sheet_add_aoa(worksheet, [capitalizedHeaders], { origin: 'A2' });

    headers.forEach((header, index) => {
      const cell = worksheet[XLSX.utils.encode_cell({ r: 1, c: index })];
      if (cell) cell.s = { alignment: { horizontal: 'center' } };
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, `${title.replace(/\s+/g, '_')}_${formattedDate}.xlsx`);

    toast('Chart exported as XLSX successfully.', { variant: 'success', autoHideDuration: 1000 });
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

      <ResponsiveContainer width="100%" height={height} ref={chartRef}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{
            top: topMargin,
            right: 30,
            left: leftMargin,
            bottom: bottomMargin
          }}
          barSize={45}
          ref={chartRef}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={xAxisDomain} tickLine={false} axisLine={false} />
          <YAxis
            dataKey={yAxis}
            type="category"
            tickLine={false}
            width={Math.min(yAxisMaxLabelLength * 7.5, 300 * 0.3)}
            tickFormatter={(tick) => {
              const maxLabelLength = Math.floor(300 * 0.025);
              if (tick.length > maxLabelLength) {
                return `${tick.slice(0, maxLabelLength)}...`;
              }
              return tick;
            }}
          />
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
          <Bar dataKey={valueKey} fill="#0097A7" radius={[0, 5, 5, 0]} maxBarSize={maxBarSize} hide={selectedCategories.includes(valueKey)}>
            {showValues && <LabelList dataKey={valueKey} position="right" style={{ fill: '#000', fontWeight: 'bold' }} />}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </MainCard>
  );
};

DashboardHorizontalBarChart.propTypes = {
  chartData: PropTypes.array.isRequired,
  yAxis: PropTypes.string,
  title: PropTypes.string,
  height: PropTypes.number.isRequired
};

export default DashboardHorizontalBarChart;
