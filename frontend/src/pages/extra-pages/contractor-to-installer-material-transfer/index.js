import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Grid, IconButton, Tooltip } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useStockLedger } from '../stock-ledger/useStockLedger';
// import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
// import { useOrganizationStoreLocation } from '../organization-store-location/useOrganizationStoreLocation';
import CreateNewMaterialTransferToInstaller from './create-new-transfer';
import MaterialInputs from './material-input';
import TableForm from 'tables/table';
import { getTransactionMaterialList } from 'store/actions';
import { FormProvider } from 'hook-form';
// import { getFirmStoreLocations } from 'store/actions/organizationStoreLocationActions';
import toast from 'utils/ToastNotistack';
import request from 'utils/request';
import Loader from 'components/Loader';
import MaterialSerialNumberModal from 'components/modal/MaterialSerialNumberModal/MaterialSerialNumberModal';
import useValueAfterLoad from 'hooks/useValueAfterLoad';

const Actions = ({ values, onEdit, onDelete, onView }) => {
  return (
    <>
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
      {values?.isSerialNumber && (
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
  onDelete: PropTypes.func,
  onView: PropTypes.func
};

const MaterialTransferContractorToInstaller = () => {
  const navigate = useNavigate();
  const [materialData, setMaterialData] = useState([]);
  const [check, setCheck] = useState(false);
  const [materialDataList, setMaterialDataList] = useState([]);
  const [alreadySelectedLocations, setAlreadySelectedLocations] = useState([]);
  const [showData, setShowData] = useState({});
  const [selectedItems, setSelectedItems] = useState({});
  const [view, setView] = useState(false);
  const [update, setUpdate] = useState(false);
  const [formData, setFormData] = useState(null);
  const [pending, setPending] = useState(false);
  const [serialNumber, setSerialNumber] = useState(null);
  const [openSerialNumber, setOpenSerialNumber] = useState(false);
  const [rowData, setRowData] = useState(null);
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
        Header: 'From Store Location',
        accessor: 'fromStoreLocationName'
      }
    ],
    []
  );

  const onBack = () => {
    setMaterialDataList([]);
    setSelectedItems({});
    setShowData({});
    setUpdate(false);
    setFormData(null);
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
        materialsData.length > 0 &&
        materialsData.map((mat) => {
          // if (mat.quantity > 0) {
          respMaterials.push({
            id: mat.id,
            name: mat.name,
            isSerialNumber: mat.is_serial_number,
            // quantity: mat.quantity,
            tax: mat.tax > 0 ? mat.tax : '0',
            value: mat.value,
            uomName: mat.uom_name,
            uomId: mat.uom_id,
            rate: parseFloat(mat.rate).toFixed(2),
            code: mat.code,
            hsnCode: mat.hsn_code,
            // uom: mat.uom,
            material_serial_numbers: serialNumbersData[mat.id] ? serialNumbersData[mat.id] : []
          });
          // }
        });
      // respMaterials.map((val) => {
      //   val.actions = <Actions values={val} onEdit={handleRowUpdate} />;
      // });
      return respMaterials;
    };
    if (check && materials) {
      const allMaterials = filterMaterials(materials);
      setMaterialData(allMaterials.filter((vl) => vl.id !== '84b473e1-62bb-4afe-af56-1691bdffbc55'));
    }
  }, [materials, serialNumbersData, check, handleRowUpdate]);

  // const filterLocationId = (fid) => {
  //   const filteredValue = storeLocationData.filter((locationData) => locationData.id === fid);
  //   return filteredValue[0]?.name;
  // };

  const getMaterials = (values, id) => {
    if (id) {
      // const newData = materialDataList;
      materialData.map((val) => {
        let newVal = {};
        if (val.id === values.materialId) {
          newVal = { ...structuredClone(val), ...values };
          newVal.uomId = val?.uomId;
          let loc = alreadySelectedLocations;
          loc.push(newVal.fromStoreLocationId);
          setAlreadySelectedLocations(loc);
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
      setFormData(formValues);
      setCheck(true);
      dispatch(getTransactionMaterialList({ project: formValues.projectId, store: formValues.contractorStoreId }));
    }
  };

  const setStockData = (mat, formDta) => {
    return mat
      .filter((value) => parseFloat(value.quantity) > 0)
      .map((value) => ({
        transactionTypeId: formDta.transactionTypeId,
        organizationId: formDta.contractorId,
        projectId: formDta.projectId,
        fromStoreLocationId: value.fromStoreLocationId,
        storeId: formDta.contractorStoreId,
        storeLocationId: formDta.installerStoreLocationId,
        installerId: formDta.installerId,
        materialId: value.id,
        uomId: value.uomId,
        quantity: value.quantity,
        rate: value.rate,
        value: value.value,
        tax: value.tax,
        remarks: formDta.remarks,
        serialNumber: value.material_serial_numbers
      }));
  };

  const onFormSubmit = async () => {
    setPending(true);

    const payload = {
      transactionTypeId: formData.transactionTypeId,
      stock_ledgers: setStockData(materialDataList, formData)
    };
    if (payload.stock_ledgers?.length === 0) {
      toast('Please have atleast one material with some quantity', { variant: 'error' });
      setPending(false);
      return;
    }
    const resp = await request('/cti-transaction-create', { method: 'POST', body: payload, timeoutOverride: 120000 });

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
    navigate('/stock-ledger');
  };

  const addActions = (arr) => {
    const list = [];
    arr &&
      arr.length > 0 &&
      arr.map((val, ind) => {
        list.push({
          ...val,
          actions: (
            <Actions
              values={val}
              onEdit={handleRowUpdate}
              onDelete={(vl) => {
                handleRowDelete(ind, vl);
              }}
              onView={handleRowView}
            />
          )
        });
      });
    return list;
  };

  const transactionLoaded = useValueAfterLoad({
    dataObject: transactionMaterialList,
    key: 'stocksObject',
    resetTrigger: formData === null
  });

  useEffect(() => {
    if (Array.isArray(transactionLoaded) && transactionLoaded.length === 0) {
      onBack();
      toast('There are no available materials for your selected combination', { variant: 'error' });
    }
  }, [transactionLoaded]);

  return (
    <>
      {pending && <Loader />}
      <CreateNewMaterialTransferToInstaller disableAll={!!formData} onClick={onBack} saveData={saveData} />

      {formData && materialData && materialData.length > 0 && (
        <MaterialInputs
          materials={materialData}
          onMaterailsInput={(values, id, key) => {
            getMaterials(values, id);
            const alreadySelectedItems = selectedItems;
            if (!alreadySelectedItems[key]) alreadySelectedItems[key] = {};
            alreadySelectedItems[key] = values;
            setSelectedItems(alreadySelectedItems);
          }}
          hideTaxDetails
          formData={formData}
          view={view}
          update={update}
          showData={showData}
          selectedLocations={alreadySelectedLocations}
          selectedItems={selectedItems}
        />
      )}

      {formData && materialDataList && materialDataList.length > 0 && (
        <>
          <TableForm
            title="Material Transfer Contractor To Store"
            hideHeader
            hidePagination
            data={addActions(materialDataList)}
            count={materialDataList.length}
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
        </>
      )}

      <FormProvider>
        <Grid container spacing={4}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', mt: 2 }}>
            {formData && (
              <Button onClick={onBack} size="small" variant="outlined" color="primary">
                Back
              </Button>
            )}
            {formData && materialData && materialData.length > 0 && (
              <Button disabled={update || pending} onClick={onFormSubmit} size="small" variant="contained" color="primary">
                Submit
              </Button>
            )}
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
};

export default MaterialTransferContractorToInstaller;
