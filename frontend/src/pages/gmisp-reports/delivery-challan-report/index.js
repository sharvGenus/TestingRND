import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Grid, Button } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useReports } from './useReport';
import { FormProvider, RHFRadio, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import { getDeliveryReports, getDropdownProjects, getLovsForMasterName, getMasterMakerLov, getOrganizationStores } from 'store/actions';
import { fetchTransactionType } from 'utils';
import usePagination from 'hooks/usePagination';
import TableForm from 'tables/table';
import { useMasterMakerLov } from 'pages/extra-pages/master-maker-lov/useMasterMakerLov';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import { useOrganizationStore } from 'pages/extra-pages/organization-store/useOrganizationStore';

const DeliveryChallanReport = () => {
  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    setPageSize
  } = usePagination();
  const [trxnType, setTrxnType] = useState('');
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
  const { organizationStores } = useOrganizationStore();

  const projectData = projectsDropdown?.projectsDropdownObject;
  const orgTypeData = masterMakerLovs.masterMakerLovsObject?.rows;
  const storeData = organizationStores?.organizationStoreObject?.rows;
  const typeData = [
    {
      value: 'MIN',
      name: 'MIN'
    },
    {
      value: 'MRN',
      name: 'MRN'
    },
    {
      value: 'STO',
      name: 'STO'
    },
    {
      value: 'PTP',
      name: 'PTP'
    }
  ];
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
        Header: 'Total Qty',
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
  useEffect(() => {
    dispatch(getLovsForMasterName('TRANSACTION TYPE'));
  }, [dispatch]);
  const {
    masterMakerOrgType: { masterObject: transactionTypeData }
  } = useMasterMakerLov();
  const transactionTypeId = fetchTransactionType(transactionTypeData, trxnType);
  const onRadioSelected = (e) => {
    setTrxnType(e.target.value);
  };

  const onFormSubmit = async (formValues) => {
    formValues['transactionTypeId'] = transactionTypeId;
    formValues['pageSize'] = pageSize;
    formValues['pageIndex'] = pageIndex;
    delete formValues['trxnType'];
    dispatch(getDeliveryReports(formValues));
    setShowTable(!showTable);
  };

  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getMasterMakerLov());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getOrganizationStores({ organizationType: fetchTransactionType(orgTypeData, 'COMPANY') }));
  }, [dispatch, orgTypeData]);

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={'Delivery Challan Report'} sx={{ mb: 2 }}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              <RHFSelectbox name="projectId" label="Project" InputLabelProps={{ shrink: true }} menus={projectData} required />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox name="storeId" label="Select Store" InputLabelProps={{ shrink: true }} menus={storeData} required />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField name="fromDate" type="date" label="From Date" InputLabelProps={{ shrink: true }} required />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFTextField name="toDate" type="date" label="To Date" InputLabelProps={{ shrink: true }} required />
            </Grid>
            <Grid item md={6} sx={{ width: '10%' }}>
              <RHFRadio name="trxnType" title="" mini labels={typeData} onChange={onRadioSelected} />
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
              title="Delivery Challan Report"
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

export default DeliveryChallanReport;
