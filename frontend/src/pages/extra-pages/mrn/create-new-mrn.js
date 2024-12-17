import React, { useState, useMemo } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PropTypes from 'prop-types';
import { Button, Divider, Grid, IconButton, Stack, Tooltip } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  getCompanyStoreLocations,
  getDropdownProjects,
  getMasterMakerLov,
  getOrganizationStores,
  getSerialNumbers,
  getTxnByMaterial
} from '../../../store/actions';
import { PAGINATION_CONST } from '../../../constants';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { useStockLedger } from '../stock-ledger/useStockLedger';
import { useOrganizationStoreLocation } from '../organization-store-location/useOrganizationStoreLocation';
import MaterialInputs from './material-view-inputs';
import { FormProvider, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import TableForm from 'tables/table';
import toast from 'utils/ToastNotistack';
import { fetchTransactionType, valueIsMissingOrNA } from 'utils';
import request from 'utils/request';
import RequestDropdownSection from 'components/sections/RequestDropdownSection';
import Loader from 'components/Loader';
import ApproverRemarks from 'components/ApproverRemarks';
import MaterialSerialNumberModal from 'components/modal/MaterialSerialNumberModal/MaterialSerialNumberModal';

const Actions = ({ values, onEdit, index, onView }) => {
  return (
    <>
      <Tooltip title="Edit" placement="bottom">
        <IconButton color="secondary" onClick={() => onEdit(values, index)}>
          <EditOutlinedIcon />
        </IconButton>
      </Tooltip>
      {values?.material?.isSerialNumber && (
        <Tooltip title="View Serial Number" placement="bottom">
          <IconButton color="secondary" onClick={() => onView(values)}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
};

Actions.propTypes = {
  values: PropTypes.any,
  onEdit: PropTypes.func,
  index: PropTypes.number,
  onView: PropTypes.func
};

const subColumns = [
  {
    Header: 'Actions',
    accessor: 'actions'
  },
  {
    Header: 'Name',
    accessor: 'material.name'
  },
  {
    Header: 'Code',
    accessor: 'material.code'
  },
  {
    Header: 'Quantity',
    accessor: 'approvedQuantity'
  },
  {
    Header: 'UOM',
    accessor: 'uom.name'
  },
  {
    Header: 'From Store Location',
    accessor: 'fromStoreLocationName'
  }
];

const CreateNewMRN = () => {
  const [reqMRRData, setReqMRRData] = useState([]);
  const [reqMRRData2, setReqMRRData2] = useState([]);
  const [maxQuantity, setMaxQuantity] = useState(null);
  const [view, setView] = useState(false);
  const [update, setUpdate] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [pageIndex, setPageIndex] = useState(PAGINATION_CONST.pageIndex);
  const [pageSize, setPageSize] = useState(PAGINATION_CONST.pageSize);
  const [showData, setShowData] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [response, setResponse] = useState();
  const [pending, setPending] = useState(false);
  const [eWayBillNumber, setEwayBillNumber] = useState();
  const [serialNumber, setSerialNumber] = useState(null);
  const [openSerialNumber, setOpenSerialNumber] = useState(false);
  const [rowData, setRowData] = useState(null);

  const navigate = useNavigate();
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project,
        vehicleNumber: Validations.vehicleNumberOptional,
        ...(!valueIsMissingOrNA(eWayBillNumber) && { eWayBillDate: Validations.requiredWithLabel('E-Way Bill Date') })
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue, watch } = methods;

  const dispatch = useDispatch();

  const { txnByMaterial, serialNumbers } = useStockLedger();
  const { serialNumbersData } = useMemo(
    () => ({
      serialNumbersData: serialNumbers?.data || {},
      countSN: serialNumbers?.data?.count || 0
    }),
    [serialNumbers]
  );

  const projectStoreData = useMemo(() => txnByMaterial?.stocksObject || [], [txnByMaterial]);

  useEffect(() => {
    if (!response) return;
    const newResp = structuredClone(response);
    // delete newResp[0].rate;
    // delete newResp[0].tax;
    // delete newResp[0].value;
    newResp && newResp.map((vl) => (vl.value = vl.approvedQuantity * vl.rate));
    newResp && newResp.map((vl) => (vl.fromStoreLocationName = vl.from_store_location?.name));
    setReqMRRData(newResp);
    setReqMRRData2(newResp);
    dispatch(getSerialNumbers({ project: newResp[0]?.projectId, store: newResp[0]?.fromStoreId }));
    dispatch(getTxnByMaterial({ project: newResp[0]?.projectId, store: newResp[0]?.fromStoreId }));
  }, [dispatch, response]);

  const data = response && response[0];
  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        if (fieldName === 'remarks') {
          setValue(fieldName, '');
        } else {
          setValue(fieldName, value);
        }
      });
    };
    if (response && data) {
      handleSetValues(data);
      setValue('supervisorName', data?.contractor_employee?.name);
    }
  }, [response, data, setValue]);

  const { companyStoreLocations } = useOrganizationStoreLocation();
  const { toStoreLocationData } = useMemo(
    () => ({
      toStoreLocationData: companyStoreLocations?.companyStoreLocationsObject?.rows || [] || [],
      isLoading: companyStoreLocations.loading || false
    }),
    [companyStoreLocations]
  );

  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        setValue(fieldName, value);
      });
    };
    const locationsData =
      toStoreLocationData && toStoreLocationData.filter((item) => item.organizationStoreId === reqMRRData[0]?.toStoreId);
    setFilteredLocations(locationsData);
    reqMRRData && handleSetValues(reqMRRData);
  }, [reqMRRData, toStoreLocationData, setValue]);

  const { masterMakerLovs } = useMasterMakerLov();

  const transactionTypeData = masterMakerLovs.masterMakerLovsObject.rows;

  const onBack = () => {
    setShowAdd(!showAdd);
    setView(false);
    setUpdate(false);
    setReqMRRData([]);
    setResponse(null);
  };

  const eWayBillNumberValue = watch('eWayBillNumber');

  useEffect(() => {
    setEwayBillNumber(eWayBillNumberValue);
  }, [eWayBillNumberValue]);

  const handleRowUpdate = (row, ind) => {
    setView(false);
    setUpdate(true);
    const nrow = {
      ...row,
      material_serial_numbers: row?.material_serial_numbers
    };
    setShowData(nrow);
    setMaxQuantity(reqMRRData2[ind].approvedQuantity);
  };

  const handleRowView = (row) => {
    setRowData(row);
    setOpenSerialNumber(true);
    if (!row?.material_serial_numbers) {
      setSerialNumber([]);
    }
  };

  useEffect(() => {
    if (rowData?.material_serial_numbers) {
      setSerialNumber(rowData?.material_serial_numbers);
    }
  }, [rowData]);

  const transactionTypeId = fetchTransactionType(transactionTypeData, 'MRN');

  const getIds = (arr) => {
    const respIds = [];
    arr && arr.length > 0 && arr.map((vl) => respIds.push(vl.id));
    return respIds;
  };
  const makeRequest = (formValues) => {
    const stockLedgerArray = [];
    const rFData = reqMRRData.map((obj) => ({
      ...obj
    }));
    rFData.map((stockData) => {
      if (parseFloat(stockData.approvedQuantity) > 0) {
        const psData = projectStoreData?.find((psItem) => psItem.materialId === stockData.materialId);
        const rate = psData?.rate;
        const tax = psData?.tax;
        const value = parseFloat(stockData.approvedQuantity) * rate;

        stockLedgerArray.push({
          transactionTypeId: transactionTypeId, // company store
          projectId: stockData?.projectId,
          requestNumber: stockData?.referenceDocumentNumber,
          organizationId: stockData?.to_store?.organization?.parentId
            ? stockData?.to_store?.organization?.parentId
            : stockData?.to_store?.organization?.id,
          storeId: stockData?.to_store?.id,
          fromStoreLocationId: stockData?.from_store_location?.id,
          // storeLocationId: reqMRRData[0]?.from_store_location?.id,
          materialId: stockData?.materialId,
          uomId: stockData?.uomId,
          quantity: parseFloat(stockData?.approvedQuantity),
          rate: rate,
          value: value,
          tax: tax,
          // requestApproverId: stockData?.id,
          // approverId: null,
          serialNumber: stockData?.material_serial_numbers
        });
      }
    });
    const stockLedgerDetails = {
      transactionTypeId: transactionTypeId, // MRN
      requestIds: getIds(reqMRRData), // requestDataIds
      requestNumber: reqMRRData[0]?.referenceDocumentNumber,
      fromOrganizationId: reqMRRData[0]?.from_store?.organization?.parentId
        ? reqMRRData[0]?.from_store?.organization?.parentId
        : reqMRRData[0]?.from_store?.organization?.id,
      fromStoreId: reqMRRData[0]?.from_store?.id,
      vehicleNumber: formValues.vehicleNumber,
      eWayBillNumber: formValues.eWayBillNumber,
      eWayBillDate: formValues.eWayBillDate,
      remarks: formValues.remarks,
      ...(formValues.placeOfSupply && { placeOfSupply: formValues.placeOfSupply }),
      stock_ledgers: stockLedgerArray
    };
    return stockLedgerDetails;
  };

  const getMaterials = (value) => {
    const reqData = [];
    reqMRRData.map((val) => {
      if (value.id === val.id) {
        let uomData = val.uom;
        val = value;
        val.uom = uomData;
      }
      reqData.push(val);
    });
    setUpdate(false);
    setReqMRRData(reqData);
  };

  const onFormSubmit = async (values) => {
    setPending(true);

    const req = makeRequest(values);

    if (!req.stock_ledgers || req.stock_ledgers.length === 0) {
      toast('Enter atleast 1 material with some quantity!', { variant: 'error' });
      setPending(false);
      return;
    }
    let serialErrorData = [];
    let serialError = false;
    reqMRRData &&
      reqMRRData.length > 0 &&
      reqMRRData.map((vl) => {
        if (vl.material.isSerialNumber && (!vl.material_serial_numbers || vl.material_serial_numbers.length !== vl.approvedQuantity)) {
          serialErrorData.push(vl.material.name + '-' + vl.material.code);
          serialError = true;
        }
      });
    if (serialErrorData && serialErrorData.length > 0 && serialError) {
      toast(`Please add serial numbers for following materials : ${serialErrorData.toString()}`, { variant: 'error' });
      setPending(false);
      return;
    }

    const resp = await request('/mrn-transaction-create', { method: 'POST', body: req, timeoutOverride: 120000 });

    if (!resp.success) {
      toast(resp?.error?.message || 'Operation failed. Please try again!', { variant: 'error' });
      setPending(false);
      return;
    }

    const refData = resp.data?.data ?? {};
    const referenceDocumentNumber = refData.referenceDocumentNumber || refData[0]?.referenceDocumentNumber;
    const referenceDocNo = resp?.data?.referenceDocNo;

    toast(
      referenceDocumentNumber
        ? `Transaction created with reference number: ${referenceDocumentNumber}`
        : (referenceDocNo && `Transaction created with reference numbers ${referenceDocNo.MRN} and ${referenceDocNo.RETURNMRN}`) ||
            'Transaction created successfully!',
      {
        variant: 'success',
        autoHideDuration: 10000
      }
    );

    setPending(false);
    navigate('/mrn-receipt');
  };

  const txtBox = (name, label, type, req, disable, onChange, shrink = true) => {
    return (
      <Stack spacing={1}>
        <RHFTextField
          name={name}
          type={type}
          label={label}
          InputLabelProps={{ shrink: shrink }}
          disabled={disable}
          {...(typeof onChange === 'function' && { handleChange: onChange })}
          {...(req && { required: true })}
          {...(view ? { disable: true } : update ? { disable: false } : {})}
        />
      </Stack>
    );
  };
  const addActionField = (tableData) => {
    const nResp = tableData.map((val) => {
      const prevSno = JSON.parse(val.serialNumbers);
      const filteredArray = prevSno.filter(
        (vl) => val?.materialId && serialNumbersData[val?.materialId] && serialNumbersData[val?.materialId]?.includes(vl)
      );
      return {
        ...val,
        serialNumbers: JSON.stringify(filteredArray)
      };
    });
    const tbl = nResp.map((obj, index) => ({
      ...obj,
      actions: <Actions values={obj} index={index} onEdit={handleRowUpdate} onView={handleRowView} />
    }));
    return tbl;
  };

  const organizationType = fetchTransactionType(transactionTypeData, 'CONTRACTOR');
  const organizationTypeCompany = fetchTransactionType(transactionTypeData, 'COMPANY');

  useEffect(() => {
    if (!organizationType) return;
    dispatch(getOrganizationStores({ organizationType }));
  }, [dispatch, organizationType]);

  useEffect(() => {
    if (!organizationTypeCompany) return;
    dispatch(getCompanyStoreLocations({ organizationType: organizationTypeCompany }));
  }, [dispatch, organizationTypeCompany]);

  useEffect(() => {
    dispatch(getMasterMakerLov());
    dispatch(getDropdownProjects());
  }, [dispatch]);

  return (
    <>
      {pending && <Loader />}
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={'MRN (Material Return Note)'} sx={{ mb: 2 }}>
          <RequestDropdownSection
            fromStoreLabel="Contractor Store"
            type="request"
            fromStoreType="CONTRACTOR"
            approvedOnly={true}
            transactionType="MRR"
            disableAll={!!response?.length}
            setReqData={setResponse}
          />
          {reqMRRData && reqMRRData.length > 0 && (
            <>
              <Grid container sx={{ mt: 3, mb: 3 }}>
                <Grid item md={12} xl={12}>
                  <Divider />
                </Grid>
              </Grid>
              <Grid container spacing={4} alignItems="center" sx={{ mb: 2 }}>
                {/* <Grid item md={3} xl={2}>
                  {txtBox('project.name', 'Project', 'text', true, true)}
                </Grid> */}
                {/* <Grid item md={3} xl={2}>
                  {txtBox('from_store.organization.name', 'Contractor', 'text', true, true)}
                </Grid> */}
                {/* <Grid item md={3} xl={2}>
                  {txtBox('from_store.name', 'Contractor Store', 'text', true, true)}
                </Grid> */}
                <Grid item md={3} xl={2}>
                  {txtBox('to_store.name', 'Company Store', 'text', true, true)}
                </Grid>
                <Grid item md={3} xl={2}>
                  {txtBox('placeOfSupply', 'Place Of Supply', 'text', false, false)}
                </Grid>
                {/* <Grid item md={3} xl={2}>
                  {txtBox('eWayBillNumber', 'E-Way Bill Number', 'text', false)}
                </Grid>
                <Grid item md={3} xl={2}>
                  {txtBox('eWayBillDate', 'E-Way Bill Date', 'date', false, valueIsMissingOrNA(eWayBillNumber))}
                </Grid> */}
                <Grid item md={3} xl={2}>
                  {txtBox('vehicleNumber', 'Vehicle Number', 'text', false)}
                </Grid>
                <Grid item md={3} xl={2}>
                  {txtBox('supervisorName', 'Supervisor Name', 'text', true, true)}
                </Grid>
                <Grid item md={3} xl={2}>
                  {txtBox('remarks', 'Remarks', 'text', false)}
                </Grid>
                <Grid item md={3} xl={4}>
                  <ApproverRemarks data={reqMRRData} />
                </Grid>
              </Grid>
            </>
          )}
          {reqMRRData && reqMRRData.length > 0 && (
            <>
              {(view || update) && (
                <MaterialInputs
                  toStoreLocationData={filteredLocations}
                  onMaterailsInput={getMaterials}
                  maxQuantity={maxQuantity}
                  view={view}
                  update={update}
                  showData={showData}
                />
              )}
              <TableForm
                title={'MRN'}
                hideHeader
                hidePagination
                data={addActionField(reqMRRData)}
                count={reqMRRData.length}
                columns={subColumns}
                hideActions={true}
                setPageIndex={setPageIndex}
                setPageSize={setPageSize}
                pageIndex={pageIndex}
                pageSize={pageSize}
              />

              {openSerialNumber && rowData && serialNumber && (
                <MaterialSerialNumberModal
                  open={openSerialNumber}
                  onClose={() => {
                    setOpenSerialNumber(false);
                  }}
                  serialNumberData={serialNumber}
                />
              )}
              <Grid item md={12} xl={2} sx={{ mt: 4 }}>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                  <Button onClick={onBack} size="small" variant="outlined" color="primary">
                    Back
                  </Button>

                  <Button disabled={update || pending} size="small" type="submit" variant="contained" color="primary">
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
        </MainCard>
      </FormProvider>
    </>
  );
};

export default CreateNewMRN;
