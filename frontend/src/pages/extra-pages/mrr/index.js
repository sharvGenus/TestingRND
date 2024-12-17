import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Grid, IconButton, Tooltip } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { useStockLedger } from '../stock-ledger/useStockLedger';
import CreateNewTransfer from './create-new-transfer';
import MaterialInputs from './material-input';
import TableForm from 'tables/table';
import { getTransactionMaterialList } from 'store/actions';
import { FormProvider } from 'hook-form';
import { isMissingStoreLocation } from 'utils';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import Loader from 'components/Loader';

const Actions = ({ values, onEdit, onDelete }) => {
  return (
    <div>
      <Tooltip title="Edit" placement="bottom">
        <IconButton color="secondary" onClick={() => onEdit(values)}>
          <EditOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete" placement="bottom">
        <IconButton color="secondary" onClick={() => onDelete(values)}>
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
  const [projectId, setProjectId] = useState(null);
  const [storeId, setStoreId] = useState(null);
  const [serialNumbersArr, setSerialNumbersArr] = useState([]);
  const [pending, setPending] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [alreadySelectedLocations, setAlreadySelectedLocations] = useState([]);

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
        accessor: 'uom'
      },
      {
        Header: 'From Store Location',
        accessor: 'fromStoreLocationName'
      }
    ],
    []
  );

  const onBack = () => {
    setUpdate(false);
    setShowData({});
    setView(false);
    setMaterialData([]);
    setViewMaterial(false);
  };

  const handleRowUpdate = useCallback(
    (row) => {
      setView(false);
      setUpdate(true);
      setShowData({ ...row, StoreLocationId: formData?.contractorStoreLocationId });
    },
    [formData]
  );

  const handleRowDelete = (ind, vl) => {
    if (materialDataList) {
      const liData = materialDataList.filter((_, index) => index !== ind);
      let locData = [];
      liData.map((val) => locData.push(val.fromStoreLocationId));
      setMaterialDataList(liData);
      setAlreadySelectedLocations(locData);
      delete selectedItems[vl.materialId + vl.fromStoreLocationId];
    }
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
          // if (mat.quantity > 0) {
          respMaterials.push({
            id: mat.id,
            name: mat.name,
            isSerialNumber: mat.is_serial_number,
            // quantity: ' ',
            tax: mat.tax,
            value: mat.value,
            uomName: mat.uom_name,
            uomId: mat.uom_id,
            rate: parseFloat(mat.rate).toFixed(2),
            code: mat.code,
            hsnCode: mat.hsn_code,
            // uom: mat.uom,
            projectId: projectId,
            fromStoreId: storeId,
            material_serial_numbers: []
          });
          // }
        });
      return respMaterials;
    };
    if (materials && materials.length > 0) {
      setMaterialData(filterMaterials(materials));
    }
  }, [materials, projectId, storeId]);

  const getMaterials = (values, id) => {
    if (id) {
      materialData.map((val) => {
        let newVal = {};
        if (val.id === values.materialId) {
          newVal = { ...val, ...values };
          newVal.uomId = val?.uomId;
          setAlreadySelectedLocations((prev) => [...prev, newVal.fromStoreLocationId]);
          const index = materialDataList.findIndex((item) => item.id === id && values?.fromStoreLocationId === item?.fromStoreLocationId);
          if (index >= 0) {
            const updatedList = structuredClone(materialDataList);
            updatedList[index] = newVal;
            setMaterialDataList(updatedList);
          } else setMaterialDataList(materialDataList.concat(newVal));
        }
      });
      setUpdate(false);
    }
  };

  const saveData = (formValues) => {
    if (formValues && formValues.projectId && formValues.contractorStoreId) {
      setViewMaterial(true);
      dispatch(getTransactionMaterialList({ project: formValues.projectId, store: formValues.contractorStoreId }));
      setFormData(formValues);
    }
  };

  const onFormSubmit = async () => {
    setPending(true);

    const payload = materialDataList
      .filter((item) => parseFloat(item.quantity) > 0)
      .map((val) => ({
        requestName: 'MRR',
        transactionTypeId: formData.transactionTypeId,
        requestOrganizationId: formData.requestOrganizationId,
        contractorEmployeeId: formData.contractorEmployeeId,
        requestStoreId: formData.contractorStoreId,
        approverStoreId: formData.projectSiteStoreId,
        projectId: formData.projectId,
        fromStoreId: formData.contractorStoreId,
        fromStoreLocationId: val.fromStoreLocationId,
        toStoreId: formData.projectSiteStoreId,
        materialId: val.materialId,
        uomId: val.uomId,
        requestedQuantity: val.quantity,
        rate: val.rate,
        value: val.value,
        tax: val.tax,
        serialNumbers: JSON.stringify(val?.material_serial_numbers),
        remarks: formData.remarks
      }));

    if (!payload.length) {
      toast('Please have at least one material with some quantity', { variant: 'error' });
      setPending(false);
      return;
    }

    if (isMissingStoreLocation(payload, 'fromStoreLocationId')) {
      setPending(false);
      return;
    }

    const resp = await request('/request-create', { method: 'POST', body: { payload: payload }, timeoutOverride: 120000 });

    if (!resp.success) {
      toast(resp?.error?.message || 'Operation failed. Please try again!', { variant: 'error' });
      setPending(false);
      return;
    }

    const data = resp.data?.data ?? {};
    const referenceDocumentNumber = data.referenceDocumentNumber || data[0]?.referenceDocumentNumber;

    toast(referenceDocumentNumber ? `Request created with reference number: ${referenceDocumentNumber}` : 'Request created successfully!', {
      variant: 'success',
      autoHideDuration: 10000
    });

    setPending(false);
    navigate('/mrr-receipt');
  };

  const materialInput = (values, id, key) => {
    getMaterials(values, id);
    const alreadySelectedItems = selectedItems;
    if (!alreadySelectedItems[key]) alreadySelectedItems[key] = {};
    alreadySelectedItems[key] = values;
    setSelectedItems(alreadySelectedItems);
  };

  const addActionField = (arr) => {
    const list =
      arr &&
      arr.length > 0 &&
      arr.map((val, ind) => ({
        ...val,
        actions: (
          <Actions
            values={val}
            onEdit={handleRowUpdate}
            onDelete={(vl) => {
              handleRowDelete(ind, vl);
            }}
          />
        )
      }));
    return list;
  };

  return (
    <>
      {pending && <Loader />}
      <CreateNewTransfer
        onClick={onBack}
        disableAll={viewMaterial && materialData && materialData.length > 0}
        saveData={saveData}
        setProjectId={setProjectId}
        setStoreId={setStoreId}
      />
      {materialData && viewMaterial && materialData.length > 0 && (
        <>
          <MaterialInputs
            materials={materialData}
            onMaterailsInput={materialInput}
            filteringStoreId={formData.contractorStoreId}
            view={view}
            formData={formData}
            projectId={projectId}
            storeId={storeId}
            update={update}
            showData={showData}
            serialNumbersArr={serialNumbersArr}
            setSerialNumbersArr={setSerialNumbersArr}
            selectedLocations={alreadySelectedLocations}
            selectedItems={selectedItems}
          />

          {materialDataList.length === 0 && (
            <Grid container spacing={4}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', mt: 2 }}>
                <Button onClick={onBack} size="small" variant="outlined" color="primary">
                  Back
                </Button>
              </Grid>
            </Grid>
          )}
        </>
      )}
      {materialDataList && viewMaterial && materialDataList.length > 0 && (
        <>
          <TableForm
            title="MRR"
            hideHeader
            hidePagination
            data={addActionField(materialDataList)}
            count={materialDataList.length}
            columns={subColumns}
            hideActions={true}
          />
          <FormProvider>
            <Grid container spacing={4}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', mt: 2 }}>
                <Button onClick={onBack} size="small" variant="outlined" color="primary">
                  Back
                </Button>
                <Button disabled={update || pending} onClick={onFormSubmit} size="small" variant="contained" color="primary">
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
