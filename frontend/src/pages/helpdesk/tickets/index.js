import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, ButtonGroup, Dialog, Grid, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useTickets } from './useTickets';
import TicketForm from './ticket-form';
import { ticketFilterByDate, ticketHistoryTableColumns, ticketTableColumns } from './constants';
import CreateTicket from './create-ticket';
import { getDropdownProjects, getTicketAgingCount, getTicketByProject, getTicketHistory } from 'store/actions';
import TableForm from 'tables/table';
import usePagination from 'hooks/usePagination';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import { FormProvider, RHFSelectbox } from 'hook-form';
import MainCard from 'components/MainCard';
import { TICKET_STATUS_TYPE_LIST } from 'constants/constants';
import ImageCard from 'pages/form-configurator/responses/response-images';
import useSearch from 'hooks/useSearch';

const Tickets = () => {
  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    setPageSize
  } = usePagination();

  const dispatch = useDispatch();
  const [projectId, setProjectId] = useState();
  const [tableHeading, setTableHeading] = useState({ id: 'all', title: 'All Tickets' });
  const [aging, setAging] = useState();
  const [editTicketRow, setEditTicketRow] = useState();
  const [ticketHistoryObj, setTicketHistoryObj] = useState(null);
  const [showCreateTicketForm, setShowCreateTicketForm] = useState(false);
  const [openImage, setOpenImage] = useState(false);
  const [imageFileArr, setImageFileArr] = useState();

  const { projectsDropdown } = useProjects();
  const projectData = projectsDropdown?.projectsDropdownObject;

  const { tickets, ticketAging, ticketHistory } = useTickets();
  const ticketsData = tickets.ticketsObject?.rows || [];
  const ticketsDataCount = tickets?.ticketsObject?.count || 0;
  const ticketAgingData = ticketAging?.ticketAgingObject || {};
  const ticketHistoryData = ticketHistory?.ticketHistoryObject?.rows || [];
  const ticketHistoryDataCount = ticketHistory?.ticketHistoryObject?.count || 0;

  const { searchString, accessorsRef, setSearchString, setAccessors } = useSearch();

  const ticketTableHeader = useMemo(
    () => [
      ...ticketTableColumns,
      {
        Header: 'Attachments',
        accessor: (list) => {
          if (list?.['attachments'] && list['attachments'].length)
            return (
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  setOpenImage(true);
                  setImageFileArr(list['attachments']);
                }}
              >
                View
              </Button>
            );
        }
      }
    ],
    []
  );

  useEffect(() => {
    dispatch(getDropdownProjects());
  }, [dispatch]);

  const methods = useForm({
    defaultValues: {
      ticketStatus: 'all'
    },
    mode: 'all'
  });

  const ticketStatus = methods.watch('ticketStatus');
  const apiDispatcher = useCallback(() => {
    if (projectId) {
      dispatch(
        getTicketByProject({
          projectId,
          pageIndex,
          pageSize,
          aging: aging?.id,
          ticketStatus,
          searchString,
          accessorsRef
        })
      );
      setTableHeading({ id: aging?.id || 'all', title: `${aging?.label || 'All'} Tickets` });
    }
  }, [dispatch, pageIndex, pageSize, aging, ticketStatus, searchString, accessorsRef, projectId]);

  useEffect(() => {
    if (projectId) {
      dispatch(getTicketAgingCount({ projectId, aging: aging?.id, ticketStatus }));
    }
  }, [dispatch, ticketStatus, aging, projectId]);

  useEffect(() => {
    apiDispatcher();
  }, [apiDispatcher]);

  useEffect(() => {
    if (ticketHistoryObj) {
      dispatch(getTicketHistory({ recordId: ticketHistoryObj.id, pageIndex, pageSize }));
    }
  }, [dispatch, ticketHistoryObj, pageIndex, pageSize]);

  const ticketRowUpdate = (e) => {
    setEditTicketRow(ticketsData.filter((data) => data.id === e.id)[0]);
  };

  const ticketRowHistory = (ticket) => {
    setTicketHistoryObj({ id: ticket.id, number: ticket.updatedTicketNumber });
  };

  return (
    <>
      {showCreateTicketForm ? (
        <>
          <CreateTicket
            goToTicketList={(requireAPICall) => {
              setShowCreateTicketForm(false);
              if (requireAPICall) {
                apiDispatcher();
              }
            }}
          />
        </>
      ) : (
        <>
          {!editTicketRow ? (
            <>
              <FormProvider methods={methods}>
                <MainCard
                  title={
                    <Grid container xl={12} spacing={2}>
                      <Grid item xl={10} md={10}>
                        <Typography variant="h4">All Tickets</Typography>
                      </Grid>
                      <Grid item xl={2} md={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          onClick={() => {
                            setShowCreateTicketForm(true);
                          }}
                        >
                          Create New Ticket
                        </Button>
                      </Grid>
                    </Grid>
                  }
                  sx={{ mb: 2 }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={3}>
                      <RHFSelectbox
                        name={'project'}
                        onChange={(e) => {
                          setProjectId(e?.target?.value);
                        }}
                        label={'Select Project'}
                        InputLabelProps={{ shrink: true }}
                        menus={projectData}
                        required
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <RHFSelectbox
                        name={'ticketStatus'}
                        label={'Ticket Status'}
                        InputLabelProps={{ shrink: true }}
                        menus={[
                          { id: 'all', name: 'All' },
                          { id: 'open', name: 'Open' },
                          { id: 'closed', name: 'Closed' }
                        ]}
                        required
                      />
                    </Grid>
                    {projectId && (
                      <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                          <ButtonGroup size="medium" disableElevation>
                            {ticketFilterByDate.map((duration) => (
                              <Button
                                key={duration.id}
                                color={duration.type && duration.type === 'error' ? 'error' : 'primary'}
                                variant={tableHeading?.id === duration.id ? 'contained' : 'outlined'}
                                onClick={() => {
                                  setAging(duration);
                                }}
                              >{`${duration.label} (${ticketAgingData[duration.id] || 0})`}</Button>
                            ))}
                          </ButtonGroup>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          style={{ display: 'flex', gap: '20px', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap' }}
                        >
                          {TICKET_STATUS_TYPE_LIST.map((data) => {
                            if (methods.watch('ticketStatus') === 'open' && data.id === 'closed') return <></>;
                            return (
                              <Typography sx={{ p: 1 }} key={data.id} variant="span">{`${data.name} (${
                                ticketsData.filter((ticket) => ticket.ticketStatus === data.id).length
                              })`}</Typography>
                            );
                          })}
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                </MainCard>
              </FormProvider>
              <TableForm
                // title={tableHeading?.title || 'Tickets'}
                data={ticketsData}
                columns={ticketTableHeader}
                count={ticketsDataCount}
                setPageIndex={setPageIndex}
                setPageSize={setPageSize}
                pageIndex={pageIndex}
                pageSize={pageSize}
                hideAddButton
                fcAction
                hideViewIcon
                hideDeleteIcon
                hideRestoreIcon
                hideEditIcon={false}
                handleRowUpdate={ticketRowUpdate}
                handleRowHistory={ticketRowHistory}
                searchConfig={{ searchString, setAccessors, setSearchString }}
                exportConfig={{
                  tableName: 'tickets',
                  apiQuery: { projectId, aging: aging?.id, ticketStatus }
                }}
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
              <Dialog open={openImage} onClose={() => setOpenImage(null)} scroll="paper" disableEscapeKeyDown>
                <ImageCard imageList={imageFileArr} />
              </Dialog>
            </>
          ) : (
            <TicketForm
              projectId={projectId}
              ticket={editTicketRow}
              ticketStatusTypeList={TICKET_STATUS_TYPE_LIST}
              gaaResponseData={{ responseId: editTicketRow.responseId, formId: editTicketRow.formId }}
              onCloseTicketForm={(requireAPICall) => {
                setEditTicketRow();
                if (requireAPICall) {
                  apiDispatcher();
                }
              }}
            />
          )}
        </>
      )}
    </>
  );
};

export default Tickets;
