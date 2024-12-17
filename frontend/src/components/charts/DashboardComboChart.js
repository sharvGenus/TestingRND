import React, { memo, useRef, useState } from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, Bar, ResponsiveContainer } from 'recharts';
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
import { generateChartMargins, truncateChartLabel } from 'utils';
import MainCard from 'components/MainCard';
import { chartHeadingBgColor } from 'pages/dashboards/executive-dashboard/elements';
import useAuth from 'hooks/useAuth';
import toast from 'utils/ToastNotistack';

const CustomizedLabelLine = memo(({ x, y, stroke, value }) => (
  <text
    x={x}
    y={y}
    dy={-7}
    fill={stroke}
    fontSize={14}
    textAnchor="middle"
    style={{ textShadow: `1px 1px 2px white, -1px -1px 2px white, 1px -1px 2px white, -1px 1px 2px white` }}
  >
    {value}
  </text>
));

const CustomizedLabelBar = memo(({ x, y, stroke, value }) => (
  <text
    x={x}
    y={y}
    dy={-4}
    dx={10}
    fill={stroke}
    fontSize={14}
    textAnchor="middle"
    style={{ textShadow: `1px 1px 2px white, -1px -1px 2px white, 1px -1px 2px white, -1px 1px 2px white` }}
  >
    {value}
  </text>
));

const prTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  stroke: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
};

CustomizedLabelLine.propTypes = prTypes;
CustomizedLabelBar.propTypes = prTypes;

const parseValue = (item) => {
  if (Number.isNaN(item) && typeof item === 'string') {
    return Number(item);
  } else {
    return item;
  }
};

const transformData = (data) => {
  if (Array.isArray(data)) {
    return data.map((item) => transformData(item));
  } else if (typeof data === 'object') {
    return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, parseValue(value)]));
  } else {
    return data;
  }
};

const generateXAxisComponents = (types, data, selectedCategories, showValues) => {
  const components = [];
  const leftKeys = [];
  const rightKeys = [];

  for (const key in types) {
    if (!selectedCategories.includes(key)) {
      const { type, color } = types[key];
      let component;

      if (type === 'bar') {
        leftKeys.push(key);
        component = (
          <Bar key={key} dataKey={key} barSize={20} fill={color} label={showValues ? <CustomizedLabelBar /> : null} yAxisId="left" />
        );
      } else if (type === 'line') {
        rightKeys.push(key);
        component = (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={color}
            strokeWidth={1.5}
            label={showValues ? <CustomizedLabelLine /> : null}
            yAxisId="right"
          />
        );
      }

      components.push(component);
    }
  }

  const maxValue = Math.max(...data.map((item) => Math.max(...Object.values(item).filter((value) => typeof value === 'number'))));
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

  const yTicks = getYTicks();

  const xAxisComponents = [];

  if (leftKeys.length > 0) {
    xAxisComponents.push(
      <YAxis key="left" yAxisId="left" orientation="left" dataKey="value" ticks={yTicks} domain={[0, yAxisMax]} allowDecimals={false} />
    );
  }

  if (rightKeys.length > 0) {
    xAxisComponents.push(
      <YAxis key="right" yAxisId="right" orientation="right" dataKey="value" ticks={yTicks} domain={[0, yAxisMax]} allowDecimals={false} />
    );
  }

  return { xAxisComponents, chartComponents: components };
};

const DashboardComboChart = ({ data: originalData, chartConfig, title }) => {
  const chartRef = useRef();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showValues, setShowValues] = useState(false);
  const { user } = useAuth();
  const data = transformData(originalData);

  if (!data || data.length === 0) {
    return <DashboardNoResults title={title} />;
  }

  const { xAxisComponents, chartComponents } = generateXAxisComponents(chartConfig, data, selectedCategories, showValues);

  const maxLabelLength = data.reduce((max, item) => Math.max(max, item.name.length), 0);
  const [leftMargin, bottomMargin] = generateChartMargins(maxLabelLength);

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

    const xAxisComponentKey = xAxisComponents;

    const keys = Object.keys(data[0]).filter((key) => key !== xAxisComponentKey);

    const effectiveCategories = selectedCategories.length > 0 ? keys.filter((key) => !selectedCategories.includes(key)) : keys;

    const filteredData = data.map((item) => {
      const filteredItem = {};

      effectiveCategories.forEach((key) => {
        if (key in item) {
          const value = item[key];
          filteredItem[key] = typeof value === 'object' && value !== null ? JSON.stringify(value) : value;
        }
      });

      return filteredItem;
    });

    const worksheet = XLSX.utils.json_to_sheet(filteredData);

    const titleRow = [Array(effectiveCategories.length + 1).fill('')];
    titleRow[0][0] = title;
    XLSX.utils.sheet_add_aoa(worksheet, titleRow, { origin: 'A1' });

    worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: effectiveCategories.length } }];

    const headers = [xAxisComponentKey, ...effectiveCategories];
    if (Array.isArray(headers[0])) {
      headers.shift();
    }

    const capitalizedHeaders = headers.map((header) =>
      typeof header === 'string' ? header.charAt(0).toUpperCase() + header.slice(1).toLowerCase() : header
    );
    XLSX.utils.sheet_add_aoa(worksheet, [capitalizedHeaders], { origin: 'A2' });

    headers.forEach((header, index) => {
      const cell = worksheet[XLSX.utils.encode_cell({ r: 1, c: index })];
      if (cell) cell.s = { alignment: { horizontal: 'center' } };
    });

    XLSX.utils.sheet_add_json(worksheet, filteredData, { origin: 'A3', skipHeader: true });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, `${title.replace(/\s+/g, '_')}_${formattedDate}.xlsx`);

    toast(`Chart exported as XLSX successfully.`, { variant: 'success', autoHideDuration: 1000 });
    handleMenuClose();
  };

  const handleLegendClick = (category) => {
    setSelectedCategories((prev) => (prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]));
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
          <ComposedChart data={data} margin={{ top: 10, right: 20, bottom: bottomMargin + 10, left: leftMargin }}>
            <XAxis dataKey="name" angle={-34} textAnchor="end" dy={2} tickFormatter={truncateChartLabel} tick={{ fontSize: 14 }} />
            {xAxisComponents}
            <Tooltip />
            <Legend
              layout="horizontal"
              verticalAlign="top"
              align="center"
              onClick={({ value }) => handleLegendClick(value)}
              payload={Object.keys(chartConfig).map((key) => ({
                value: key,
                type: chartConfig[key].type,
                color: chartConfig[key].color
              }))}
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
            <CartesianGrid stroke="#f5f5f5" />
            {chartComponents}
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </MainCard>
  );
};

DashboardComboChart.propTypes = {
  data: PropTypes.array.isRequired,
  chartConfig: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired
};

export default DashboardComboChart;
