import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Grid, IconButton, Tooltip } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { useStockLedger } from '../stock-ledger/useStockLedger';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import { useOrganizationStoreLocation } from '../organization-store-location/useOrganizationStoreLocation';
import MaterialInputs from './material-inputs';
import CreateNewSTR from './create-new-str';
import TableForm from 'tables/table';
import { getMasterMakerLov, getTransactionMaterialList } from 'store/actions';
import { FormProvider } from 'hook-form';
import { getCompanyStoreLocations } from 'store/actions/organizationStoreLocationActions';
import toast from 'utils/ToastNotistack';
import request from 'utils/request';

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

const MRR = () => {
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
        accessor: 'requestedQuantity'
      },
      {
        Header: 'UOM',
        accessor: 'uomName'
      }
      // {
      //   Header: 'Store Location',
      //   accessor: 'toStoreLocation'
      // }
    ],
    []
  );
  const [showAdd, setShowAdd] = useState(false);
  useEffect(() => {
    dispatch(getMasterMakerLov());
  }, [dispatch]);
  const { masterMakerLovs } = useMasterMakerLov();
  const transactionTypeData = masterMakerLovs.masterMakerLovsObject.rows;

  const fetchTransactionType = (data, type) => {
    const res = data && data.filter((obj) => obj.name === type);
    return res && res.length ? res[0].id : undefined;
  };

  const { companyStoreLocations } = useOrganizationStoreLocation();
  const storeLocationData = companyStoreLocations.companyStoreLocationsObject?.rows || [];

  const companyId = fetchTransactionType(transactionTypeData, 'COMPANY');

  useEffect(() => {
    if (companyId) dispatch(getCompanyStoreLocations({ organizationType: companyId }));
  }, [dispatch, companyId]);

  const onBack = () => {
    setViewMaterial(false);
    setMaterialData([]);
    setShowAdd(!showAdd);
  };

  const handleRowUpdate = (row) => {
    setView(false);
    setUpdate(true);
    setShowData(row);
  };

  const { transactionMaterialList, serialNumbers } = useStockLedger();

  const { materials } = useMemo(
    () => ({
      materials: transactionMaterialList?.stocksObject || [],
      count: transactionMaterialList?.stocksObject?.count || 0
    }),
    [transactionMaterialList]
  );

  const { serialNumbersData } = useMemo(
    () => ({
      serialNumbersData: serialNumbers?.data || [],
      countSN: serialNumbers?.data?.count || 0
    }),
    [serialNumbers]
  );

  useEffect(() => {
    const filterMaterials = (materialsData) => {
      const respMaterials = [];
      materialsData &&
        materialsData.map((mat) => {
          respMaterials.push({
            id: mat.id,
            name: mat.name,
            isSerialNumber: mat.is_serial_number,
            // quantity: mat.quantity,
            tax: mat.tax,
            value: mat.value,
            uomName: mat.uom_name,
            uomId: mat.uom_id,
            rate: parseFloat(mat.rate).toFixed(2),
            code: mat.code,
            hsnCode: mat.hsn_code,
            // uom: mat.uom,
            material_serial_numbers: serialNumbersData[mat.id] ? serialNumbersData[mat.id] : []
          });
        });
      // respMaterials.map((val) => {
      //   val.actions = <Actions values={val} onEdit={handleRowUpdate} />;
      // });
      return respMaterials;
    };
    if (materials && materials.length > 0) {
      setMaterialData(filterMaterials(materials));
    }
  }, [materials, serialNumbersData]);

  // const filterLocationId = (fid) => {
  //   const filteredValue = storeLocationData.filter((locationData) => locationData.id === fid);
  //   return filteredValue[0].name;
  // };

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
              (item) => item?.id === values?.materialId && item?.toStoreLocationId === values?.toStoreLocationId
            );
            if (existingMaterial > -1) {
              const updatedList = structuredClone(materialDataList);
              const newData = {
                ...values,
                ...val,
                uomId: val?.uomId,
                uom: val?.uomName,
                // toStoreLocation: filterLocationId(values?.toStoreLocationId),
                requestedQuantity: values?.requestedQuantity + updatedList[existingMaterial]?.requestedQuantity
              };
              updatedList[existingMaterial] = newData;
              setMaterialDataList(updatedList);
            } else {
              newVal = { ...structuredClone(val), ...values };
              newVal.uomId = val?.uomId;
              newVal.value = newVal?.value ? parseFloat(newVal.value).toFixed(2) : '';
              // newVal.toStoreLocation = filterLocationId(newVal.toStoreLocationId);
              setMaterialDataList(materialDataList.concat(newVal));
            }
          }
        }
      }
    });
    setUpdate(false);
  };

  const saveData = (formValues) => {
    if (formValues && formValues.projectId && formValues.fromProjectSiteStoreId && formValues.toProjectSiteStoreId) {
      setViewMaterial(true);
      dispatch(getTransactionMaterialList({ project: formValues.projectId, store: formValues.fromProjectSiteStoreId }));
      setFormData(formValues);
    }
  };

  const onFormSubmit = async () => {
    const payload = materialDataList
      .filter((item) => parseFloat(item.requestedQuantity) > 0)
      .map((val) => ({
        requestName: 'STR',
        transactionTypeId: formData.transactionTypeId,
        projectId: formData.projectId,
        requestOrganizationId: formData.requestOrganizationId,
        requestStoreId: formData.toProjectSiteStoreId,
        approverStoreId: formData.fromProjectSiteStoreId,
        fromStoreId: formData.fromProjectSiteStoreId,
        toStoreId: formData.toProjectSiteStoreId,
        toStoreLocationId: val.toStoreLocationId,
        materialId: val.id,
        uomId: val.uomId,
        requestedQuantity: val.requestedQuantity,
        rate: val.rate,
        value: val.value,
        tax: val.tax,
        vehicleNumber: formData.vehicleNumber,
        remarks: formData.remarks
      }));

    if (!payload?.length) {
      toast('Please select atleast one material!', { variant: 'error' });
      return;
    }

    const resp = await request('/request-create', { method: 'POST', body: { payload: payload } });

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

    navigate('/str-receipt');
  };

  const handleRowDelete = (id, index) => {
    setView(false);
    setUpdate(false);
    const newDataSet = structuredClone(materialDataList);
    const resp = newDataSet && newDataSet.length > 0 && newDataSet.filter((_, ind) => ind !== index);
    setMaterialDataList(resp);
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
      <CreateNewSTR disableAll={viewMaterial && !!materialData?.length} onClick={onBack} saveData={saveData} />
      {materialData && viewMaterial && materialData.length > 0 && (
        <MaterialInputs
          materialData={materialData}
          hideTaxDetails
          onMaterailsInput={getMaterials}
          view={view}
          storeLocationData={storeLocationData.filter((val) => val.organizationStoreId === formData.toProjectSiteStoreId)}
          update={update}
          formValues={formData}
          showData={showData}
        />
      )}
      {materialDataList && viewMaterial && materialDataList.length > 0 && (
        <>
          <TableForm
            title="STR"
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

export default MRR;
