import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Grid, Button } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import RHFMultiSelectbox from 'hook-form/RHFMultipleSelectbox';
import { useReports } from '../useReports';
import { FormProvider, RHFTextField } from 'hook-form';
import Validations from 'constants/yupValidations';
import MainCard from 'components/MainCard';
import {
  getDropdownProjects,
  getLovsForMasterName,
  getMasterMakerLov,
  getOrganizationStores,
  getStocksByDate,
  getStocksByDateForExport
} from 'store/actions';
import { fetchTransactionType } from 'utils';
import usePagination from 'hooks/usePagination';
import TableForm from 'tables/table';
import { useMasterMakerLov } from 'pages/extra-pages/master-maker-lov/useMasterMakerLov';
import { useProjects } from 'pages/extra-pages/project/useProjects';
// import { useOrganizationStore } from 'pages/extra-pages/organization-store/useOrganizationStore';

const DocumentWiseReport = () => {
  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    setPageSize
  } = usePagination();
  const [showTable, setShowTable] = useState(false);
  const dispatch = useDispatch();
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.projectArr,
        // organizationId: Validations.organizationId,
        // storeId: Validations.storeArr,
        // fromDate: Validations.fromDate,
        toDate: Validations.toDate
        // transactionTypeId: Validations.transaction
      })
    ),
    defaultValues: {},
    mode: 'all'
  });
  const typeData = [
    {
      id: '3bf4cfe9-0ba0-4ba5-bd66-bfae7eecfeaf',
      value: 'GRN',
      name: 'GRN'
    },
    {
      id: 'fc1015da-7db4-4aa6-844d-92a5557f7941',
      value: 'MRN',
      name: 'MRN'
    },
    {
      id: 'ac909ed3-92c2-4cdf-b463-0e351c42cda2',
      value: 'MIN',
      name: 'MIN'
    },
    {
      id: 'ef599c14-9e23-447d-9f35-336d69fdfe74',
      value: 'Comsumption',
      name: 'Comsumption'
    }
  ];
  const { handleSubmit } = methods;

  const { projectsDropdown } = useProjects();
  const { masterMakerLovs } = useMasterMakerLov();
  // const { organizationStores } = useOrganizationStore();

  const projectData = projectsDropdown?.projectsDropdownObject;
  const orgTypeData = masterMakerLovs.masterMakerLovsObject?.rows;
  // const storeData = organizationStores?.organizationStoreObject?.rows;

  const { stocksByDate, stocksByDateForExport } = useReports();

  const { data, count } = useMemo(
    () => ({
      data: stocksByDate.stocksObject?.rows || [],
      count: stocksByDate.stocksObject?.count || 0,
      isLoading: stocksByDate.loading || false
    }),
    [stocksByDate]
  );

  const { allData } = useMemo(
    () => ({
      allData: stocksByDateForExport.stocksObject?.rows || [],
      isLoading: stocksByDateForExport.loading || false
    }),
    [stocksByDateForExport]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Project Name',
        accessor: 'project.name'
      },
      {
        Header: 'Referece Document Number',
        accessor: 'referenceDocumentNumber'
      },
      {
        Header: 'Movement Name',
        accessor: 'transaction_type.name'
      },
      {
        Header: 'Material Name',
        accessor: 'material.name'
      },
      {
        Header: 'UOM',
        accessor: 'uom.name'
      },
      {
        Header: 'Store',
        accessor: 'organization_store.name'
      },
      {
        Header: 'Storage Location',
        accessor: 'organization_store_location.name'
      },
      {
        Header: 'Other Store',
        accessor: 'other_store.name'
      },
      {
        Header: 'Quantity',
        accessor: 'quantity'
      },
      {
        Header: 'Rate',
        accessor: 'rate'
      },
      {
        Header: 'Value',
        accessor: 'value'
      },
      {
        Header: 'Created On',
        accessor: 'createdAt'
      }
    ],
    []
  );

  useEffect(() => {
    dispatch(getLovsForMasterName('TRANSACTION TYPE'));
  }, [dispatch]);

  const onFormSubmit = async (formValues) => {
    formValues['pageSize'] = pageSize;
    formValues['pageIndex'] = pageIndex;
    dispatch(
      getStocksByDate({
        ...formValues,
        projectId: formValues?.projectId && formValues?.projectId.length && formValues?.projectId.map((x) => x.id),
        transactionTypeId:
          formValues?.transactionTypeId && formValues?.transactionTypeId.length
            ? formValues?.transactionTypeId.map((x) => x.id)
            : typeData.map((x) => x.id)
      })
    );
    dispatch(
      getStocksByDateForExport({
        ...formValues,
        projectId: formValues?.projectId && formValues?.projectId.length && formValues?.projectId.map((x) => x.id),
        transactionTypeId:
          formValues?.transactionTypeId && formValues?.transactionTypeId.length
            ? formValues?.transactionTypeId.map((x) => x.id)
            : typeData.map((x) => x.id)
      })
    );
    setShowTable(true);
  };

  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getMasterMakerLov());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getOrganizationStores({ organizationType: fetchTransactionType(orgTypeData, 'COMPANY') }));
  }, [dispatch, orgTypeData]);

  const updateRateValue = (arr) => {
    return arr.map((x) => {
      return {
        ...x,
        rate: x?.rate?.toFixed(3),
        value: x.value?.toFixed(3)
      };
    });
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={'Document Wise Report'} sx={{ mb: 2 }}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              <RHFMultiSelectbox name="projectId" label="Project" InputLabelProps={{ shrink: true }} menus={projectData} required />
            </Grid>
            {/* <Grid item md={3} xl={2}>
              <RHFSelectbox name="organizationId" label="Organization" InputLabelProps={{ shrink: true }} menus={[]} />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                name="organizationBranchId"
                label="Organization Branch"
                InputLabelProps={{ shrink: true }}
                menus={[]}
                allowClear
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFMultiSelectbox name="storeId" label="Select Store" InputLabelProps={{ shrink: true }} menus={storeData} />
            </Grid> */}
            <Grid item md={3} xl={2}>
              <RHFMultiSelectbox name="transactionTypeId" label="Movement Type" InputLabelProps={{ shrink: true }} menus={typeData} />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField name="fromDate" type="date" label="From Date" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField name="toDate" type="date" label="To Date" InputLabelProps={{ shrink: true }} />
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
              title="Document Wise Report"
              data={updateRateValue(data)}
              allData={updateRateValue(allData)}
              count={count}
              setPageIndex={setPageIndex}
              setPageSize={setPageSize}
              pageIndex={pageIndex}
              pageSize={pageSize}
              columns={columns}
              hideActions
            />
          ) : null}
        </MainCard>
      </FormProvider>
    </>
  );
};

export default DocumentWiseReport;
