import React, { useState, useMemo } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PropTypes from 'prop-types';
import { Button, Divider, Grid, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getCompanyStoreLocations, getDropdownProjects, getMasterMakerLov } from '../../../store/actions';
import { PAGINATION_CONST } from '../../../constants';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { useOrganizationStoreLocation } from '../organization-store-location/useOrganizationStoreLocation';
import MaterialInputs from './material-view-inputs';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import TableForm from 'tables/table';
import toast from 'utils/ToastNotistack';
import { fetchTransactionType, isMissingStoreLocation, valueIsMissingOrNA } from 'utils';
import request from 'utils/request';
import RequestDropdownSection from 'components/sections/RequestDropdownSection';
import Loader from 'components/Loader';
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
    accessor: 'quantity'
  },
  {
    Header: 'UOM',
    accessor: 'uom.name'
  },
  {
    Header: 'To Store Location',
    accessor: 'toLocation.name'
  }
];

const CreateNewReturnMRN = () => {
  const [reqMRNData, setReqMRNData] = useState([]);
  const [reqMRNData2, setReqMRNData2] = useState([]);
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
  const [acceptRejectError, setAcceptRejectError] = useState('');

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

  useEffect(() => {
    if (!response) return;
    const newResp = structuredClone(response);
    newResp && newResp.map((vl) => (vl.quantity = vl.quantity < 0 ? -vl.quantity : vl.quantity));
    setReqMRNData(newResp);
    setReqMRNData2(newResp);
  }, [response]);

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
    const getOrgDetail = (obj, key) => {
      let resp = null;
      if (obj && obj?.organization) {
        if (obj?.organization?.parentId && obj?.organization?.parentId !== null) {
          resp = key === 'name' ? obj?.organization?.parent?.name : obj?.organization?.parentId;
        } else resp = key === 'name' ? obj?.organization?.name : obj?.organization?.id;
      }
      return resp;
    };
    if (response && data) {
      handleSetValues(data);
      setValue('supervisorName', data?.contractor_employee?.name);
      setValue('contractorName', getOrgDetail(data?.organization_store, 'name'));
      setValue('vehicleNumber', data?.stock_ledger_detail?.vehicleNumber);
    }
  }, [response, data, setValue]);

  const { companyStoreLocations } = useOrganizationStoreLocation();
  const { toStoreLocationData } = useMemo(
    () => ({
      toStoreLocationData: companyStoreLocations?.companyStoreLocationsObject?.rows || [],
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
      toStoreLocationData && toStoreLocationData.filter((item) => item.organizationStoreId === reqMRNData[0]?.other_store?.id);
    setFilteredLocations(locationsData);
    reqMRNData && handleSetValues(reqMRNData);
  }, [reqMRNData, toStoreLocationData, setValue]);

  const { masterMakerLovs } = useMasterMakerLov();

  const transactionTypeData = masterMakerLovs.masterMakerLovsObject.rows;

  const onBack = () => {
    setShowAdd(!showAdd);
    setView(false);
    setUpdate(false);
    setReqMRNData([]);
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
    setMaxQuantity(reqMRNData2[ind].quantity);
  };

  const handleRowView = (row) => {
    setRowData(row);
    setOpenSerialNumber(true);
    if (!row?.material_serial_numbers) {
      setSerialNumber([]);
    }
  };

  const getSerials = (arr) => {
    let newArr = [];
    arr &&
      arr.length > 0 &&
      arr.map((val) => {
        newArr.push(typeof val === 'object' ? val.serialNumber : val);
      });
    return newArr;
  };

  useEffect(() => {
    if (rowData?.material_serial_numbers) {
      let serialNumbers = getSerials(rowData?.material_serial_numbers);
      setSerialNumber(serialNumbers);
    }
  }, [rowData]);

  const transactionTypeId = fetchTransactionType(transactionTypeData, 'RETURNMRN');
  const transactionCancelMRNTypeId = fetchTransactionType(transactionTypeData, 'CANCELMRN');

  const getIds = (arr) => {
    const respIds = [];
    arr && arr.length > 0 && arr.map((vl) => respIds.push(vl.id));
    return respIds;
  };

  const makeRequest = (formValues) => {
    const stockLedgerArray = [];
    const rFData = reqMRNData.map((obj) => ({
      ...obj
    }));
    rFData.map((stockData) => {
      if (parseFloat(stockData.quantity) > 0) {
        stockLedgerArray.push({
          transactionTypeId: transactionTypeId, // company store
          projectId: stockData?.projectId,
          requestNumber: stockData?.referenceDocumentNumber, // mrn ref no
          organizationId:
            stockData?.other_store?.organization?.parentId && stockData?.other_store?.organization?.parentId !== null
              ? stockData?.other_store?.organization?.parentId
              : stockData?.other_store?.organization?.id,
          storeId: stockData?.other_store?.id,
          storeLocationId: stockData?.toStoreLocationId,
          fromStoreLocationId: stockData?.storeLocationId,
          materialId: stockData?.materialId,
          uomId: stockData?.uomId,
          quantity: parseFloat(stockData?.quantity),
          rate: stockData?.rate,
          value: stockData?.value,
          tax: stockData?.tax,
          serialNumber: getSerials(stockData?.material_serial_numbers)
        });
      }
    });
    const stockLedgerDetails = {
      transactionTypeId: transactionTypeId,
      requestNumber: reqMRNData[0]?.referenceDocumentNumber, // mrn ref no
      mrnIds: getIds(reqMRNData),
      fromStoreId: reqMRNData[0]?.storeId,
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
    reqMRNData.map((val) => {
      if (value.id === val.id) {
        let uomData = val.uom;
        val = value;
        val.uom = uomData;
      }
      reqData.push(val);
    });
    setUpdate(false);
    setReqMRNData(reqData);
  };

  const cancelReqData = (formValues) => {
    const stockArray = [];
    formValues.map((val) => {
      stockArray.push({
        transactionTypeId: transactionCancelMRNTypeId,
        organizationId: val.organizationId,
        projectId: val.projectId,
        requestNumber: val.referenceDocumentNumber,
        storeId: val.storeId,
        storeLocationId: val.storeLocationId,
        otherStoreId: val.otherStoreId,
        otherStoreLocationId: val.otherStoreLocationId,
        materialId: val.materialId,
        uomId: val.uomId,
        quantity: val.quantity,
        rate: val.rate,
        value: val.value,
        tax: val.tax,
        serialNumber: getSerials(val.material_serial_numbers) || []
      });
    });
    return {
      transactionTypeId: transactionCancelMRNTypeId,
      mrnLedgerIds: getIds(reqMRNData),
      mrnLedgerDetailId: reqMRNData[0]?.stock_ledger_detail?.id,
      stock_ledgers: stockArray
    };
  };

  const onFormSubmit = async (values) => {
    setPending(true);

    const req = makeRequest(values);

    if (!req.stock_ledgers || req.stock_ledgers.length === 0) {
      toast('Enter atleast 1 material with some quantity!', { variant: 'error' });
      setPending(false);
      return;
    }

    if (values.accept === 'yes' && isMissingStoreLocation(req.stock_ledgers, 'storeLocationId')) {
      setPending(false);
      return;
    }

    if (values.accept === '') {
      setAcceptRejectError('Accept/Reject is required');
      setPending(false);
      return;
    } else {
      setAcceptRejectError('');
    }

    if (values.accept === 'yes') {
      const resp = await request('/returnmrn-transaction-create', { method: 'POST', body: req, timeoutOverride: 120000 });

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
      navigate('/return-mrn-receipt');
    } else {
      let cancelReq = cancelReqData(reqMRNData);
      const resp = await request('/cancel-mrn', { method: 'POST', body: cancelReq, timeoutOverride: 120000 });

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
      navigate('/stock-ledger');
    }
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
      if (val && val.serialNumbers) {
        return {
          ...val,
          serialNumbers: JSON.stringify(val.serialNumbers)
        };
      } else {
        return { ...val };
      }
    });
    const tbl = nResp.map((obj, index) => ({
      ...obj,
      actions: <Actions values={obj} index={index} onEdit={handleRowUpdate} onView={handleRowView} />
    }));
    return tbl;
  };

  const organizationTypeCompany = fetchTransactionType(transactionTypeData, 'COMPANY');

  useEffect(() => {
    if (!organizationTypeCompany) return;
    dispatch(getCompanyStoreLocations({ organizationType: organizationTypeCompany }));
  }, [dispatch, organizationTypeCompany]);

  useEffect(() => {
    dispatch(getMasterMakerLov());
    dispatch(getDropdownProjects());
  }, [dispatch]);

  const acceptRejectData = [
    {
      id: 'yes',
      name: 'Accept'
    },
    {
      id: 'no',
      name: 'Reject'
    }
  ];

  return (
    <>
      {pending && <Loader />}
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={'Return MRN (Return Material Return Note)'} sx={{ mb: 2 }}>
          <RequestDropdownSection
            fromStoreLabel="Company Store"
            type="stockLedger"
            fromStoreType="COMPANY"
            approvedOnly={true}
            transactionType="MRN"
            disableAll={!!response?.length}
            setReqData={setResponse}
            getFromOtherStore
            withSerial
          />
          {reqMRNData && reqMRNData.length > 0 && (
            <>
              <Grid container sx={{ mt: 3, mb: 3 }}>
                <Grid item md={12} xl={12}>
                  <Divider />
                </Grid>
              </Grid>
              <Grid container spacing={4} alignItems="center" sx={{ mb: 2 }}>
                <Grid item md={3} xl={2}>
                  {txtBox('contractorName', 'Contractor', 'text', false, true)}
                </Grid>
                {/* <Grid item md={3} xl={2}>
                  {txtBox('contractorStoreName', 'Contractor Store', 'text', true, true)}
                </Grid> */}
                <Grid item md={3} xl={2}>
                  {txtBox('eWayBillNumber', 'E-Way Bill Number', 'text', false)}
                </Grid>
                <Grid item md={3} xl={2}>
                  {txtBox('eWayBillDate', 'E-Way Bill Date', 'date', false, valueIsMissingOrNA(eWayBillNumber))}
                </Grid>
                <Grid item md={3} xl={2}>
                  {txtBox('vehicleNumber', 'Vehicle Number', 'text', false)}
                </Grid>
                <Grid item xs={12} md={6} xl={6}>
                  {txtBox('remarks', 'Remarks', 'text', false)}
                </Grid>
              </Grid>
            </>
          )}
          {reqMRNData && reqMRNData.length > 0 && (
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
                data={addActionField(reqMRNData)}
                count={reqMRNData.length}
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
                <Grid container sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                  <Grid item xs={2.5} sm={1.2} lg={0.65} sx={{ mt: 4.5 }}>
                    <Button onClick={onBack} size="small" variant="outlined" color="primary">
                      Back
                    </Button>
                  </Grid>
                  <Grid item xs={4.2} sm={2.2} lg={1.5}>
                    <RHFSelectbox
                      name={'accept'}
                      label={'Accept/Reject'}
                      // onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      menus={acceptRejectData}
                      required={true}
                    />
                    {acceptRejectError && acceptRejectError !== '' && (
                      <>
                        <br />
                        <Typography color={'error'} sx={{ fontSize: 12, marginTop: 2 }}>
                          {acceptRejectError}
                        </Typography>
                      </>
                    )}
                  </Grid>
                  <Grid item xs={2} sm={2} lg={0.7} sx={{ mt: 4.5 }}>
                    <Button disabled={update || pending} size="small" type="submit" variant="contained" color="primary">
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}
        </MainCard>
      </FormProvider>
    </>
  );
};

export default CreateNewReturnMRN;
