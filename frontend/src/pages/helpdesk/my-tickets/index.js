/* eslint-disable */
import { useState } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import SupervisorTickets from './supervisor-ticket';
import SupervisorAssignedTickets from './supervisor-assigned-ticket';

const MyTickets = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const onTabChangeHandler = (...args) => setCurrentTab(args[1]);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography gutterBottom variant="h4">
        My Tickets
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={currentTab} onChange={onTabChangeHandler}>
          <Tab label="Self" />
          <Tab label="Team" />
        </Tabs>
      </Box>
      <Box sx={{ pt: 2 }}>
        {currentTab === 0 && <SupervisorTickets />}
        {currentTab === 1 && <SupervisorAssignedTickets />}
      </Box>
    </Box>
  );
};

export default MyTickets;
