import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Button, Grid, IconButton, Tooltip } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useOrganizationStoreLocation } from '../organization-store-location/useOrganizationStoreLocation';
import MaterialInputs from './material-view-inputs';
import CreateNewMaterialTransferToStore from './create-new-transfer';
import TableForm from 'tables/table';
import { getCompanyStoreLocations } from 'store/actions/organizationStoreLocationActions';
import { FormProvider } from 'hook-form';
import { isMissingStoreLocation } from 'utils';
import toast from 'utils/ToastNotistack';
import request from 'utils/request';
import RequestDropdownSection from 'components/sections/RequestDropdownSection';
import MainCard from 'components/MainCard';
import Loader from 'components/Loader';
import Validations from 'constants/yupValidations';
import FileSections from 'components/attachments/FileSections';
import MaterialSerialNumberModal from 'components/modal/MaterialSerialNumberModal/MaterialSerialNumberModal';

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
    Header: 'Quantity In Stock',
    accessor: 'qtyInStock'
  },
  {
    Header: 'UOM',
    accessor: 'uom.name'
  },
  {
    Header: 'Company Store Location',
    accessor: 'from_store_location.name'
  }
];

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

const fileFields = [
  {
    name: 'attachments',
    label: 'Attachments',
    accept: '*',
    required: false,
    multiple: true
  }
];

const MaterialTransferToStore = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [reqSTRData, setReqSTRData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [maxQuantity, setMaxQuantity] = useState(null);
  const [update, setUpdate] = useState(false);
  const [response, setResponse] = useState();
  const [showAdd, setShowAdd] = useState(false);
  const [disableAll, setDisableAll] = useState(false);
  const [pending, setPending] = useState(false);
  const [serialNumber, setSerialNumber] = useState(null);
  const [openSerialNumber, setOpenSerialNumber] = useState(false);
  const [rowData, setRowData] = useState(null);

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        ...(fileFields.find((item) => item.name === 'attachments')?.required && {
          attachments: Validations.requiredWithLabel('Attachments')
        })
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { watch, setValue, handleSubmit } = methods;
  const attachmentsPaths = watch('attachments-paths');

  const handleRowUpdate = useCallback(
    (row, index) => {
      setUpdate(true);
      setSelectedData(row);
      setMaxQuantity(reqSTRData[index]?.approvedQuantity);
    },
    [reqSTRData]
  );

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

  useEffect(() => {
    if (!response) return;
    const newResp = structuredClone(response);
    delete newResp[0].rate;
    delete newResp[0].tax;
    delete newResp[0].value;
    setReqSTRData(newResp);
  }, [dispatch, response]);

  const { companyStoreLocations } = useOrganizationStoreLocation();
  const storeLocationData = companyStoreLocations.companyStoreLocationsObject?.rows || [];

  const onBack = () => {
    setUpdate(false);
    setFormData(null);
    setShowAdd(!showAdd);
    setReqSTRData([]);
    setResponse(null);
  };

  const filterMaterials = (materialsData) => {
    return materialsData
      ?.filter((value) => value.approvedQuantity > 0)
      .map((value, index) => {
        return {
          ...value,
          actions: <Actions values={{ ...value }} index={index} onEdit={handleRowUpdate} onView={handleRowView} />
        };
      });
  };

  const onMaterialsInput = (values, id) => {
    if (id) {
      setReqSTRData(
        reqSTRData.map((value) => {
          if (value.id === values.id) {
            return {
              ...value,
              approvedQuantity: values.approvedQuantity,
              fromStoreLocationId: values.fromStoreLocationId,
              from_store_location: values.from_store_location,
              material_serial_numbers: values.material_serial_numbers,
              qtyInStock: values.qtyInStock,
              rate: values.rate,
              tax: values.tax,
              value: values.value
            };
          }
          return value;
        })
      );
      setUpdate(false);
    }
  };

  const [formData, setFormDataState] = useState();

  const setFormData = (formValues) => {
    if (formValues) {
      setFormDataState(formValues);
    }
  };

  function makeRequest() {
    const itemsWithSerialNumbers = reqSTRData.filter((item) => parseInt(item.approvedQuantity) > 0 && item.material.isSerialNumber);

    const recordsWithImproperSerialNumbers = itemsWithSerialNumbers.filter(
      (item) => !item.material_serial_numbers || item.material_serial_numbers.length !== item.approvedQuantity
    );

    if (recordsWithImproperSerialNumbers.length > 0) {
      toast(`Incorrect count of serial numbers selected for material "${recordsWithImproperSerialNumbers[0]?.material?.name}"`, {
        variant: 'warning'
      });
      return;
    }

    const payload = {
      transactionTypeId: formData.transactionTypeId,
      requestTransactionTypeId: formData.strTransactionTypeId,
      requestNumber: reqSTRData?.[0]?.referenceDocumentNumber,
      poNumber: formData?.poNumber,
      poDate: formData?.poDate,
      lrNumber: formData?.lrNumber,
      transporterName: formData?.transporterName,
      transporterContactNumber: formData?.transporterContactNumber,
      vehicleNumber: formData?.vehicleNumber,
      invoiceNumber: formData?.invoiceNumber,
      invoiceDate: formData?.invoiceDate,
      actualReceiptDate: formData?.actualReceiptDate,
      remarks: formData?.remarks,
      fromStoreId: reqSTRData?.[0]?.fromStoreId,
      placeOfSupply: formData?.placeOfSupply,
      attachments: attachmentsPaths,
      stock_ledgers:
        reqSTRData
          .filter((stockData) => parseFloat(stockData.approvedQuantity) > 0)
          .map((stockData) => {
            return {
              transactionTypeId: formData.transactionTypeId,
              organizationId:
                stockData?.from_store?.organization?.parentId !== null
                  ? stockData?.from_store?.organization?.parent?.id
                  : stockData?.from_store?.organization?.id,
              projectId: stockData?.projectId,
              fromStoreLocationId: stockData?.fromStoreLocationId,
              storeId: formData?.storeId,
              requestNumber: stockData?.referenceDocumentNumber,
              materialId: stockData?.materialId,
              uomId: stockData?.uomId,
              quantity: stockData?.approvedQuantity,
              rate: stockData?.rate,
              value: stockData?.value,
              tax: stockData?.tax,
              remarks: formData?.remarks,
              serialNumber: stockData.material.isSerialNumber ? stockData.material_serial_numbers : []
            };
          }) || []
    };

    return payload;
  }

  const onFormSubmit = async () => {
    setPending(true);
    const payload = makeRequest();

    if (!payload) {
      setPending(false);
      return;
    }

    if (isMissingStoreLocation(payload.stock_ledgers, 'fromStoreLocationId')) {
      setPending(false);
      return;
    }

    const resp = await request('/sto-transaction-create', { method: 'POST', body: payload, timeoutOverride: 120000 });

    if (!resp.success) {
      toast(resp?.error?.message || 'Operation failed. Please try again!', { variant: 'error' });
      setPending(false);
      return;
    }

    const data = resp.data?.data ?? {};
    const referenceDocumentNumber = data.referenceDocumentNumber || data[0]?.referenceDocumentNumber;

    toast(
      referenceDocumentNumber
        ? `Transaction created with reference number: ${referenceDocumentNumber}`
        : 'Transaction created successfully!',
      {
        variant: 'success',
        autoHideDuration: 10000
      }
    );

    setPending(false);
    navigate('/sto-receipt');
  };

  const filterLocationByStoreId = (strdata) => {
    return storeLocationData.filter((locationData) => locationData.organizationStoreId === strdata?.[0]?.fromStoreId);
  };

  useEffect(() => {
    const organizationType = '420e7b13-25fd-4d23-9959-af1c07c7e94b';
    dispatch(getCompanyStoreLocations({ organizationType }));
  }, [dispatch]);

  return (
    <>
      {pending && <Loader />}
      <MainCard title={'STO (Stock Transfer Order)'} sx={{ mb: 2, pb: 4 }}>
        <RequestDropdownSection
          fromStoreLabel="Company Store"
          showFromStoreAddress={true}
          fromStoreType="COMPANY"
          type="request"
          approvedOnly={true}
          transactionType="STR"
          disableAll={!!response?.length}
          setReqData={setResponse}
          showBranchAlso
        />
        <Box sx={{ mt: 4 }}>
          <CreateNewMaterialTransferToStore
            onClick={onBack}
            disableAll={disableAll}
            setDisableAll={setDisableAll}
            setFormData={setFormData}
            reqSTRData={reqSTRData}
          />
        </Box>
      </MainCard>

      {update && (
        <MaterialInputs
          showData={selectedData}
          onMaterailsInput={onMaterialsInput}
          maxQuantity={maxQuantity}
          view={false}
          update={update}
          storeLocationData={filterLocationByStoreId(reqSTRData)}
          showCheckboxes
        />
      )}

      {formData && reqSTRData && reqSTRData.length > 0 && (
        <>
          <TableForm
            title={'STO (Stock Transfer Order)'}
            hideHeader
            hidePagination
            data={filterMaterials(reqSTRData)}
            count={reqSTRData.length}
            columns={subColumns}
            hideActions={true}
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
          <FormProvider methods={methods}>
            <Grid container spacing={4} sx={{ mt: 1 }}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-start', gap: '20px', position: 'absolute' }}>
                <FileSections fileFields={fileFields} setValue={setValue} />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                <Button onClick={onBack} size="small" variant="outlined" color="primary">
                  Back
                </Button>
                <Button disabled={update || pending} onClick={handleSubmit(onFormSubmit)} size="small" variant="contained" color="primary">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </FormProvider>
        </>
      )}
    </>
  );
};

export default MaterialTransferToStore;
