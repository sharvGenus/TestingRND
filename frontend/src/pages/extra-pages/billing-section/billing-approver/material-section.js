import { Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import MaterialApprove from './material-input';

const MaterialsSection = ({ heading, viewOnly, materialData }) => {
  return (
    <>
      <Typography gutterBottom component="div" sx={{ mt: '10px' }} variant="h4">
        {heading}
      </Typography>
      <Grid container spacing={4} mb={2}>
        <Grid item md={2} xl={2}>
          <Typography variant="h5" sx={{ fontSize: 14 }}>
            Particulars
          </Typography>
        </Grid>
        <Grid item md={2} xl={2}>
          <Typography variant="h5" sx={{ fontSize: 14 }}>
            UOM
          </Typography>
        </Grid>
        <Grid item md={1.5} xl={1.5}>
          <Typography variant="h5" sx={{ fontSize: 14 }}>
            Quantity
          </Typography>
        </Grid>
        <Grid item md={1.5} xl={1.5}>
          <Typography variant="h5" sx={{ fontSize: 14 }}>
            Rate
          </Typography>
        </Grid>
        <Grid item md={1.5} xl={1.5}>
          <Typography variant="h5" sx={{ fontSize: 14 }}>
            Tax
          </Typography>
        </Grid>

        <Grid item md={1.5} xl={1.5}>
          <Typography variant="h5" sx={{ fontSize: 14 }}>
            Amount
          </Typography>
        </Grid>
      </Grid>
      {materialData?.map((val) => (
        <MaterialApprove key={val.id} val={val} {...(viewOnly && { view: true })} />
      ))}
    </>
  );
};

MaterialsSection.propTypes = {
  heading: PropTypes.string,
  materialData: PropTypes.array,
  viewOnly: PropTypes.bool
};

export default MaterialsSection;
