/* eslint-disable */
import { Button, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import MainCard from 'components/MainCard';
import { FormProvider, RHFRadio, RHFSelectbox, RHFTextField } from 'hook-form';
import TableForm from 'tables/table';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import usePagination from 'hooks/usePagination';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getDropdownProjects } from 'store/actions';
import request from 'utils/request';

let isFirstRender = true;

const TABLE_HEADER = [
  { Header: 'Name', accessor: 'name' },
  { Header: 'Open', accessor: 'open' },
  { Header: 'Assigned', accessor: 'assigned' },
  { Header: 'In Progress', accessor: 'in_progress' },
  { Header: 'On Hold', accessor: 'on_hold' },
  { Header: 'Resolved', accessor: 'resolved' },
  { Header: 'Rejected', accessor: 'rejected' },
  { Header: 'Closed', accessor: 'closed' }
];

const TICKET_INITIAL_DATA = { rows: [], count: 0 };

const TicketStatusWiseReport = () => {
  const dispatch = useDispatch();

  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    setPageSize
  } = usePagination();

  const [loading, setLoading] = useState(false);
  const [ticketData, setTicketData] = useState(TICKET_INITIAL_DATA);

  const projectData = useProjects()?.projectsDropdown?.projectsDropdownObject;

  const methods = useForm({ defaultValues: {}, mode: 'all' });
  const { handleSubmit, watch } = methods;

  useEffect(() => {
    dispatch(getDropdownProjects());
  }, [dispatch]);

  const onFormSubmit = useCallback(async (formValues) => {
    setLoading(true);
    const response = await request('/ticket-status-report', {
      method: 'GET',
      query: { pageSize, pageIndex, projectId: watch('projectId'), assignBy: watch('assignBy') }
    });
    if (response?.success) {
      setTicketData(response?.data?.data);
    } else {
      toast(response?.error?.message || 'Something went wrong', { variant: 'error' });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isFirstRender) {
      onFormSubmit(watch());
    }
    isFirstRender = false;
  }, [onFormSubmit, pageIndex, pageSize]);

  return (
    <>
      <MainCard sx={{ mb: 2 }} title="Ticket Status Wise Report">
        <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <RHFSelectbox name="projectId" label="Project" menus={projectData || []} required />
            </Grid>
            <Grid item md={3} xl={3}>
              <RHFTextField name="dateFrom" type="date" label="Date From" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item md={3} xl={3}>
              <RHFTextField name="dateTo" type="date" label="Date To" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={4}>
              <RHFRadio
                name="assignBy"
                title="Ticket Assign By"
                singleLineRadio={'true'}
                labels={[
                  { name: 'Supervisor', value: 'supervisor' },
                  { name: 'O&M Engineer', value: 'installer' }
                ]}
                style={{
                  '& label': { marginTop: '0', width: '33%' },
                  marginTop: '10px !important',
                  padding: '3px 0'
                }}
                required
              />
            </Grid>
            <Grid item xs={12} textAlign="right">
              <Button type="submit" size="small" variant="contained" disabled={loading}>
                Proceed
              </Button>
            </Grid>
          </Grid>
        </FormProvider>
      </MainCard>
      <TableForm
        title="Ticket Stats"
        data={ticketData?.rows || []}
        count={ticketData?.count || 0}
        columns={TABLE_HEADER}
        hideAddButton
        hideImportButton
        hideExportButton
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        pageIndex={pageIndex}
        pageSize={pageSize}
        hideActions
      />
    </>
  );
};

export default TicketStatusWiseReport;
