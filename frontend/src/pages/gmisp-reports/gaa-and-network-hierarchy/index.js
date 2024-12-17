import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Grid, Button } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, RHFSelectbox } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import { getDropdownProjects } from 'store/actions';
import TableForm from 'tables/table';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import usePagination from 'hooks/usePagination';

const GaaAndNetworkHierarchyReport = () => {
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project
      })
    ),
    defaultValues: {},
    mode: 'all'
  });
  const { handleSubmit, watch } = methods;

  const projectId = watch('projectId');

  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    setPageSize,
    refreshPagination
  } = usePagination();

  const [showTable, setShowTable] = useState(false);
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);

  let columns = [];

  if (data?.[0]) {
    columns = Object.keys(data[0]).map((item) => ({ Header: item, accessor: item }));
  }

  const { projectsDropdown } = useProjects();

  const projectData = projectsDropdown?.projectsDropdownObject;

  const dispatch = useDispatch();

  const loadData = useCallback(async () => {
    const response = await request(`/gaa-hierarchies-report`, { query: { pageSize, pageIndex }, params: projectId });

    if (!response?.success) {
      toast(response?.error?.message || 'Failed to load data', { variant: 'error' });
      setShowTable(false);
      return;
    }

    setData(response?.data?.data?.rows);
    setCount(response?.data?.data?.count || 0);
  }, [pageIndex, pageSize, projectId]);

  useEffect(() => {
    if (!projectId || !showTable) return;
    loadData();
  }, [loadData, projectId, showTable]);

  useEffect(() => {
    dispatch(getDropdownProjects());
  }, [dispatch]);

  return (
    <FormProvider
      methods={methods}
      onSubmit={handleSubmit(() => {
        setShowTable(true);
      })}
    >
      <MainCard title={'GAA & Network Hierarchy Report'} sx={{ mb: 2 }}>
        <Grid container spacing={4}>
          <Grid item md={4} xl={3}>
            <RHFSelectbox
              name="projectId"
              label="Project"
              InputLabelProps={{ shrink: true }}
              menus={projectData}
              onChange={() => {
                setShowTable(false);
                setData([]);
                refreshPagination();
              }}
              required
            />
          </Grid>

          <Grid container spacing={2} alignItems={'end'} sx={{ mt: 2 }}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', mb: '15px' }}>
              <Button type="submit" size="small" variant="contained" color="primary">
                Proceed
              </Button>
            </Grid>
          </Grid>
        </Grid>
        {showTable ? (
          <TableForm
            title=" "
            data={data}
            hideActions
            hideAddButton
            accessTableOnly
            count={count}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
            pageIndex={pageIndex}
            pageSize={pageSize}
            columns={columns}
            exportConfig={{ tableName: 'gaa_and_network_hierarchy', fileName: 'GAA And Network Hierarchy Report', apiQuery: { projectId } }}
          />
        ) : null}
      </MainCard>
    </FormProvider>
  );
};

export default GaaAndNetworkHierarchyReport;
