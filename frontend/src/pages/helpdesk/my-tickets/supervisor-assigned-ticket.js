import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, ButtonGroup, Dialog, Grid } from '@mui/material';
import { useTickets } from '../tickets/useTickets';
import { ticketFilterByDate, ticketHistoryTableColumns } from '../tickets/constants';
import { useSupervisorTickets } from './useSupervisorTickets';
import TableForm from 'tables/table';
import { getSupervisorTicket, getTicketHistory } from 'store/actions';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import usePagination from 'hooks/usePagination';

const supervisorAssignedTicketTableHeader = [
  {
    Header: 'Name',
    accessor: (list) => `${list?.['assignee']['name'] || ''}`
  },
  {
    Header: 'Code',
    accessor: (list) => `${list?.['assignee']['code'] || ''}`
  },
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
  },
  {
    Header: 'Created On',
    accessor: 'createdAt'
  }
];

const getFilteredTickets = (age, ticketList) => {
  if (age === 'all') return [...ticketList];
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  return ticketList.filter((ticket) => {
    const ticketCreateDate = new Date(ticket.createdAt);
    ticketCreateDate.setHours(0, 0, 0, 0);
    let dateDifference = Math.ceil((currentDate - ticketCreateDate) / (1000 * 60 * 60 * 24));
    if (dateDifference === 4 || dateDifference === 6) {
      dateDifference -= 1;
    }
    if (dateDifference > 7 && age === '8') {
      return true;
    }
    return dateDifference == age;
  });
};

const SupervisorAssignedTickets = () => {
  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    setPageSize
  } = usePagination();

  const dispatch = useDispatch();

  const [selectedTickets, setSelectedTickets] = useState([]);
  const [ticketHistoryObj, setTicketHistoryObj] = useState(null);
  const [aging, setAging] = useState();

  const { supervisorTicket } = useSupervisorTickets();
  const supervisorTicketData = useMemo(() => supervisorTicket.supervisorTicketObj || [], [supervisorTicket]);

  const { ticketHistory } = useTickets();
  const ticketHistoryData = ticketHistory?.ticketHistoryObject?.rows || [];
  const ticketHistoryDataCount = ticketHistory?.ticketHistoryObject?.count || 0;

  useEffect(() => {
    dispatch(getSupervisorTicket());
  }, [dispatch]);

  useEffect(() => {
    setAging({ id: 'all', tickets: supervisorTicketData });
  }, [supervisorTicketData]);

  useEffect(() => {
    if (ticketHistoryObj) {
      dispatch(getTicketHistory({ recordId: ticketHistoryObj.id, pageIndex, pageSize }));
    }
  }, [dispatch, ticketHistoryObj, pageIndex, pageSize]);

  const onTicketUpdateHandler = async () => {
    const response = await request('/update-supervisor-ticket', {
      method: 'PUT',
      body: { ticketArr: supervisorTicketData.filter((ticket) => selectedTickets.includes(ticket.id)) },
      query: { unassign: true }
    });
    if (response.success) {
      toast(`Successfully updated tickets.`, {
        variant: 'success',
        autoHideDuration: 10000
      });
      dispatch(getSupervisorTicket());
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
        <Grid item xs={12} sm={2}>
          <Button disabled={selectedTickets.length === 0} variant="contained" size="small" color="primary" onClick={onTicketUpdateHandler}>
            Unassign Tickets
          </Button>
        </Grid>
        <Grid item xs={12} sm={10} sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'flex-end', alignItems: 'center' }}>
          <ButtonGroup size="medium" disableElevation>
            {ticketFilterByDate.map((duration) => (
              <Button
                key={duration.id}
                color={duration.type && duration.type === 'error' ? 'error' : 'primary'}
                variant={aging?.id === duration.id ? 'contained' : 'outlined'}
                onClick={() => {
                  setAging({ ...duration, tickets: getFilteredTickets(duration.id, supervisorTicketData) });
                }}
              >{`${duration.label} (${getFilteredTickets(duration.id, supervisorTicketData).length || 0})`}</Button>
            ))}
          </ButtonGroup>
        </Grid>
      </Grid>
      <TableForm
        data={aging?.tickets || []}
        columns={supervisorAssignedTicketTableHeader}
        count={aging?.tickets?.length || 0}
        showCheckbox
        setSelectedRecords={(e) => {
          setSelectedTickets(e);
        }}
        hideViewIcon
        hideRestoreIcon
        hideDeleteIcon
        hideEditIcon
        hideAddButton
        hideExportButton
        accessTableOnly
        hidePagination
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
    </>
  );
};

export default SupervisorAssignedTickets;
