import { useCallback, useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, Grid, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { chartHeadingBgColor } from '../executive-dashboard/elements';
import MainCard from 'components/MainCard';
import DashboardTable from 'components/charts/DashboardTable';
import { FormProvider, RHFSelectbox } from 'hook-form';
import { ticketFilterByDate } from 'pages/helpdesk/tickets/constants';
import toast from 'utils/ToastNotistack';
import request from 'utils/request';
import DashboardPieChart from 'components/charts/DashboardPieChart';
import DashboardHorizontalBarChart from 'components/charts/DashboardHorizontalBarChart';

const TICKET_USER_STATS = [
  {
    Header: 'Name',
    accessor: 'name'
  },
  {
    Header: 'Total Tickets',
    accessor: 'total_tickets'
  },
  {
    Header: 'Assigned',
    accessor: 'assigned'
  },
  {
    Header: 'In Progress',
    accessor: 'in_progress'
  },
  {
    Header: 'On Hold',
    accessor: 'on_hold'
  }
];

const TicketStatusDashboard = () => {
  const [ticketDateWiseData, setTicketDateWiseData] = useState();
  const [ticketPriorityWiseData, setTicketPriorityWiseData] = useState();
  const [ticketStatusWiseData, setTicketStatusWiseData] = useState();
  const [ticketFormWiseData, setTicketFormWiseData] = useState([]);
  const [ticketIssueWiseData, setTicketIssueWiseData] = useState([]);
  const [supervisorTickets, setSupervisorTickets] = useState([]);
  const [installerTickets, setInstallerTickets] = useState([]);

  const [ticketSourceDropdown, setTicketSourceDropdown] = useState([]);
  const methods = useForm({ defaultValues: { ticket_source: 'WFM' } });
  const { watch } = methods;
  const ticketSourceWatch = watch('ticket_source');

  const calculatePercentage = (data) => {
    const total = Object.values(data).reduce((sum, value) => sum + parseInt(value), 0);
    return Object.keys(data).map((key) => ({
      name: key,
      value: Number(data[key]),
      percentage: ((data[key] / total) * 100).toFixed(2)
    }));
  };

  const formatFormWiseChartData = (formWiseData) => {
    return formWiseData.map((item) => ({
      'Meter Type': item.name,
      'Ticket Form Wise': Number(item.count)
    }));
  };

  const formatIssueWiseChartData = (IssueWiseData) => {
    return IssueWiseData.map((item) => ({
      'Issue Type': item.name,
      'Issue Wise': Number(item.count)
    }));
  };

  const getTicketDashboardData = useCallback(async () => {
    const response = await request('/ticket-dashboard', { method: 'GET', query: { ticketSource: ticketSourceWatch } });
    if (response?.success) {
      const { data } = response.data;
      const {
        ticketDate,
        ticketPriority,
        ticketStatus,
        ticketform,
        ticketIssue,
        supervisorTickets: supervisorTicketData,
        installerTickets: installerTicketData
      } = data;
      const formattedPriorityData = calculatePercentage(ticketPriority);
      setTicketPriorityWiseData(formattedPriorityData);
      setTicketDateWiseData(ticketDate);
      setTicketStatusWiseData(ticketStatus);
      const formattedFormWiseData = formatFormWiseChartData(ticketform);
      setTicketFormWiseData(formattedFormWiseData);
      const formattedIssueWiseData = formatIssueWiseChartData(ticketIssue);
      setTicketIssueWiseData(formattedIssueWiseData);
      setSupervisorTickets(supervisorTicketData);
      setInstallerTickets(installerTicketData);
    } else {
      toast(response?.error?.message || 'Something went wrong', { variant: 'error' });
    }
  }, [
    ticketSourceWatch,
    setTicketDateWiseData,
    setTicketPriorityWiseData,
    setTicketStatusWiseData,
    setTicketFormWiseData,
    setTicketIssueWiseData,
    setSupervisorTickets,
    setInstallerTickets
  ]);

  const getTicketSourceDropdown = useCallback(async () => {
    const response = await request('/ticket-source-dropdown', { method: 'GET' });
    if (response?.success) {
      setTicketSourceDropdown(response?.data?.data);
    } else {
      toast(response?.error?.message || 'Failed to load ticket source types', { variant: 'error' });
    }
  }, []);

  useEffect(() => {
    getTicketDashboardData();
  }, [getTicketDashboardData]);

  useEffect(() => {
    getTicketSourceDropdown();
  }, [getTicketSourceDropdown]);

  return (
    <MainCard sx={{ mb: 2 }}>
      <Typography
        sx={{
          borderRadius: '0.25rem',
          backgroundColor: '#203764',
          color: '#fff',
          py: 1,
          mb: 2,
          fontSize: 18,
          textAlign: 'center',
          fontWeight: 'bold'
        }}
      >
        Ticket Status Dashboard
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <FormProvider methods={methods}>
            <RHFSelectbox label="Ticket Source" name="ticket_source" menus={ticketSourceDropdown || []} />
          </FormProvider>
        </Grid>
        <Grid item xs={12}>
          <ButtonGroup sx={{ width: '100%', flexWrap: 'wrap' }} size="medium" disableElevation>
            {ticketFilterByDate.map((duration) => (
              <Button
                sx={{
                  flex: 1,
                  alignItems: 'center',
                  gap: 1,
                  color: duration.type && duration.type === 'error' ? 'error' : '#0F67B1',
                  borderColor: chartHeadingBgColor
                }}
                key={duration.id}
                variant="outlined"
              >
                <Typography sx={{ color: '#0F67B1', fontWeight: 'bold' }}>{`${duration.label} ${
                  duration.id === 'all' ? 'Tickets' : ''
                } `}</Typography>
                <Typography component="span" sx={{ fontWeight: 'bold', color: '#0F67B1' }}>
                  {`(${ticketDateWiseData?.[duration.id] || 0})`}
                </Typography>
              </Button>
            ))}
          </ButtonGroup>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" spacing={2}>
            {ticketStatusWiseData &&
              Object.keys(ticketStatusWiseData).map((key) => (
                <Stack
                  sx={{
                    flex: 1,
                    borderRadius: '0.25rem',
                    border: '1px solid',
                    borderColor: key === 'Rejected' ? '#D24545' : chartHeadingBgColor
                  }}
                  spacing={1}
                  key={key}
                >
                  <Typography
                    sx={{ p: 0.5, backgroundColor: key === 'Rejected' ? '#D24545' : chartHeadingBgColor, color: 'common.white' }}
                    textAlign="center"
                  >
                    {key}
                  </Typography>
                  <Typography sx={{ p: 0.5, color: key === 'Rejected' ? '#A94438' : '#0F67B1', fontWeight: 'bold' }} textAlign="center">
                    {ticketStatusWiseData[key]}
                  </Typography>
                </Stack>
              ))}
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Box width="100%">
            <DashboardPieChart data={ticketPriorityWiseData} nameKey="name" title="Priority Wise Distribution" />
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box width="100%">
            <DashboardHorizontalBarChart
              chartData={ticketFormWiseData}
              yAxis="Meter Type"
              title="Meter Type Wise Distribution"
              height={267}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <DashboardHorizontalBarChart chartData={ticketIssueWiseData} yAxis="Issue Type" title="Issue Wise Distribution" height={300} />
        </Grid>
        <Grid item xs={6}>
          <DashboardTable
            size="small"
            minWidth={0}
            headerCellSx={{ minWidth: 0, width: '1rem' }}
            containerSx={{ flex: 1 }}
            data={supervisorTickets}
            columns={TICKET_USER_STATS}
            title={'Supervisor Tickets (Top 15)'}
            backgroundColor={chartHeadingBgColor}
          />
        </Grid>
        <Grid item xs={6}>
          <DashboardTable
            minWidth={0}
            size="small"
            headerCellSx={{ minWidth: 0, width: '1rem' }}
            containerSx={{ flex: 1 }}
            data={installerTickets}
            columns={TICKET_USER_STATS}
            title={'Installer Tickets (Top 15)'}
            backgroundColor={chartHeadingBgColor}
          />
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default TicketStatusDashboard;
