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
import { Box, Checkbox, FormControlLabel, IconButton, ListItemIcon, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { excelPalettePieChart } from './DashboardPieChart';
import DashboardNoResults from './DashboardNoResults';
import { chartHeadingBgColor } from 'pages/dashboards/executive-dashboard/elements';
import MainCard from 'components/MainCard';
import toast from 'utils/ToastNotistack';
import useAuth from 'hooks/useAuth';
import { truncateChartLabel } from 'utils';

const paletteSmall = [...excelPalettePieChart, '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2'];
const paletteLarge = [
  ...excelPalettePieChart,
  '#1f77b4',
  '#2ca02c',
  '#d62728',
  '#9467bd',
  '#8c564b',
  '#e377c2',
  '#7f7f7f',
  '#bcbd22',
  '#17becf',
  '#aec7e8',
  '#ffbb78',
  '#98df8a',
  '#ff9896',
  '#c5b0d5',
  '#c49c94'
];

const getStackedChartColors = (noOfItems = 10) => {
  let selectedArray;
  if (noOfItems <= 7) {
    selectedArray = paletteSmall;
  } else {
    selectedArray = paletteLarge;
  }
  return selectedArray.slice(0, Math.min(noOfItems, selectedArray.length));
};

const DashboardHorizontalStackedBarChart = ({ data = [], yAxisKey: yAxisKeyFromProp, title }) => {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showValues, setShowValues] = useState(false);
  const chartRef = useRef();

  if (data.length === 0) {
    return <DashboardNoResults title={title} />;
  }

  const stackedChartColors = getStackedChartColors(data.length);
  const [firstKey] = Object.keys(data[0]);
  const yAxisKey = yAxisKeyFromProp || firstKey;

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

    const keys = Object.keys(data[0]).filter((key) => key !== yAxisKey);

    const effectiveCategories = selectedCategories.length > 0 ? keys.filter((key) => !selectedCategories.includes(key)) : keys;

    const filteredData = data.map((item) =>
      effectiveCategories.reduce((acc, key) => {
        acc[yAxisKey] = item[yAxisKey];
        acc[key] = item[key];
        return acc;
      }, {})
    );

    const worksheet = XLSX.utils.json_to_sheet(filteredData);

    const titleRow = [Array(effectiveCategories.length + 1).fill('')];
    titleRow[0][0] = title;

    XLSX.utils.sheet_add_aoa(worksheet, titleRow, { origin: 'A1' });

    worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: effectiveCategories.length } }];

    const headers = [yAxisKey, ...effectiveCategories];
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A2' });

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
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
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

      <Box sx={{ position: 'relative', mt: 4 }}>
        <FormControlLabel
          control={<Checkbox checked={showValues} onChange={() => setShowValues(!showValues)} name="showValues" color="primary" />}
          label="Show Values"
          sx={{ display: 'none', justifyContent: 'flex-end', alignItems: 'center', pr: '20px' }}
        />
        <ResponsiveContainer width="100%" height={300} ref={chartRef}>
          <BarChart layout="vertical" data={data} ref={chartRef}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey={yAxisKey} tickFormatter={truncateChartLabel} width={150} />
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

            {Object.keys(data[0])
              .filter((key) => key !== yAxisKey)
              .map((category, idx) => {
                const isCategorySelected = selectedCategories.includes(category);
                return (
                  <Bar key={category} dataKey={category} stackId="a" fill={stackedChartColors[idx]} opacity={isCategorySelected ? 0.3 : 1}>
                    {showValues && <LabelList dataKey={category} position="center" />}
                  </Bar>
                );
              })}
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </MainCard>
  );
};

DashboardHorizontalStackedBarChart.propTypes = {
  data: PropTypes.array,
  yAxisKey: PropTypes.string,
  showLabels: PropTypes.bool,
  title: PropTypes.string
};

export default DashboardHorizontalStackedBarChart;
