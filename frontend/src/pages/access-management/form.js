import { Box, Grid, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import PropTypes from 'prop-types';
import FormsIndex from './formsIndex';
import MainCard from 'components/MainCard';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number,
  index: PropTypes.number
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

const AccessManagement = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabsData = (
    <MainCard title={''}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <FormsIndex />
        </Grid>
      </Grid>
    </MainCard>
  );

  return (
    <Grid container spacing={1}>
      {/* <Grid item xs={12}>
        <Typography variant="h4">Access Management</Typography>
      </Grid> */}
      <Grid item xs={12}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Form Responses" {...a11yProps(0)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            {tabsData}
          </TabPanel>
        </Box>
      </Grid>
    </Grid>
  );
};

export default AccessManagement;
