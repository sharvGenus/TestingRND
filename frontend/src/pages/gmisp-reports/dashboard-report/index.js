import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Grid, Button } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useReports } from '../delivery-challan-report/useReport';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import {
  getDeliveryReports,
  getDropdownMaterial,
  getDropdownProjects,
  getFirmStoreLocations,
  getMasterMakerLov,
  getOrganizationStores,
  getOrganizationStoresSecond
} from 'store/actions';
import { fetchTransactionType } from 'utils';
import TableForm from 'tables/table';
import usePagination from 'hooks/usePagination';
import { useMasterMakerLov } from 'pages/extra-pages/master-maker-lov/useMasterMakerLov';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import { useOrganizationStore } from 'pages/extra-pages/organization-store/useOrganizationStore';
import { useOrganizationStoreLocation } from 'pages/extra-pages/organization-store-location/useOrganizationStoreLocation';
import { useMaterial } from 'pages/extra-pages/material/useMaterial';

const DashboardReport = () => {
  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    setPageSize
  } = usePagination();
  const [eWayBillQty, setEWayBillQty] = useState(0);
  const [newData, setNewData] = useState([]);
  const [totalChallanValue, setTotalChallanValue] = useState(0);
  const [showTable, setShowTable] = useState(false);
  const dispatch = useDispatch();
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project,
        storeId: Validations.store,
        fromDate: Validations.fromDate,
        toDate: Validations.toDate,
        trxnType: Validations.transaction
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit } = methods;

  const { projectsDropdown } = useProjects();
  const { masterMakerLovs } = useMasterMakerLov();
  const { materialDropdown } = useMaterial();
  const { organizationStores, organizationStoresSecond } = useOrganizationStore();
  const { firmStoreLocations } = useOrganizationStoreLocation();

  const projectData = projectsDropdown?.projectsDropdownObject;
  const materalData = materialDropdown?.materialDropdownObject;
  const orgTypeData = masterMakerLovs.masterMakerLovsObject?.rows;
  const companyData = organizationStores?.organizationStoreObject?.rows;
  const firmData = organizationStoresSecond?.organizationStoreObject?.rows;
  const organizationStoreLocation = firmStoreLocations?.firmStoreLocationsObject?.rows;

  const { deliveryReports } = useReports();
  const { data, count } = useMemo(
    () => ({
      data: deliveryReports.deliveryReportsObject?.rows || [],
      count: deliveryReports.deliveryReportsObject?.count || 0,
      isLoading: deliveryReports.loading || false
    }),
    [deliveryReports]
  );
  useEffect(() => {
    if (data) {
      const newQuantity = data.map((x) => {
        let totalQty = 0;
        x?.stock_ledgers.map((y) => (totalQty += y.quantity < 0 ? -y.quantity : y.quantity));
        return totalQty;
      });
      setEWayBillQty(...newQuantity);
      const newValue = data.map((x) => {
        let totalValue = 0;
        x?.stock_ledgers.map((y) => (totalValue += y.value));
        return totalValue;
      });
      setTotalChallanValue(...newValue);
      setNewData(structuredClone(data));
    }
  }, [data]);
  newData.map((x) => {
    (x.eWayBillQty = eWayBillQty), (x.totalChallanValue = totalChallanValue);
  });
  const columns = useMemo(
    () => [
      {
        Header: 'MIV No',
        accessor: 'referenceDocumentNumber'
      },
      {
        Header: 'Date',
        accessor: 'createdAt'
      },
      {
        Header: 'Name of Contractors',
        accessor: 'stock_ledgers[2].organization_store.name'
      },
      {
        Header: 'E-Way Bill No',
        accessor: 'eWayBillNumber'
      },
      {
        Header: 'E-Way Bill Qty',
        accessor: 'eWayBillQty'
      },
      {
        Header: 'Total Value of Challan ',
        accessor: 'totalChallanValue'
      },
      {
        Header: 'MatMovementType',
        accessor: 'stock_ledgers[1].transaction_type.name'
      },
      {
        Header: 'ReferenceDocNo',
        accessor: 'ReferenceDocNo'
      }
    ],
    []
  );

  const onFormSubmit = async (formValues) => {
    formValues['pageSize'] = pageSize;
    formValues['pageIndex'] = pageIndex;
    dispatch(getDeliveryReports(formValues));
    setShowTable(!showTable);
  };

  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getMasterMakerLov());
    dispatch(getDropdownMaterial());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getOrganizationStores({ organizationType: fetchTransactionType(orgTypeData, 'COMPANY') }));
    dispatch(getOrganizationStoresSecond({ organizationType: fetchTransactionType(orgTypeData, 'CONTRACTOR') }));
    dispatch(getFirmStoreLocations({ organizationType: fetchTransactionType(orgTypeData, 'CONTRACTOR') }));
  }, [dispatch, orgTypeData]);

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={'DashBoard Report'} sx={{ mb: 2 }}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              <RHFSelectbox name="fromStoreId" label="From Store" InputLabelProps={{ shrink: true }} menus={companyData} required />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox name="toStoreId" label="Receiving Store" InputLabelProps={{ shrink: true }} menus={firmData} required />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox name="materialId" label="Material" InputLabelProps={{ shrink: true }} menus={materalData} required />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                name="storeLocationId"
                label="Storage Location"
                InputLabelProps={{ shrink: true }}
                menus={organizationStoreLocation}
                required
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox name="projectId" label="Project" InputLabelProps={{ shrink: true }} menus={projectData} required />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField name="fromDate" type="date" label="From Date" InputLabelProps={{ shrink: true }} required />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField name="toDate" type="date" label="To Date" InputLabelProps={{ shrink: true }} required />
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
              title="DashBoard Report"
              data={newData}
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

export default DashboardReport;
