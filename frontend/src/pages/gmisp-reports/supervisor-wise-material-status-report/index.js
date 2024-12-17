import { useForm } from 'react-hook-form';
import { Button, Grid } from '@mui/material';
import RHFDateTimePicker from 'hook-form/RHFDateTimePicker';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router';
import { useReports } from '../useReports';
import { FormProvider, RHFSelectTags } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import { getAllSupervisors, getDropdownProjects, getMaterialTypesForReport } from 'store/actions';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import { useUsers } from 'pages/extra-pages/users/useUsers';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import TableForm from 'tables/table';
import usePagination from 'hooks/usePagination';

const supervisorColumns = [
  {
    Header: 'Customer',
    accessor: 'Organizations - Customer__name'
  },
  {
    Header: 'Project',
    accessor: 'Projects__name'
  },
  {
    Header: 'Material Type',
    accessor: 'Master Maker Lovs - Material Type__name'
  },
  {
    Header: 'Supervisor Name',
    accessor: 'Users - Supervisor__name'
  },
  {
    Header: 'Supervisor Code',
    accessor: 'Users - Supervisor__code'
  },
  {
    Header: 'Installer Name',
    accessor: 'Users - Installer__name'
  },
  {
    Header: 'Installer Code',
    accessor: 'Users - Installer__code'
  },
  {
    Header: 'Item Serial No.',
    accessor: 'Material Serial Numbers__serial_number'
  },
  {
    Header: 'Item Issued Date',
    accessor: 'created_at'
  },
  {
    Header: 'Item Status',
    accessor: 'Item Status'
  },
  {
    Header: 'Item Installed Date',
    accessor: 'Item Installed Date'
  }
];

const installerColumns = [
  {
    Header: 'Customer',
    accessor: 'Organizations - Customer__name'
  },
  {
    Header: 'Project',
    accessor: 'Projects__name'
  },
  {
    Header: 'Material Type',
    accessor: 'Master Maker Lovs - Material Type__name'
  },
  {
    Header: 'Installer Name',
    accessor: 'Users - Installer__name'
  },
  {
    Header: 'Installer Code',
    accessor: 'Users - Installer__code'
  },
  {
    Header: 'Item Serial No.',
    accessor: 'Material Serial Numbers__serial_number'
  },
  {
    Header: 'Item Issued Date',
    accessor: 'created_at'
  },
  {
    Header: 'Transaction Number',
    accessor: 'reference_document_number'
  },
  {
    Header: 'Item Status',
    accessor: 'Item Status'
  },
  {
    Header: 'Item Installed Date',
    accessor: 'Item Installed Date'
  }
];

const SupervisorMaterialStatusReport = ({ type }) => {
  const dispatch = useDispatch();

  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    setPageSize
  } = usePagination();

  const [reportData, setReportData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [installerData, setInstallerData] = useState([]);
  const [count, setCount] = useState(0);
  const [showTable, setShowTable] = useState(false);

  const { projectsDropdown } = useProjects();
  const projectData = useMemo(() => projectsDropdown?.projectsDropdownObject || [], [projectsDropdown]);

  const { materialTypeForReport } = useReports();
  const materialTypeData = useMemo(() => materialTypeForReport?.materialTypeArr || [], [materialTypeForReport]);

  const { supervisorUsers } = useUsers();
  const supervisorAssignmentsData = useMemo(() => supervisorUsers?.supervisorUsersObject?.rows || [], [supervisorUsers]);

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.projectArr
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit } = methods;

  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getMaterialTypesForReport());
  }, [dispatch]);

  const getInstallerList = useCallback(async (projectList) => {
    const response = await request('/installer-list/stock-ledger', { method: 'GET', query: { projectId: projectList } });
    if (response.success) {
      setInstallerData(response?.data?.data || []);
    } else {
      toast(response.message || 'Something went wrong', { variant: 'error' });
    }
  }, []);

  const projectWatch = methods.watch('projectId');
  useEffect(() => {
    if (projectWatch?.length) {
      if (type === 'supervisor') {
        dispatch(getAllSupervisors({ projectId: projectWatch }));
      } else if (type === 'installer') {
        getInstallerList(projectWatch);
      }
    }
  }, [dispatch, getInstallerList, projectWatch, type]);

  const formValue = methods.watch(['projectId', 'supervisorId', 'installerId', 'materialTypeId', 'fromDate', 'toDate']);
  const [projectId, supervisorId, installerId, materialTypeId, fromDate, toDate] = formValue;

  const fetchData = useCallback(async () => {
    if (projectId?.length === 0) return;
    setIsLoading(true);
    const response = await request('/supervisor-wise-material-report', {
      method: 'GET',
      query: { projectId, supervisorId, installerId, materialTypeId, fromDate, toDate, type, pageIndex, pageSize }
    });
    setIsLoading(false);
    if (response.success) {
      setReportData(response?.data?.data?.rows);
      setCount(response?.data?.data?.count);
      setShowTable(true);
    } else {
      toast(response?.error?.message || 'Something went wrong', { variant: 'error' });
    }
  }, [projectId, supervisorId, installerId, materialTypeId, fromDate, toDate, pageIndex, pageSize, type]);

  const onFormSubmitHandler = () => {
    fetchData();
  };

  useEffect(() => {
    if (methods.formState.isSubmitted) {
      fetchData();
    }
  }, [fetchData, methods.formState.isSubmitted]);

  const location = useLocation();

  useEffect(() => {
    setShowTable(false);
    methods.reset();
  }, [location.pathname, methods]);

  useEffect(() => {
    if (projectId?.length === 0) {
      setShowTable(false);
      methods.reset();
    }
  }, [methods, projectId?.length]);

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmitHandler)}>
        <MainCard title={`${type === 'supervisor' ? 'Supervisor' : 'Installer'} Wise Material Status Report`} sx={{ mb: 2 }}>
          <Grid container spacing={4}>
            <Grid item md={6}>
              <RHFSelectTags
                name="projectId"
                label="Project"
                InputLabelProps={{ shrink: true }}
                menus={projectData}
                required
                onChange={() => {
                  methods.setValue('supervisorId', []);
                }}
              />
            </Grid>
            <Grid item md={6}>
              <RHFSelectTags
                name={type === 'supervisor' ? 'supervisorId' : 'installerId'}
                label={`${type === 'supervisor' ? 'Supervisor' : 'Installer'} Name`}
                InputLabelProps={{ shrink: true }}
                menus={type === 'supervisor' ? supervisorAssignmentsData : installerData}
              />
            </Grid>
            <Grid item md={6}>
              <RHFSelectTags name="materialTypeId" label="Material Type" InputLabelProps={{ shrink: true }} menus={materialTypeData} />
            </Grid>
            <Grid item md={3}>
              <RHFDateTimePicker pickerType="dateOnly" name="fromDate" label="Issued Date From" />
            </Grid>
            <Grid item md={3}>
              <RHFDateTimePicker pickerType="dateOnly" name="toDate" label="Issued Date To" />
            </Grid>
            <Grid item xs={12} textAlign="right">
              <Button size="small" variant="contained" type="submit">
                Proceed
              </Button>
            </Grid>
          </Grid>
        </MainCard>
      </FormProvider>
      {showTable && (
        <TableForm
          loadingCondition={isLoading}
          hideActions
          hideAddButton
          data={reportData || []}
          count={count || 0}
          columns={type === 'supervisor' ? supervisorColumns : installerColumns}
          pageIndex={pageIndex}
          pageSize={pageSize}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          exportConfig={{
            tableName: type === 'supervisor' ? 'supervisor-wise-material-status-report' : 'installer-wise-material-status-report',
            apiQuery: { projectId, ...(type === 'supervisor' ? { supervisorId } : { installerId }), materialTypeId, fromDate, toDate, type }
          }}
        />
      )}
    </>
  );
};

SupervisorMaterialStatusReport.propTypes = {
  type: PropTypes.string
};

export default SupervisorMaterialStatusReport;
