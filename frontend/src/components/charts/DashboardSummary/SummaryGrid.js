import { Grid, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import { SummaryTitle, SummaryValue } from './SummaryBlock';

const SummaryGrid = ({ blocksForDisplay, palette, loadingCondition, valueColor, reducedHeight }) => {
  const theme = useTheme();
  return blocksForDisplay.map((item, index) => (
    <Grid
      item
      key={item.id || item.title}
      xs={2}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{ px: 0.5, py: reducedHeight ? 0.5 : 1, gap: theme.spacing(0.5), backgroundColor: palette[index % palette.length] }}
    >
      {item.title && <SummaryTitle title={item.title} />}
      <SummaryValue value={item.value} loadingCondition={loadingCondition} valueColor={valueColor} />
    </Grid>
  ));
};

SummaryGrid.propTypes = {
  blocksForDisplay: PropTypes.array.isRequired,
  palette: PropTypes.array.isRequired,
  loadingCondition: PropTypes.bool.isRequired
};

export default SummaryGrid;
