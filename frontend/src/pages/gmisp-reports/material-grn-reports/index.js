import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useReports } from '../useReports';
import MainCard from 'components/MainCard';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import Validations from 'constants/yupValidations';
import { getDropdownProjects, getMaterialGrnReports, getMaterialTypesForReport } from 'store/actions';
import TableForm from 'tables/table';
import usePagination from 'hooks/usePagination';

const MaterialGrnReport = () => {
  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    setPageSize
  } = usePagination();
  const dispatch = useDispatch();
  const [showTable, setShowTable] = useState(false);
  const [lastArgs, setLastArgs] = useState(null);
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.other,
        materialTypeId: Validations.other
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { watch, setValue, handleSubmit } = methods;

  const materialGrnReportsData = useSelector((state) => state.materialGrnReports);
  const reportsLoading = materialGrnReportsData?.loading;
  const projectOptions = useProjects()?.projectsDropdown?.projectsDropdownObject;
  const materialTypeData = useReports()?.materialTypeForReport?.materialTypeArr;

  useEffect(() => {
    dispatch(getDropdownProjects());
  }, [dispatch]);

  const [projectId, materialTypeId, itemSerialNoFrom, itemSerialNoTo, dateFrom, dateTo] = watch([
    'projectId',
    'materialTypeId',
    'itemSerialNoFrom',
    'itemSerialNoTo',
    'dateFrom',
    'dateTo'
  ]);

  const loadData = useCallback(() => {
    const payLoad = {
      projectId,
      materialTypeId,
      itemSerialNoFrom,
      itemSerialNoTo,
      dateFrom,
      dateTo,
      pageSize,
      pageIndex,
      setData,
      setCount
    };

    if (!projectId?.length || JSON.stringify(payLoad) === JSON.stringify(lastArgs)) return;
    setLastArgs(payLoad);

    dispatch(getMaterialGrnReports(payLoad));
  }, [projectId, materialTypeId, itemSerialNoFrom, itemSerialNoTo, dateFrom, dateTo, pageSize, pageIndex, lastArgs, dispatch]);

  useEffect(() => {
    if (!projectId || !showTable || !materialTypeId) return;
    loadData();
  }, [loadData, materialTypeId, projectId, showTable]);

  const txtBox = (name, label, type, defaultValue, req, shrink = true) => {
    return (
      <RHFTextField
        name={name}
        disabled={false}
        type={type}
        label={label}
        InputLabelProps={{ shrink: shrink }}
        {...(req && { required: true })}
        defaultValue={defaultValue}
      />
    );
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Customer',
        accessor: (row) => row?.stock_ledger?.project?.customer?.name,
        exportAccessor: 'stock_ledger.project.customer.name'
      },
      { Header: 'Project', accessor: (row) => row?.stock_ledger?.project?.name, exportAccessor: 'stock_ledger.project.name' },
      {
        Header: 'Material Type',
        accessor: (row) => row?.stock_ledger?.material?.material_type?.name,
        exportAccessor: 'stock_ledger.material.material_type.name'
      },
      { Header: 'Material Name', accessor: (row) => row?.stock_ledger?.material?.name, exportAccessor: 'stock_ledger.material.name' },
      { Header: 'Material Code', accessor: (row) => row?.stock_ledger?.material?.code, exportAccessor: 'stock_ledger.material.code' },
      { Header: 'HSN Code', accessor: (row) => row?.stock_ledger?.material?.hsnCode, exportAccessor: 'stock_ledger.material.hsnCode' },
      {
        Header: 'GRN Number',
        accessor: (row) => row?.stock_ledger?.referenceDocumentNumber,
        exportAccessor: 'stock_ledger.referenceDocumentNumber'
      },
      { Header: 'GRN Date', accessor: (row) => row?.stock_ledger?.createdAt, exportAccessor: 'stock_ledger.createdAt' },
      { Header: 'Material Serial No.', accessor: (row) => row?.serialNumber, exportAccessor: 'serialNumber' },
      {
        Header: 'Receiving Store',
        accessor: (row) => row?.stock_ledger?.organization_store.name,
        exportAccessor: 'stock_ledger.organization_store.name'
      },
      {
        Header: 'To Store Location',
        accessor: (row) => row?.stock_ledger?.organization_store_location.name,
        exportAccessor: 'stock_ledger.organization_store_location.name'
      },
      {
        Header: 'Invoice/Challan No.',
        accessor: (row) => row?.stock_ledger?.stock_ledger_detail?.invoiceNumber,
        exportAccessor: 'stock_ledger.stock_ledger_detail.invoiceNumber'
      },
      {
        Header: 'Invoice/Challan Date',
        accessor: (row) => row?.stock_ledger?.stock_ledger_detail?.ButtoninvoiceDate,
        exportAccessor: 'stock_ledger.stock_ledger_detail.ButtoninvoiceDate'
      },
      {
        Header: 'Actual Receipt Date',
        accessor: (row) => row?.stock_ledger?.stock_ledger_detail?.actualReceiptDate,
        exportAccessor: 'stock_ledger.stock_ledger_detail.actualReceiptDate'
      },
      {
        Header: 'Transporter Name',
        accessor: (row) => row?.stock_ledger?.stock_ledger_detail?.transporterName,
        exportAccessor: 'stock_ledger.stock_ledger_detail.transporterName'
      },
      {
        Header: 'Contact Number',
        accessor: (row) => row?.stock_ledger?.stock_ledger_detail?.transporterContactNumber,
        exportAccessor: 'stock_ledger.stock_ledger_detail.transporterContactNumber'
      },
      {
        Header: 'Vehicle Number',
        accessor: (row) => row?.stock_ledger?.stock_ledger_detail?.vehicleNumber,
        exportAccessor: 'stock_ledger.stock_ledger_detail.vehicleNumber'
      },
      {
        Header: 'LR Number',
        accessor: (row) => row?.stock_ledger?.stock_ledger_detail?.lrNumber,
        exportAccessor: 'stock_ledger.stock_ledger_detail.lrNumber'
      },
      {
        Header: 'E-Way Bill Number',
        accessor: (row) => row?.stock_ledger?.stock_ledger_detail?.eWayBillNumber,
        exportAccessor: 'stock_ledger.stock_ledger_detail.eWayBillNumber'
      },
      {
        Header: 'E-Way Bill Date',
        accessor: (row) => row?.stock_ledger?.stock_ledger_detail?.eWayBillDate,
        exportAccessor: 'stock_ledger.stock_ledger_detail.eWayBillDate'
      },
      {
        Header: 'Expiry Date',
        accessor: (row) => row?.stock_ledger?.stock_ledger_detail?.expiryDate,
        exportAccessor: 'stock_ledger.stock_ledger_detail.expiryDate'
      }
    ],
    []
  );

  useEffect(() => {
    if (projectId) {
      dispatch(getMaterialTypesForReport({ projectId: projectId }));
    }
  }, [dispatch, projectId]);

  return (
    <>
      <FormProvider
        methods={methods}
        onSubmit={handleSubmit(() => {
          setShowTable(true);
        })}
      >
        <MainCard title={'Material GRN Report'} sx={{ mb: 2 }}>
          <Grid container spacing={4} mb={3}>
            <Grid item md={3} xl={3}>
              <RHFSelectbox
                name="projectId"
                label="Project"
                menus={projectOptions || []}
                required
                onChange={() => {
                  setValue('materialTypeId', '');
                  setData([]);
                  setShowTable(false);
                }}
              />
            </Grid>
            <Grid item md={3} xl={3}>
              <RHFSelectbox
                name="materialTypeId"
                label="Material Type"
                menus={materialTypeData}
                required
                onChange={() => {
                  setData([]);
                  setShowTable(false);
                }}
              />
            </Grid>
            <Grid item md={3} xl={3}>
              {txtBox('itemSerialNoFrom', 'Item Serial No From', 'text')}
            </Grid>
            <Grid item md={3} xl={3}>
              {txtBox('itemSerialNoTo', 'Item Serial No To', 'text')}
            </Grid>
            <Grid item md={3} xl={3}>
              {txtBox('dateFrom', 'Date From', 'date')}
            </Grid>
            <Grid item md={3} xl={3}>
              {txtBox('dateTo', 'Date To', 'date')}
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
          title="Material GRN Report"
          loadingCondition={reportsLoading}
          hideActions
          hideAddButton
          data={data}
          count={count}
          columns={columns}
          pageIndex={pageIndex}
          pageSize={pageSize}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          exportConfig={{
            tableName: 'material-grn-report',
            apiQuery: { projectId, materialTypeId, itemSerialNoFrom, itemSerialNoTo, dateFrom, dateTo }
          }}
        />
      )}
    </>
  );
};

export default MaterialGrnReport;
