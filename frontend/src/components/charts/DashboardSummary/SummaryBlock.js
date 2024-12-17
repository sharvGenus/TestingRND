import { Box, Typography, Skeleton, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import { formatToThousandNotation } from 'utils';

export const SummaryTitle = ({ title }) => {
  return <Typography sx={{ textTransform: 'uppercase', textAlign: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>{title}</Typography>;
};

SummaryTitle.propTypes = {
  title: PropTypes.string.isRequired
};

export const SummaryValue = ({ value, loadingCondition, valueColor }) => {
  return (
    <Typography color={valueColor} style={{ fontSize: '1rem' }} {...(!valueColor && { fontWeight: 'bold' })}>
      {loadingCondition ? <Skeleton variant="text" width={50} /> : formatToThousandNotation(value)}
    </Typography>
  );
};

SummaryValue.propTypes = {
  value: PropTypes.number.isRequired,
  loadingCondition: PropTypes.bool.isRequired,
  valueColor: PropTypes.string.isRequired
};

const SummaryBlock = ({ item, index, palette, loadingCondition, dataLength, valueColor, reducedHeight }) => {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        px: 0.5,
        py: reducedHeight ? 0.5 : 1,
        gap: theme.spacing(0.5),
        backgroundColor: palette[index % palette.length],
        width: `${100 / dataLength}%`
      }}
    >
      {item.title && <SummaryTitle title={item.title} />}
      <SummaryValue value={item.value} loadingCondition={loadingCondition} valueColor={valueColor} />
    </Box>
  );
};

SummaryBlock.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  palette: PropTypes.array.isRequired,
  loadingCondition: PropTypes.bool.isRequired,
  dataLength: PropTypes.number.isRequired,
  valueColor: PropTypes.string.isRequired,
  reducedHeight: PropTypes.bool.isRequired
};

export default SummaryBlock;
