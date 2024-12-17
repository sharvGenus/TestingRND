import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router';
import { Button, Grid } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import Validations from 'constants/yupValidations';
import { getAllSupervisors, getDropdownProjects, getUsers } from 'store/actions';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import MainCard from 'components/MainCard';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import TableForm from 'tables/table';
import { ticketTableColumns } from 'pages/helpdesk/tickets/constants';
import { useUsers } from 'pages/extra-pages/users/useUsers';
import usePagination from 'hooks/usePagination';

let isFirstRender = true;
const TICKET_INITIAL_DATA = { rows: [], count: 0 };

const TicketAssignByWiseReport = ({ assignBy }) => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    setPageSize
  } = usePagination();

  const [loading, setLoading] = useState(false);
  const [ticketSourceDropdown, setTicketSourceDropdown] = useState([]);
  const [ticketData, setTicketData] = useState(TICKET_INITIAL_DATA);

  const projectData = useProjects()?.projectsDropdown?.projectsDropdownObject;
  const { supervisorUsers, users } = useUsers();
  const supervisorAssignmentsData = useMemo(() => supervisorUsers?.supervisorUsersObject?.rows || [], [supervisorUsers]);
  const userData = useMemo(() => users?.usersObject?.rows || [], [users]);

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.other,
        ticketSource: Validations.other
      })
    ),
    defaultValues: { projectId: undefined },
    mode: 'all'
  });

  const { handleSubmit, watch, setValue, reset } = methods;

  const getTicketSourceDropdown = useCallback(async () => {
    const response = await request('/ticket-source-dropdown', { method: 'GET' });
    if (response?.success) {
      setTicketSourceDropdown(response?.data?.data);
    } else {
      toast(response?.error?.message || 'Failed to load ticket source types', { variant: 'error' });
    }
  }, []);

  useEffect(() => {
    reset();
    setTicketData(TICKET_INITIAL_DATA);
  }, [reset, pathname]);

  useEffect(() => {
    getTicketSourceDropdown();
    dispatch(getDropdownProjects());
  }, [dispatch, getTicketSourceDropdown]);

  const projectWatch = watch('projectId');
  useEffect(() => {
    if (projectWatch) {
      if (assignBy.toLowerCase() === 'supervisor') {
        dispatch(getAllSupervisors({ projectId: [projectWatch] }));
      } else {
        dispatch(getUsers({ projectId: projectWatch }));
      }
    }
  }, [dispatch, projectWatch, assignBy]);

  const onFormSubmit = useCallback(
    async (formValues) => {
      setLoading(true);
      const response = await request('/ticket-assignby-report', {
        method: 'GET',
        query: { assignBy: assignBy.toLowerCase(), ...formValues, pageSize, pageIndex }
      });
      if (response?.success) {
        setTicketData(response?.data?.data);
      } else {
        toast(response?.error?.message || 'Something went wrong', { variant: 'error' });
      }
      setLoading(false);
    },
    [assignBy, pageIndex, pageSize]
  );

  useEffect(() => {
    if (!isFirstRender) {
      onFormSubmit(watch());
    }
    isFirstRender = false;
  }, [onFormSubmit, pageIndex, pageSize, watch]);

  return (
    <>
      <MainCard sx={{ mb: 2 }} title={`${assignBy} Wise Report`}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <RHFSelectbox
                name="projectId"
                onChange={() => {
                  setValue('assigneeId', '');
                }}
                label="Project"
                menus={projectData || []}
                required
              />
            </Grid>
            <Grid item xs={3}>
              <RHFSelectbox
                name="ticketSource"
                label="Ticket Source"
                menus={[{ id: 'all', name: 'All' }, ...ticketSourceDropdown]}
                required
              />
            </Grid>
            <Grid item xs={3}>
              <RHFSelectbox
                name="assigneeId"
                label={`${assignBy} List`}
                menus={assignBy.toLowerCase() === 'supervisor' ? supervisorAssignmentsData : userData}
                required
              />
            </Grid>
            <Grid item md={3} xl={3}>
              <RHFTextField name="dateFrom" type="date" label="Date From" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item md={3} xl={3}>
              <RHFTextField name="dateTo" type="date" label="Date To" InputLabelProps={{ shrink: true }} />
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
        title="Tickets"
        hideAddButton
        hideImportButton
        hideExportButton
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        pageIndex={pageIndex}
        pageSize={pageSize}
        hideActions
        data={ticketData.rows}
        count={ticketData.count}
        columns={ticketTableColumns}
      />
    </>
  );
};

TicketAssignByWiseReport.propTypes = {
  assignBy: PropTypes.string
};

export default TicketAssignByWiseReport;
