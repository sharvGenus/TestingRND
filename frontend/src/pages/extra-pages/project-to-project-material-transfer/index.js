import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Grid, IconButton, Tooltip } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { useStockLedger } from '../stock-ledger/useStockLedger';
import { useOrganizationStoreLocation } from '../organization-store-location/useOrganizationStoreLocation';
import CreateNewTransfer from './create-new-transfer';
import MaterialInputs from './material-inputs';
import TableForm from 'tables/table';
import { getTransactionMaterialList } from 'store/actions';
import { FormProvider } from 'hook-form';
import { getCompanyStoreLocations } from 'store/actions/organizationStoreLocationActions';
import { isMissingStoreLocation } from 'utils';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';

const Actions = ({ values, onEdit, onDelete }) => {
  return (
    <div>
      <Tooltip title="Edit" placement="bottom">
        <IconButton color="secondary" onClick={() => onEdit(values)}>
          <EditOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete" placement="bottom">
        <IconButton color="secondary" onClick={() => onDelete(values.id)}>
          <DeleteOutlineIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

Actions.propTypes = {
  values: PropTypes.any,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
};

const MaterialTransferProjectToProjectRequest = () => {
  const navigate = useNavigate();
  const [materialData, setMaterialData] = useState([]);
  const [materialDataList, setMaterialDataList] = useState([]);
  const [showData, setShowData] = useState({});
  const [view, setView] = useState(false);
  const [viewMaterial, setViewMaterial] = useState(false);
  const [update, setUpdate] = useState(false);
  const [formData, setFormData] = useState(null);
  const dispatch = useDispatch();

  const subColumns = useMemo(
    () => [
      {
        Header: 'Actions',
        accessor: 'actions'
      },
      {
        Header: 'Name',
        accessor: 'name'
      },
      {
        Header: 'Code',
        accessor: 'code'
      },
      {
        Header: 'Quantity',
        accessor: 'quantity'
      },
      {
        Header: 'UOM',
        accessor: 'uomName'
      },
      {
        Header: 'Store Location',
        accessor: 'fromStoreLocation'
      }
    ],
    []
  );
  const [showAdd, setShowAdd] = useState(false);

  const companyId = '420e7b13-25fd-4d23-9959-af1c07c7e94b';
  useEffect(() => {
    if (companyId) {
      dispatch(getCompanyStoreLocations({ organizationType: companyId }));
    }
  }, [dispatch, companyId]);

  const { companyStoreLocations } = useOrganizationStoreLocation();
  const companyStoreLocationData = companyStoreLocations?.companyStoreLocationsObject?.rows || [];
  const onBack = () => {
    setShowAdd(!showAdd);
    setViewMaterial(false);
    setMaterialData([]);
  };
  const filteredCompanyStoreLocationData = companyStoreLocationData.filter(
    (val) => val.organization_store?.id === formData?.projectSiteStoreId
  );

  const handleRowUpdate = (row) => {
    setView(false);
    setUpdate(true);
    setShowData(row);
  };

  const handleRowDelete = (id, index) => {
    setView(false);
    setUpdate(false);
    const newDataSet = structuredClone(materialDataList);
    const resp = newDataSet && newDataSet.length > 0 && newDataSet.filter((_, ind) => ind !== index);
    setMaterialDataList(resp);
  };

  const { transactionMaterialList } = useStockLedger();

  const { materials } = useMemo(
    () => ({
      materials: transactionMaterialList?.stocksObject || [],
      count: transactionMaterialList?.stocksObject?.count || 0
    }),
    [transactionMaterialList]
  );

  useEffect(() => {
    const filterMaterials = (materialsData) => {
      const respMaterials = [];
      materialsData &&
        materialsData.map((mat) => {
          respMaterials.push({
            id: mat?.id,
            name: mat?.name,
            isSerialNumber: mat?.is_serial_number,
            // quantity: mat.quantity,
            tax: mat.tax,
            value: mat.value,
            uomName: mat.uom_name,
            uomId: mat.uom_id,
            rate: parseFloat(mat.rate).toFixed(2),
            code: mat?.code,
            hsnCode: mat?.hsn_code,
            uom: mat.uom,
            store: mat.store,
            project: formData?.projectId
          });
        });
      return respMaterials;
    };

    if (materials && materials.length > 0) {
      setMaterialData(filterMaterials(materials));
    }
  }, [materials, formData]);

  const filterLocationId = (fId) => {
    const filteredValue = companyStoreLocationData.filter((locationData) => locationData.id === fId);
    return filteredValue[0].name;
  };

  const getMaterials = (values) => {
    materialData.map((val) => {
      let newVal = {};
      if (val.id === values.materialId) {
        if (update && values.index >= 0) {
          const matData = materialDataList;
          matData[values.index] = values;
          setMaterialDataList(matData);
        } else {
          if (materialDataList) {
            const existingMaterial = materialDataList.findIndex(
              (item) => item?.id === values?.materialId && item?.fromStoreLocationId === values?.fromStoreLocationId
            );
            if (existingMaterial > -1) {
              const updatedList = structuredClone(materialDataList);
              const newData = {
                ...values,
                ...val,
                uomId: val?.uomId,
                uom: val?.uomName,
                fromStoreLocation: filterLocationId(values?.fromStoreLocationId),
                requestedQuantity: values?.requestedQuantity + updatedList[existingMaterial]?.requestedQuantity
              };
              updatedList[existingMaterial] = newData;
              setMaterialDataList(updatedList);
            } else {
              newVal = { ...structuredClone(val), ...values };
              newVal.uomId = val?.uomId;
              newVal.value = newVal?.value ? parseFloat(newVal.value).toFixed(2) : '';
              newVal.fromStoreLocation = filterLocationId(newVal.fromStoreLocationId);
              setMaterialDataList(materialDataList.concat(newVal));
            }
          }
        }
      }
    });
    setUpdate(false);
  };

  const saveData = (formValues) => {
    if (formValues && formValues.projectId && formValues.projectSiteStoreId) {
      setFormData(formValues);
      setViewMaterial(true);
      dispatch(getTransactionMaterialList({ project: formValues?.projectId, store: formValues.projectSiteStoreId }));
    }
  };

  const onFormSubmit = async () => {
    const payload = {
      transactionTypeId: formData?.transactionTypeId,
      ...(formData?.eWayBillDate && formData?.eWayBillDate !== '' && { eWayBillDate: formData?.eWayBillDate }),
      ...(formData?.eWayBillNumber && { eWayBillNumber: formData?.eWayBillNumber }),
      placeOfSupply: formData?.placeOfSupply,
      vehicleNumber: formData.vehicleNumber,
      remarks: formData?.remarks,
      stock_ledgers: materialDataList.map((val) => ({
        transactionTypeId: formData?.transactionTypeId,
        organizationId: formData?.storeDetails?.organization?.parentId ?? formData?.storeDetails?.organization?.id,
        projectId: formData?.projectId,
        otherProjectId: formData?.toProjectId,
        storeId: formData?.projectSiteStoreId,
        otherStoreId: formData?.toProjectSiteStoreId,
        storeLocationId: val?.storeLocation?.id,
        materialId: val?.id,
        uomId: val?.uomId,
        quantity: val?.quantity,
        rate: val?.rate,
        value: val?.value,
        tax: val?.tax,
        serialNumber: val?.material_serial_numbers
      }))
    };

    if (!payload?.stock_ledgers?.length) {
      toast('Please select atleast one material!', { variant: 'error' });
      return;
    }

    if (isMissingStoreLocation(payload?.stock_ledgers, 'storeLocationId')) return;
    const resp = await request('/project-to-project-create', { method: 'POST', body: { ...payload } });
    if (!resp.success) {
      toast(resp?.error?.message || 'Operation failed. Please try again!', { variant: 'error' });
      return;
    }

    const data = resp.data?.data ?? {};
    const referenceDocumentNumber = data.referenceDocumentNumber || data[0]?.referenceDocumentNumber;

    toast(referenceDocumentNumber ? `Request created with reference number: ${referenceDocumentNumber}` : 'Request created successfully!', {
      variant: 'success',
      autoHideDuration: 10000
    });

    navigate('/ptp-receipt');
  };

  const addActionField = (tableData) => {
    const tbl = tableData.map((obj, index) => ({
      ...obj,
      actions: (
        <Actions
          values={obj}
          onEdit={(rw) => {
            const nrw = structuredClone(rw);
            nrw.index = index;
            handleRowUpdate(nrw);
          }}
          onDelete={(id) => {
            handleRowDelete(id, index);
          }}
        />
      )
    }));
    return tbl;
  };

  return (
    <>
      <CreateNewTransfer onClick={onBack} saveData={saveData} />
      {materialData && viewMaterial && materialData.length > 0 && (
        <MaterialInputs
          materialData={materialData}
          onMaterailsInput={getMaterials}
          storeLocationData={filteredCompanyStoreLocationData}
          view={view}
          update={update}
          showData={showData}
          hideTaxDetails
        />
      )}
      {materialDataList && viewMaterial && materialDataList.length > 0 && (
        <>
          <TableForm
            title="Material Transfer Project To Project Request"
            hideHeader
            hidePagination
            data={addActionField(materialDataList)}
            count={materialDataList.length}
            columns={subColumns}
            hideActions={true}
          />
          <FormProvider>
            <Grid container spacing={4}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', mt: 3 }}>
                <Button onClick={onBack} size="small" variant="outlined" color="primary">
                  Back
                </Button>
                <Button disabled={update} onClick={onFormSubmit} size="small" variant="contained" color="primary">
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

export default MaterialTransferProjectToProjectRequest;
