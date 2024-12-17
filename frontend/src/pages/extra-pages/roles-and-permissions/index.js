import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import PropTypes from 'prop-types';
import Role from './roles';
import Permissions from './permissions';

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

const RolesAndPermissions = () => {
  const [value, setValue] = useState(0);

  const handleChange = (...args) => setValue(args[1]);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography gutterBottom variant="h4">
        Roles And Permissions
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Roles" {...a11yProps(0)} />
          <Tab label="Permissions" {...a11yProps(1)} />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <Role />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Permissions />
      </TabPanel>
    </Box>
  );
};
export default RolesAndPermissions;
