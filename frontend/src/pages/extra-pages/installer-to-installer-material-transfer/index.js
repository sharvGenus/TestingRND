import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Grid, IconButton, Tooltip } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useStockLedger } from '../stock-ledger/useStockLedger';
import CreateNewMaterialTransferToInstaller from './create-new-transfer';
import MaterialInputs from './material-inputs';
import { getTransactionMaterialList } from 'store/actions';
import { isMissingStoreLocation } from 'utils';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import Loader from 'components/Loader';
import MaterialSerialNumberModal from 'components/modal/MaterialSerialNumberModal/MaterialSerialNumberModal';
import useValueAfterLoad from 'hooks/useValueAfterLoad';
import TableForm from 'tables/table';

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

const subColumns = [
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
];

const MaterialTransferInstallerToInstaller = () => {
  const [initialFormData, setInitialFormData] = useState(null);
  const [materialDataList, setMaterialDataList] = useState([]);
  const [materialData, setMaterialData] = useState([]);
  const [dataForDisplay, setDataForDisplay] = useState(null);
  const [alreadySelectedLocations, setAlreadySelectedLocations] = useState([]);
  const [update, setUpdate] = useState(false);
  const [pending, setPending] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [showData, setShowData] = useState({});
  const [check, setCheck] = useState(false);
  const [serialNumber, setSerialNumber] = useState(null);
  const [openSerialNumber, setOpenSerialNumber] = useState(false);
  const [rowData, setRowData] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onBack = () => {
    setMaterialDataList([]);
    setSelectedItems({});
    setUpdate(false);
    setShowData({});
    setDataForDisplay(null);
    setInitialFormData(null);
  };

  const saveData = (formValues) => {
    if (formValues && formValues.projectId && formValues.contractorStoreId) {
      setInitialFormData(formValues);
      setCheck(true);
      dispatch(getTransactionMaterialList({ project: formValues.projectId, store: formValues.contractorStoreId }));
    }
  };

  const setStockData = () => {
    const { projectId, contractorId, contractorStoreId, toInstallerStoreLocationId, receivingStore } = initialFormData;

    const respData = [];

    materialDataList
      ?.filter((item) => parseFloat(item.quantity) > 0)
      .map((matItem) => {
        const { fromStoreLocationId, materialId, uomId, quantity, rate, value, tax } = matItem;

        respData.push({
          transactionTypeId: '5b4e46d5-7bf5-4f42-8c4a-b6337533fdff',
          organizationId: contractorId,
          projectId: projectId,
          fromStoreLocationId: fromStoreLocationId,
          storeId: contractorStoreId,
          storeLocationId: toInstallerStoreLocationId,
          receivingStoreLocationId: receivingStore,
          materialId: materialId,
          uomId: uomId,
          quantity: quantity,
          rate: rate,
          value: value,
          tax: tax,
          remarks: initialFormData.remarks,
          serialNumber: matItem.material_serial_numbers
        });
      });
    return respData;
  };

  // const getAllSerialNumbers = (data) =>
  //   (data || []).reduce((accumulator, currentItem) => {
  //     accumulator.push(...(currentItem?.material_serial_numbers?.map((item) => item?.serialNumber) || []));
  //     return accumulator;
  //   }, []);

  const onFormSubmit = async () => {
    setPending(true);

    const { fromInstallerId, toInstallerId } = initialFormData;
    const stockData = setStockData();

    if (!stockData?.length) {
      toast('Please have atleast one material with some quantity', { variant: 'error' });
      setPending(false);
      return;
    }

    const payload = {
      transactionTypeId: '799ee00c-0819-498a-9e47-3ac269f33db8',
      fromInstallerId: fromInstallerId,
      toInstallerId: toInstallerId,
      stock_ledgers: stockData
    };

    // payload.serialNumber = getAllSerialNumbers(payload.stock_ledgers);

    if (isMissingStoreLocation(payload.stock_ledgers, 'fromStoreLocationId')) {
      setPending(false);
      return;
    }

    const resp = await request('/iti-transaction-create', { method: 'POST', body: payload, timeoutOverride: 120000 });

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
        : (referenceDocNo && `Transaction created with reference numbers ${referenceDocNo.ITC} and ${referenceDocNo.CTI}`) ||
            'Transaction created successfully!',
      {
        variant: 'success',
        autoHideDuration: 10000
      }
    );

    setPending(false);
    navigate('/stock-ledger');
  };

  const handleRowUpdate = useCallback(
    (row) => {
      setUpdate(true);
      setShowData({ ...row, StoreLocationId: initialFormData?.contractorStoreLocationId });
    },
    [initialFormData]
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
      return respMaterials;
    };
    if (check && materials) {
      const allMaterials = filterMaterials(materials);
      setMaterialData(allMaterials.filter((vl) => vl.id !== '84b473e1-62bb-4afe-af56-1691bdffbc55'));
    }
  }, [materials, serialNumbersData, check]);

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

  const addActions = (arr) => {
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
            onView={handleRowView}
          />
        )
      }));
    return list;
  };

  useEffect(() => {
    if (!initialFormData) return;
    dispatch(getTransactionMaterialList({ project: initialFormData.projectId, store: initialFormData.contractorStoreId }));
  }, [dispatch, initialFormData]);

  const transactionLoaded = useValueAfterLoad({
    dataObject: transactionMaterialList,
    key: 'stocksObject',
    resetTrigger: initialFormData === null
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

      <CreateNewMaterialTransferToInstaller disableAll={!!initialFormData} saveData={saveData} />

      {initialFormData && (
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
          formData={initialFormData}
          update={update}
          showData={showData}
          selectedLocations={alreadySelectedLocations}
          selectedItems={selectedItems}
        />
      )}

      {initialFormData && Array.isArray(materialDataList) && materialDataList.length > 0 && (
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

      {initialFormData && (
        <Grid container spacing={4}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', mt: 2 }}>
            <Button onClick={onBack} size="small" variant="outlined" color="primary">
              Back
            </Button>
            <Button
              disabled={update || !!dataForDisplay || pending}
              onClick={onFormSubmit}
              size="small"
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default MaterialTransferInstallerToInstaller;
