import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import FormWiseMapping from './form-wise-mapping';
import ProjectWiseMapping from './project-wise-mapping';

const Configurator = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const onTabChangeHandler = (...args) => setCurrentTab(args[1]);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography gutterBottom variant="h4">
        Configure Ticket
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={currentTab} onChange={onTabChangeHandler}>
          <Tab label="Project Wise Mapping" />
          <Tab label="Form Wise Mapping" />
        </Tabs>
      </Box>
      <Box sx={{ pt: 2 }}>
        {currentTab === 0 && <ProjectWiseMapping />}
        {currentTab === 1 && <FormWiseMapping />}
      </Box>
    </Box>
  );
};

export default Configurator;
