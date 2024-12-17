/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Grid, Button } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useProjects } from '../../extra-pages/project/useProjects';
import { useOrganizationStore } from '../../extra-pages/organization-store/useOrganizationStore';
import { FormProvider, RHFSelectbox } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import {
  getDropdownOrganization,
  getDropdownOrganizationSecond,
  getDropdownProjects,
  getDropdownOrganizationStores,
  getOrganizationsLocationByParent,
  getStoreStockReport
} from 'store/actions';
import { concateNameAndCode, formatTimeStamp } from 'utils';
import TableForm from 'tables/table';
import usePagination from 'hooks/usePagination';
import { useOrganizations } from 'pages/extra-pages/organization/useOrganizations';
import SavePdf from 'components/SavePdf';
import { useStockLedger } from 'pages/extra-pages/stock-ledger/useStockLedger';

const StockReport = () => {
  const [showTable, setShowTable] = useState(false);
  const [storeAddress, setStoreAddress] = useState('');
  const [orgId, setOrgId] = useState(null);
  const {
    paginations: { pageSize, pageIndex },
    setPageIndex,
    setPageSize
  } = usePagination();
  const dispatch = useDispatch();
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project,
        organizationId: Validations.organizationId,
        storeId: Validations.store
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue } = methods;

  const { projectsDropdown } = useProjects();
  const { organizationStoresDropdown } = useOrganizationStore();
  const { organizationsDropdown, organizationsDropdownSecond, organizationsLocByParent } = useOrganizations();

  const organizationBranchData = organizationsLocByParent?.organizationObject?.rows;

  const projectData = projectsDropdown?.projectsDropdownObject;
  const storeData = organizationStoresDropdown?.organizationStoreDropdownObject?.rows || [];
  const organizationsData1 = organizationsDropdown?.organizationDropdownObject || [];
  const organizationsData2 = organizationsDropdownSecond?.organizationDropdownSecondObject || [];
  const organizationsData = [...organizationsData1, ...organizationsData2];

  const { storeStockReport } = useStockLedger();
  const { data } = useMemo(
    () => ({
      data: storeStockReport.stocksObject || [],
      isLoading: storeStockReport.loading || false
    }),
    [storeStockReport]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Sr No.',
        accessor: 'sno'
      },
      {
        Header: 'Material code',
        accessor: 'material.code'
      },
      {
        Header: 'Material Description',
        accessor: 'material.name'
      },
      {
        Header: 'UOM',
        accessor: 'uom.name'
      },
      {
        Header: 'Qty',
        accessor: 'quantity'
      },
      {
        Header: 'Location',
        accessor: 'storeLocation.name'
      },
      {
        Header: 'Basic Price',
        accessor: 'rate'
      },
      {
        Header: 'Total Value',
        accessor: 'value'
      }
    ],
    []
  );
  const onFormSubmit = async (formValues) => {
    dispatch(getStoreStockReport({ project: formValues.projectId, store: formValues.storeId }));
    setShowTable(true);
  };

  useEffect(() => {
    dispatch(getDropdownProjects());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDropdownOrganization('420e7b13-25fd-4d23-9959-af1c07c7e94b'));
    dispatch(getDropdownOrganizationSecond({ organizationTypeId: 'decb6c57-6d85-4f83-9cc2-50e0630003df' }));
  }, [dispatch]);

  const onOrgSelected = (e) => {
    if (e?.target?.value) {
      let selectedData = e?.target?.row;
      setOrgId(e?.target?.value);
      dispatch(getOrganizationsLocationByParent({ params: selectedData?.organization_type?.id + '/' + e?.target?.value }));
      dispatch(getDropdownOrganizationStores(selectedData?.organization_type?.id));
      setShowTable(false);
      setValue('organizationBranchId', null);
      setValue('storeId', null);
    }
  };

  const onOrgBranchSelected = (e) => {
    if (e?.target?.value) {
      let selectedData = e?.target?.row;
      setOrgId(e?.target?.value);
      dispatch(getDropdownOrganizationStores(selectedData?.organization_type?.id));
      setShowTable(false);
      setValue('storeId', null);
    }
  };

  const onStoreSelected = (e) => {
    if (e?.target?.value) {
      let storeDetails = e?.target?.row;
      const cityDetails = storeDetails.cities ? storeDetails.cities : storeDetails.city;
      const addressdata = storeDetails.registeredOfficeAddress ? storeDetails.registeredOfficeAddress : storeDetails.address;
      const pincode = storeDetails.registeredOfficePincode
        ? storeDetails.registeredOfficePincode
        : storeDetails.pinCode
        ? storeDetails.pinCode
        : storeDetails.pincode;
      setStoreAddress(`${addressdata}, ${cityDetails.name}, ${cityDetails.state.name}, ${cityDetails.state.country.name}, ${pincode}`);
      setShowTable(false);
    }
  };

  const extraDetails = {
    heading: 'Genus Power Infrastructures Limited',
    subHead1: 'Store Address',
    subCont1: storeAddress,
    subHead2: 'Date & Time',
    subCont2: formatTimeStamp(new Date()),
    subSign1: 'Store In Charge Signature',
    subSign2: 'Project Manager Signature'
  };

  const exportPdf = () => {
    const head = [];
    const body = [];
    columns.map((val) => {
      head.push(val.Header);
    });
    data &&
      data.map((nval, ind) => {
        body.push([
          ind + 1,
          nval?.material?.code,
          nval?.material?.name,
          nval?.uom?.name,
          nval?.quantity,
          nval?.storeLocation?.name,
          nval?.rate?.toFixed(2),
          nval?.value?.toFixed(2)
        ]);
      });
    SavePdf('Stock-Report', [head], body, extraDetails);
  };

  const addSNo = (arr) => {
    return arr.map((vl, ind) => {
      return { ...vl, sno: ind + 1, rate: vl?.rate?.toFixed(2), value: vl?.value?.toFixed(2) };
    });
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={'Stock Report'} sx={{ mb: 2 }}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                name="projectId"
                label="Project"
                InputLabelProps={{ shrink: true }}
                menus={projectData}
                onChange={() => {
                  setShowTable(false);
                  setValue('organizationId', null);
                  setValue('organizationBranchId', null);
                  setValue('storeId', null);
                }}
                required
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                name="organizationId"
                label="Organization"
                InputLabelProps={{ shrink: true }}
                menus={concateNameAndCode(organizationsData)}
                onChange={onOrgSelected}
                required
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                name="organizationBranchId"
                label="Organization Branch"
                InputLabelProps={{ shrink: true }}
                menus={concateNameAndCode(organizationBranchData)}
                onChange={onOrgBranchSelected}
              />
            </Grid>
            <Grid item md={3} xl={2}>
              <RHFSelectbox
                name="storeId"
                label="Store"
                InputLabelProps={{ shrink: true }}
                menus={storeData.filter((vl) => vl.organizationId === orgId)}
                onChange={onStoreSelected}
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
            <>
              <Grid container spacing={4} mb={5}>
                <Grid item md={12} xl={12} sx={{ textAlign: 'center' }}>
                  <h2 style={{ marginBottom: -15 }}>Genus Power Infrastructures Limited</h2>
                </Grid>
                <Grid item md={6} xl={6} sx={{ textAlign: 'center' }}>
                  <h3 style={{ marginBottom: -15 }}>Store Address</h3>
                  <br />
                  {storeAddress}
                </Grid>
                <Grid item md={6} xl={6} sx={{ textAlign: 'center' }}>
                  <h3 style={{ marginBottom: -15 }}>Date & Time</h3>
                  <br />
                  {formatTimeStamp(new Date())}
                </Grid>
              </Grid>
              <TableForm
                title=" "
                data={addSNo(data)}
                hideActions
                hideAddButton
                hidePagination
                accessTableOnly
                exportPDFOnly={true}
                exportToPdf={exportPdf}
                count={data.length}
                setPageIndex={setPageIndex}
                setPageSize={setPageSize}
                pageIndex={pageIndex}
                pageSize={pageSize}
                columns={columns}
              />
              <Grid container spacing={4} mt={5} mb={5}>
                <Grid item md={6} xl={6} sx={{ textAlign: 'center' }}>
                  <h3 style={{ marginBottom: -15 }}>Store In Charge Signature</h3>
                </Grid>
                <Grid item md={6} xl={6} sx={{ textAlign: 'center' }}>
                  <h3 style={{ marginBottom: -15 }}>Project Manager Signature</h3>
                </Grid>
              </Grid>
            </>
          ) : null}
        </MainCard>
      </FormProvider>
    </>
  );
};

export default StockReport;
