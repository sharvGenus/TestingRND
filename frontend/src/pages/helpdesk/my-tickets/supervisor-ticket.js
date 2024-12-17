import { Button, Dialog, Grid, Typography } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTickets } from '../tickets/useTickets';
import { ticketHistoryTableColumns } from '../tickets/constants';
import TableForm from 'tables/table';
import { getTicketByProject, getTicketHistory } from 'store/actions';
import toast from 'utils/ToastNotistack';
import request from 'utils/request';
import usePagination from 'hooks/usePagination';

const supervisorTableHeader = [
  {
    Header: 'Ticket Number',
    accessor: (list) => `${list?.['project_wise_ticket_mapping']['prefix'] || ''}${list?.['ticketNumber']}`
  },
  {
    Header: 'Ticket Status',
    accessor: (list) => list?.['ticketStatus'].toUpperCase() || ''
  },
  {
    Header: 'Ticket Priority',
    accessor: 'priority'
  },
  {
    Header: 'Ticket Issue',
    accessor: 'issue.name'
  },
  {
    Header: 'Ticket Sub Issue',
    accessor: 'sub_issue.name'
  },
  {
    Header: 'Ticket Description',
    accessor: 'description'
  },
  {
    Header: 'Ticket Remarks',
    accessor: 'remarks'
  },
  {
    Header: 'Assignee Remark',
    accessor: 'assigneeRemarks'
  }
];

const SupervisorTickets = () => {
  const installerTableHeader = [
    {
      Header: 'Action',
      accessor: (list) => (
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            ticketUpdateHandler(list.assigneeId);
          }}
        >
          Assign
        </Button>
      )
    },
    {
      Header: 'Name',
      accessor: 'name'
    },
    {
      Header: 'Code',
      accessor: 'code'
    },
    {
      Header: 'Level',
      accessor: 'gaaName'
    },
    {
      Header: 'Level Entry',
      accessor: (list) =>
        list?.['gaaValue']?.split(',').map((item) => (
          <Typography sx={{ whiteSpace: 'nowrap' }} key={item}>
            {item}
          </Typography>
        ))
    },
    {
      Header: 'Total Tickets',
      accessor: 'totalTickets'
    },
    {
      Header: 'Assigned Tickets',
      accessor: 'assigned'
    },
    {
      Header: 'In Progress Tickets',
      accessor: 'in-progress'
    },
    {
      Header: 'On Hold Tickets',
      accessor: 'on-hold'
    }
  ];

  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    setPageSize
  } = usePagination();

  const dispatch = useDispatch();

  const [selectedTickets, setSelectedTickets] = useState([]);
  const [installerList, setInstallerList] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [ticketHistoryObj, setTicketHistoryObj] = useState(null);

  const { tickets, ticketHistory } = useTickets();
  const ticketsData = tickets.ticketsObject?.rows || [];
  const ticketHistoryData = ticketHistory?.ticketHistoryObject?.rows || [];
  const ticketHistoryDataCount = ticketHistory?.ticketHistoryObject?.count || 0;

  useEffect(() => {
    dispatch(getTicketByProject({ bySupervisorIdFlag: true }));
  }, [dispatch]);

  useEffect(() => {
    if (ticketHistoryObj) {
      dispatch(getTicketHistory({ recordId: ticketHistoryObj.id, pageIndex, pageSize }));
    }
  }, [dispatch, ticketHistoryObj, pageIndex, pageSize]);

  const onSelectInstallerHandler = async () => {
    const response = await request('/ticket/installer', { method: 'GET' });
    if (response.success) {
      setInstallerList(response?.data?.data || []);
      setIsDialogOpen(true);
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  const onTicketCloseHandler = async () => {
    const updatedTickets =
      ticketsData
        ?.filter((ticket) => selectedTickets.includes(ticket.id))
        .map((ticket) => ({ ...ticket, ticketStatus: 'closed', assigneeType: 'nomc', assigneeId: null, supervisorId: null })) || [];
    const response = await request('/update-supervisor-ticket', {
      method: 'PUT',
      body: { ticketArr: updatedTickets }
    });
    if (response.success) {
      toast(`Successfully Closed tickets.`, {
        variant: 'success',
        autoHideDuration: 10000
      });
      dispatch(getTicketByProject({ bySupervisorIdFlag: true }));
      setSelectedTickets([]);
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  const ticketUpdateHandler = async (assigneeId) => {
    const updatedTickets =
      ticketsData
        ?.filter((ticket) => selectedTickets.includes(ticket.id))
        .map((ticket) => ({ ...ticket, ticketStatus: 'assigned', assigneeId })) || [];

    const response = await request('/update-supervisor-ticket', {
      method: 'PUT',
      body: { ticketArr: updatedTickets }
    });
    if (response.success) {
      toast(`Successfully updated tickets.`, {
        variant: 'success',
        autoHideDuration: 10000
      });
      dispatch(getTicketByProject({ bySupervisorIdFlag: true }));
      setSelectedTickets([]);
      setIsDialogOpen(false);
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  const ticketRowHistory = (ticket) => {
    setTicketHistoryObj({ id: ticket.id, number: `${ticket['project_wise_ticket_mapping']['prefix'] || ''}${ticket['ticketNumber']}` });
  };

  return (
    <>
      <Grid container sx={{ mb: 2 }}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <Button
            sx={{ width: { xs: '100%', sm: 'auto' } }}
            disabled={selectedTickets.length === 0}
            variant="contained"
            size="small"
            color="primary"
            onClick={onTicketCloseHandler}
          >
            Close Tickets
          </Button>
          <Button
            sx={{ width: { xs: '100%', sm: 'auto' } }}
            disabled={selectedTickets.length === 0}
            variant="contained"
            size="small"
            color="primary"
            onClick={onSelectInstallerHandler}
          >
            Select Installer
          </Button>
        </Grid>
      </Grid>
      <TableForm
        data={ticketsData || []}
        columns={supervisorTableHeader}
        count={ticketsData?.length || 0}
        showCheckbox
        setSelectedRecords={(e) => {
          setSelectedTickets(e);
        }}
        hideViewIcon
        hideRestoreIcon
        hideExportButton
        hideAddButton
        hideDeleteIcon
        hideEditIcon
        hidePagination
        accessTableOnly
        hideEmptyTable
        handleRowHistory={ticketRowHistory}
      />
      <Dialog
        open={ticketHistoryObj}
        onClose={() => {
          setTicketHistoryObj(null);
        }}
        scroll="body"
        maxWidth="lg"
      >
        <TableForm
          isHistory
          title={`Ticket Number : ${ticketHistoryObj?.number || ''}`}
          data={ticketHistoryData}
          columns={ticketHistoryTableColumns}
          count={ticketHistoryDataCount}
          hideActions
          hideSearch
          hideAddButton
          hideExportButton
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          pageSize={pageSize}
        />
      </Dialog>
      <Dialog
        open={isDialogOpen}
        scroll="body"
        maxWidth="lg"
        onClose={() => {
          setIsDialogOpen(false);
        }}
      >
        <TableForm
          title="Installer List"
          data={installerList || []}
          columns={installerTableHeader}
          count={installerList?.length || 0}
          hidePagination
          hideActions
          accessTableOnly
          hideAddButton
          hideExportButton
        />
      </Dialog>
    </>
  );
};

export default SupervisorTickets;
