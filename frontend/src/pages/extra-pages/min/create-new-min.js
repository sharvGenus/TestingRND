import React, { useState, useMemo } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PropTypes from 'prop-types';
import { Button, Divider, Grid, IconButton, Tooltip } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router';
import { getCompanyStoreLocations, getDropdownProjects, getMasterMakerLov, getOrganizationStores } from '../../../store/actions';
import { PAGINATION_CONST } from '../../../constants';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { useOrganizationStoreLocation } from '../organization-store-location/useOrganizationStoreLocation';
import MaterialInputs from './material-view-inputs';
import { FormProvider, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import TableForm from 'tables/table';
import toast from 'utils/ToastNotistack';
import { isMissingStoreLocation, valueIsMissingOrNA } from 'utils';
import RequestDropdownSection from 'components/sections/RequestDropdownSection';
import request from 'utils/request';
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
    Header: 'Qty In Stock',
    accessor: 'qtyInStock'
  },
  {
    Header: 'UOM',
    accessor: 'uom.name'
  },
  {
    Header: 'From Store Location',
    accessor: 'fromStoreLocation.name'
  }
];

const CreateNewMIN = () => {
  const [reqMRFData, setReqMRFData] = useState([]);
  const [reqMRFData2, setReqMRFData2] = useState([]);
  const [maxQuantity, setMaxQuantity] = useState(null);
  const [view, setView] = useState(false);
  const [update, setUpdate] = useState(false);
  const [pageIndex, setPageIndex] = useState(PAGINATION_CONST.pageIndex);
  const [pageSize, setPageSize] = useState(PAGINATION_CONST.pageSize);
  const [selectedData, setSelectedData] = useState(false);
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
        poNumber: Validations.workOrderNumber,
        vehicleNumber: Validations.vehicleNumberOptional,
        ...(!valueIsMissingOrNA(eWayBillNumber) && { eWayBillDate: Validations.requiredWithLabel('E-Way Bill Date') })
      })
    ),
    defaultValues: {},
    mode: 'all'
  });
  const dispatch = useDispatch();

  const { handleSubmit, setValue, watch } = methods;

  const data = response && response[0];
  const { companyStoreLocations } = useOrganizationStoreLocation();

  const { companyStoreLocationData } = useMemo(
    () => ({
      companyStoreLocationData: companyStoreLocations.companyStoreLocationsObject?.rows || [],
      isLoading: companyStoreLocations.loading || false
    }),
    [companyStoreLocations]
  );
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
    response && data && handleSetValues(data);
  }, [response, data, setValue, dispatch]);

  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        setValue(fieldName, value);
      });
    };
    const locationsData =
      companyStoreLocationData && companyStoreLocationData.filter((item) => item.organizationStoreId === reqMRFData[0]?.fromStoreId);
    setFilteredLocations(locationsData);
    reqMRFData && handleSetValues(reqMRFData);
  }, [reqMRFData, companyStoreLocationData, setValue, dispatch]);

  const onBack = () => {
    setView(false);
    setUpdate(false);
    setReqMRFData([]);
    setResponse(null);
    navigate('/min');
  };

  const handleRowUpdate = (row, index) => {
    setView(false);
    setUpdate(true);
    setSelectedData(row);
    setMaxQuantity(reqMRFData2[index].approvedQuantity);
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

  const eWayBillNumberValue = watch('eWayBillNumber');

  useEffect(() => {
    setEwayBillNumber(eWayBillNumberValue);
  }, [eWayBillNumberValue]);

  const { masterMakerLovs } = useMasterMakerLov();
  const fetchTransactionType = (value, type) => {
    const res = value && value.filter((obj) => obj.name === type);
    return res && res.length ? res[0].id : null;
  };
  const transactionTypeData = masterMakerLovs.masterMakerLovsObject.rows;
  const transactionTypeId = fetchTransactionType(transactionTypeData, 'MIN');
  const mrfTransactionTypeId = fetchTransactionType(transactionTypeData, 'MRF');
  const transactionTypeIdGrn = fetchTransactionType(transactionTypeData, 'GRN');

  const makeRequest = (formValues) => {
    const itemsWithSerialNumbers = reqMRFData.filter((item) => parseFloat(item.approvedQuantity) > 0 && item.material.isSerialNumber);

    const recordsWithImproperSerialNumbers = itemsWithSerialNumbers.filter(
      (item) => !item.material_serial_numbers || item.material_serial_numbers.length !== item.approvedQuantity
    );

    if (recordsWithImproperSerialNumbers.length > 0) {
      toast(`Incorrect count of serial numbers selected for material "${recordsWithImproperSerialNumbers[0]?.material?.name}"`, {
        variant: 'warning'
      });
      return;
    }

    return {
      transactionTypeId: transactionTypeId,
      requestTransactionTypeId: mrfTransactionTypeId,
      requestNumber: reqMRFData[0]?.referenceDocumentNumber,
      fromOrganizationId: reqMRFData[0]?.from_store?.organization?.parentId
        ? reqMRFData[0]?.from_store?.organization?.parentId
        : reqMRFData[0]?.from_store?.organization?.id,
      fromStoreId: reqMRFData[0]?.from_store?.id,
      vehicleNumber: formValues.vehicleNumber,
      eWayBillNumber: formValues.eWayBillNumber,
      ...(formValues.eWayBillDate && { eWayBillDate: formValues.eWayBillDate }),
      poNumber: formValues.poNumber,
      placeOfSupply: formValues?.placeOfSupply,
      remarks: formValues.remarks,
      stock_ledgers:
        reqMRFData
          .filter((stockData) => parseFloat(stockData.approvedQuantity) > 0)
          .map((stockData) => {
            return {
              transactionTypeId: transactionTypeIdGrn,
              projectId: stockData.projectId,
              requestNumber: stockData.referenceDocumentNumber,
              organizationId: stockData?.to_store?.organization?.parentId
                ? stockData?.to_store?.organization?.parentId
                : stockData?.to_store?.organization?.id,
              fromStoreLocationId: stockData?.fromStoreLocationId,
              storeId: stockData.to_store?.id,
              storeLocationId: stockData.to_store_location?.id,
              materialId: stockData.materialId,
              uomId: stockData.uomId,
              quantity: parseFloat(stockData.approvedQuantity),
              rate: stockData.rate,
              value: stockData.value,
              tax: stockData.tax,
              requestApproverId: stockData.id,
              serialNumber: stockData.material.isSerialNumber ? stockData.material_serial_numbers : []
            };
          }) || []
    };
  };

  const setMaterials = (value) => {
    const reqData = [];
    reqMRFData &&
      reqMRFData.map((val) => {
        if (value.id === val.id) {
          let uomData = val.uom;
          val = value;
          val.uom = uomData;
        }
        reqData.push(val);
      });
    setReqMRFData(reqData);
    setView(false);
    setUpdate(false);
  };

  const onFormSubmit = async (values) => {
    const req = makeRequest(values);
    if (req) {
      setPending(true);
      if (!req.stock_ledgers || req.stock_ledgers.length === 0) {
        toast('Enter atleast 1 material with some quantity!', { variant: 'error' });
        setPending(false);
        return;
      }

      if (isMissingStoreLocation(req.stock_ledgers, 'fromStoreLocationId')) {
        setPending(false);
        return;
      }

      const resp = await request('/min-create', { method: 'POST', body: req, timeoutOverride: 120000 });

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
          : (referenceDocNo && `Transaction created with reference numbers ${referenceDocNo.MIN} and ${referenceDocNo.GRN}`) ||
              'Transaction created successfully!',
        {
          variant: 'success',
          autoHideDuration: 10000
        }
      );

      setPending(false);
      navigate('/min-receipt');
    }
  };

  const addActionField = (tableData) => {
    const tbl = tableData.map((obj, index) => ({
      ...obj,
      // qtyInStock: ' ',
      actions: <Actions values={{ ...obj }} index={index} onEdit={handleRowUpdate} onView={handleRowView} />
    }));
    return tbl;
  };

  const organizationType = fetchTransactionType(transactionTypeData, 'COMPANY');

  useEffect(() => {
    if (!organizationType) return;
    dispatch(getOrganizationStores({ organizationType }));
    dispatch(getCompanyStoreLocations({ organizationType }));
  }, [dispatch, organizationType]);

  useEffect(() => {
    dispatch(getMasterMakerLov());
    dispatch(getDropdownProjects());
  }, [dispatch]);

  useEffect(() => {
    if (!response) return;
    setReqMRFData(response);
    setReqMRFData2(response);
  }, [dispatch, response]);

  return (
    <>
      {pending && <Loader />}
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={'MIN (Material Issue Note)'} sx={{ mb: 2 }}>
          <RequestDropdownSection
            fromStoreLabel="Company Store"
            type="request"
            approvedOnly={true}
            transactionType="MRF"
            disableAll={!!reqMRFData?.length}
            setReqData={setResponse}
          />

          {reqMRFData && reqMRFData.length > 0 && (
            <>
              <Grid container sx={{ mt: 3, mb: 3 }}>
                <Grid item md={12} xl={12}>
                  <Divider />
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item md={3} xl={2}>
                  <RHFTextField name="eWayBillNumber" type="text" label="E-Way Bill Number" InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item md={3} xl={2}>
                  <RHFTextField
                    name="eWayBillDate"
                    type="date"
                    label="E-Way Bill Date"
                    InputLabelProps={{ shrink: true }}
                    disabled={valueIsMissingOrNA(eWayBillNumber)}
                  />
                </Grid>
                <Grid item md={3} xl={2}>
                  <RHFTextField
                    name="to_store.name"
                    type="text"
                    label="Contractor Store"
                    InputLabelProps={{ shrink: true }}
                    disabled
                    required
                  />
                </Grid>
                <Grid item md={3} xl={2}>
                  <RHFTextField name="placeOfSupply" type="text" label="Place Of Supply" InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item md={3} xl={2}>
                  <RHFTextField name="vehicleNumber" type="text" label="Vehicle Number" InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item md={3} xl={2}>
                  <RHFTextField
                    name="contractor_employee.name"
                    type="text"
                    label="Supervisor Name"
                    InputLabelProps={{ shrink: true }}
                    disabled
                  />
                </Grid>
                <Grid item md={3} xl={2}>
                  <RHFTextField
                    name="poNumber"
                    type="text"
                    label="Work Order Number"
                    InputLabelProps={{ shrink: true }}
                    disabled
                    required
                  />
                </Grid>
                <Grid item md={3} xl={2}>
                  <RHFTextField name="remarks" type="text" label="Remarks" InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item md={3} xl={4}>
                  <ApproverRemarks data={reqMRFData} />
                </Grid>
              </Grid>
            </>
          )}

          {reqMRFData && reqMRFData.length > 0 && (
            <>
              {(view || update) && (
                <MaterialInputs
                  onMaterailsInput={setMaterials}
                  storeLocationData={filteredLocations}
                  maxQuantity={maxQuantity}
                  view={view}
                  update={update}
                  showData={selectedData}
                  showCheckboxes
                />
              )}
              <TableForm
                title={'MIN'}
                hideHeader
                hidePagination
                data={addActionField(reqMRFData)}
                count={reqMRFData.length}
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

export default CreateNewMIN;
