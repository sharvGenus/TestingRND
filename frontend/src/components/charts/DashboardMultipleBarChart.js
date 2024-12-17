import React, { useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import PropTypes from 'prop-types';
import { Menu, MenuItem, IconButton, Stack, Box, Typography, ListItemIcon, Checkbox, FormControlLabel } from '@mui/material';
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
import { chartHeadingBgColor } from 'pages/dashboards/executive-dashboard/elements';
import MainCard from 'components/MainCard';
import toast from 'utils/ToastNotistack';
import useAuth from 'hooks/useAuth';
import { truncateChartLabel } from 'utils';

const palette = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c', '#d0ed57', '#ffc0cb'];

const DashboardMultipleBarChart = ({ chartData, xAxis, title, height }) => {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showValues, setShowValues] = useState(false);
  const chartRef = useRef();

  if (!chartData || !chartData.length) {
    return <DashboardNoResults title={title} />;
  }

  const keys = Object.keys(chartData[0]).filter((key) => key !== xAxis);
  const colors = keys.length <= 2 ? palette.slice(0, 2) : palette;

  const getMaxValue = () => {
    const activeCategories = Object.keys(chartData[0])?.filter((key) => key !== keys && !selectedCategories?.includes(key));
    if (activeCategories?.length === 0) {
      return Infinity;
    }
    return Math.max(
      ...chartData.map((item) => {
        const total = activeCategories.reduce((acc, key) => {
          const value = parseInt(item[key], 10);
          return acc + (isNaN(value) ? 0 : value);
        }, 0);
        return total;
      })
    );
  };

  const visibleDataMax = getMaxValue();
  const yAxisMax = visibleDataMax + Math.ceil(visibleDataMax * 0.1);
  const tickInterval = Math.ceil(yAxisMax / 6);

  const getYTicks = () => {
    const ticks = [];
    let tickValue = yAxisMax;

    while (tickValue >= 0) {
      ticks.push(tickValue);
      tickValue -= tickInterval;
    }

    if (!ticks.includes(0)) {
      ticks.push(0);
    }

    return ticks;
  };

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
          toast(`Chart exported as PNG successfully.`, { variant: 'success', autoHideDuration: 1000 });
          document.body.removeChild(container);
        })
        .catch((error) => {
          toast(error.message || `Can't export as PNG.`, { variant: 'error', autoHideDuration: 1000 });
          document.body.removeChild(container);
        });
    } else {
      toast(`Can't export as PNG.`, { variant: 'error', autoHideDuration: 1000 });
    }
    handleMenuClose();
  };

  const handleExportPDF = () => {
    const formattedDate = getFormattedDate();
    setTimeout(() => {
      if (chartRef.current && chartRef.current instanceof Node) {
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
            toast(`Chart exported as PDF successfully.`, { variant: 'success', autoHideDuration: 1000 });
          })
          .catch((error) => {
            toast(error.message || `Can't export as PDF.`, { variant: 'error', autoHideDuration: 1000 });
          });
      } else {
        toast(`Can't export as PDF.`, { variant: 'error', autoHideDuration: 1000 });
      }
    }, 1000);
    handleMenuClose();
  };

  const handleExportExcel = () => {
    const formattedDate = getFormattedDate();
    const effectiveCategories = selectedCategories.length > 0 ? keys.filter((key) => !selectedCategories.includes(key)) : keys;

    const filteredData = chartData.map((item) =>
      effectiveCategories.reduce((acc, key) => {
        acc[xAxis] = item[xAxis];
        acc[key] = item[key];
        return acc;
      }, {})
    );

    const worksheet = XLSX.utils.json_to_sheet(filteredData);

    const titleRow = [Array(effectiveCategories.length + 1).fill('')];
    titleRow[0][0] = title;
    XLSX.utils.sheet_add_aoa(worksheet, titleRow, { origin: 'A1' });

    worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: effectiveCategories.length } }];

    const capitalizeHeader = (header) => header.charAt(0).toUpperCase() + header.slice(1);
    const headers = [xAxis, ...effectiveCategories].map(capitalizeHeader);

    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A2' });

    XLSX.utils.sheet_add_json(worksheet, filteredData, { origin: 'A3', skipHeader: true });

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

  const shouldAngleXAxis = chartData.length > 15;

  const maxBarSize = chartData.length > 15 ? 15 : 50;

  return (
    <MainCard sx={{ height: 500, width: '100%' }}>
      {title && (
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
            {title !== 'none' && (
              <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <Typography variant="h6" color="common.white">
                  {title}
                </Typography>
              </Box>
            )}
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
      )}

      <Box sx={{ position: 'relative', mt: 4 }}>
        <FormControlLabel
          control={<Checkbox checked={showValues} onChange={() => setShowValues(!showValues)} name="showValues" color="primary" />}
          label="Show Values"
          sx={{ display: 'none', justifyContent: 'flex-end', alignItems: 'center', pr: '20px' }}
        />
        <ResponsiveContainer width="100%" height={height} ref={chartRef}>
          <BarChart width="100%" height={height} ref={chartRef} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={xAxis}
              angle={shouldAngleXAxis ? -45 : 0}
              textAnchor={shouldAngleXAxis ? 'end' : 'middle'}
              padding={{ left: 10, right: 10 }}
              height={200}
              interval={0}
              tickFormatter={truncateChartLabel}
            />
            <YAxis allowDecimals={false} ticks={getYTicks()} domain={[0, yAxisMax]} />
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

            {keys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
                hide={selectedCategories.includes(key)}
                maxBarSize={maxBarSize}
                stackId="a"
              >
                {showValues && <LabelList dataKey={key} position="top" fill="black" fontSize={10} offset={10} />}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </MainCard>
  );
};

DashboardMultipleBarChart.propTypes = {
  chartData: PropTypes.array.isRequired,
  xAxis: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired
};

export default DashboardMultipleBarChart;
