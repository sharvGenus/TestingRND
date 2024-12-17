import { Box, Grid, Skeleton } from '@mui/material';
import PropTypes from 'prop-types';
import SummaryBlock from './SummaryBlock';
import SummaryGrid from './SummaryGrid';

const largePalette = [
  '#3B8BD5',
  '#D5D3D3',
  '#92D050',
  '#3B8BD5',
  '#6BA1D2',
  '#30A743',
  '#00ea00',
  '#F075E7',
  '#B4C6E7',
  '#97A723',
  '#CB536A',
  '#9BC2E6'
];

const smallPalette = ['#2F75B5', '#F4B084', '#8EA9DB', '#A8CF8D', '#9DC3E6'];

const unloadedDataValues = Array(12)
  .fill({
    title: <Skeleton variant="text" width={100} />,
    value: <Skeleton variant="text" width={50} />
  })
  .map((item, index) => ({
    id: index,
    ...item,
    bgColor: largePalette[index % largePalette.length],
    note:
      index === 9 || index === 10
        ? {
            value: <Skeleton variant="text" width={80} />,
            color: 'green'
          }
        : undefined
  }));

const isOdd = (value) => !isNaN(value) && value % 2 !== 0;

const DashboardSummary = ({ data: dataProps, reducedHeight, valueColor, expectedLength, loadingCondition, palette }) => {
  const data = loadingCondition ? unloadedDataValues : dataProps || unloadedDataValues;

  let blocksForDisplay = data;
  if (!loadingCondition && blocksForDisplay.length === 0 && !isNaN(expectedLength) && expectedLength !== 0) {
    blocksForDisplay = Array.from({ length: expectedLength }, (_, index) => ({
      id: `empty-block-${index}`,
      title: '-',
      value: '#',
      bgColor: '#f0f0f0',
      note: { value: 'No data available', color: 'red' }
    }));
  } else if (!isNaN(expectedLength) && expectedLength !== 0) {
    blocksForDisplay = data.slice(0, expectedLength);
  }

  if (isOdd(expectedLength) || isOdd(blocksForDisplay.length)) {
    return (
      <Box display="flex" justifyContent="center" minHeight={reducedHeight ? 42 : 84}>
        {blocksForDisplay.map((item, index) => (
          <SummaryBlock
            key={item.id || item.title}
            dataLength={blocksForDisplay.length}
            item={item}
            index={index}
            palette={palette || smallPalette}
            loadingCondition={loadingCondition}
            valueColor={valueColor}
            reducedHeight={reducedHeight}
          />
        ))}
      </Box>
    );
  } else {
    return (
      <Grid container minHeight={reducedHeight ? 42 : 84} spacing={0}>
        <SummaryGrid
          blocksForDisplay={blocksForDisplay}
          palette={palette || largePalette}
          loadingCondition={loadingCondition}
          valueColor={valueColor}
          reducedHeight={reducedHeight}
        />
      </Grid>
    );
  }
};

DashboardSummary.propTypes = {
  data: PropTypes.array,
  expectedLength: PropTypes.number,
  loadingCondition: PropTypes.bool,
  palette: PropTypes.array,
  reducedHeight: PropTypes.bool,
  valueColor: PropTypes.string
};

export default DashboardSummary;
