import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Grid, IconButton, Tooltip } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router';
import { DeleteOutline } from '@mui/icons-material';
import { useStockLedger } from '../stock-ledger/useStockLedger';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import CreateNewSTSRC from './create-new-stsrc';
import MaterialInputs from './material-input';
import TableForm from 'tables/table';
import { getMasterMakerLov, getTransactionMaterialList } from 'store/actions';
import { FormProvider } from 'hook-form';
import { getCompanyStoreLocations } from 'store/actions/organizationStoreLocationActions';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import useValueAfterLoad from 'hooks/useValueAfterLoad';

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
          <DeleteOutline />
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

const STSRC = () => {
  const navigate = useNavigate();
  const [materialData, setMaterialData] = useState([]);
  const [materials, setMaterial] = useState([]);
  const [showData, setShowData] = useState({});
  const [view, setView] = useState(false);
  const [viewMaterial, setViewMaterial] = useState(false);
  const [showMaterial, setShowMaterial] = useState(false);
  const [update, setUpdate] = useState(false);
  const [pending, setPending] = useState(false);
  const [formData, setFormData] = useState(null);
  const [disableAll, setDisableAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [alreadySelectedLocations, setAlreadySelectedLocations] = useState([]);

  const { pathname } = useLocation();
  useEffect(() => {
    setMaterial([]);
    setDisableAll(false);
  }, [pathname]);

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
  useEffect(() => {
    dispatch(getMasterMakerLov());
  }, [dispatch]);
  const { masterMakerLovs } = useMasterMakerLov();
  const transactionTypeData = masterMakerLovs.masterMakerLovsObject.rows;

  const fetchTransactionType = (data, type) => {
    const res = data && data.filter((obj) => obj.name === type);
    return res && res.length ? res[0].id : undefined;
  };

  const companyId = fetchTransactionType(transactionTypeData, 'COMPANY');

  useEffect(() => {
    if (companyId) dispatch(getCompanyStoreLocations({ organizationType: companyId }));
  }, [dispatch, companyId]);

  const onBack = useCallback(() => {
    setFormData(null);
    setDisableAll(false);
    setViewMaterial(false);
    setShowMaterial(false);
    setPending(false);
  }, []);

  const handleRowUpdate = (row) => {
    setView(false);
    setUpdate(true);
    setShowData(row);
    setPending(true);
  };

  const handleRowDelete = (ind, vl) => {
    if (materialData) {
      const liData = materialData.filter((_, index) => index !== ind);
      let locData = liData.map((val) => val.fromStoreLocationId);
      setMaterialData(liData);
      setAlreadySelectedLocations(locData);
      delete selectedItems[vl.materialId + vl.fromStoreLocationId];
    }
  };

  const { transactionMaterialList } = useStockLedger();

  useEffect(() => {
    if (transactionMaterialList?.stocksObject) setMaterial(transactionMaterialList?.stocksObject);
  }, [transactionMaterialList?.stocksObject]);

  const getMaterials = (values, id) => {
    if (id) {
      let matData = materials;
      matData.map((val) => {
        let newVal = {};
        if (val.id === values.materialId) {
          newVal = { ...val, ...values };
          newVal.uomId = values?.uomId;
          setAlreadySelectedLocations((prev) => [...prev, newVal.fromStoreLocationId]);
          const index = materialData.findIndex(
            (item) => item.materialId === id && values?.fromStoreLocationId === item?.fromStoreLocationId
          );
          let newValue = {
            ...newVal
          };
          if (index >= 0) {
            const updatedList = [...materialData];
            updatedList[index] = newValue;
            setMaterialData(updatedList);
          } else {
            setMaterialData(materialData.concat(newValue));
          }
        }
      });
      setUpdate(false);
    }
  };

  const materialInput = (values, id, key) => {
    getMaterials(values, id);
    const alreadySelectedItems = selectedItems;
    if (!alreadySelectedItems[key]) alreadySelectedItems[key] = {};
    alreadySelectedItems[key] = values;
    setSelectedItems(alreadySelectedItems);
  };

  const saveData = (formValues) => {
    if (formValues && formValues.projectId && formValues.fromProjectSiteStoreId) {
      setViewMaterial(true);
      setShowMaterial(true);
      dispatch(
        getTransactionMaterialList({
          project: formValues.projectId,
          store: formValues.fromProjectSiteStoreId
        })
      );
      setFormData(formValues);
    }
  };

  const makeRequest = () => {
    const {
      transactionTypeId,
      projectId,
      organizationId,
      fromProjectSiteStoreId,
      toStoreLocationId,
      supplierId,
      placeOfSupply,
      vehicleNumber,
      eWayBillNumber,
      eWayBillDate,
      remarks
    } = formData;
    return {
      transactionTypeId,
      supplierId,
      placeOfSupply,
      vehicleNumber,
      ...(eWayBillNumber && eWayBillNumber !== '' && { eWayBillNumber }),
      ...(eWayBillNumber && eWayBillNumber !== '' && eWayBillDate && eWayBillDate !== '' && { eWayBillDate }),
      remarks,
      stock_ledgers:
        materialData?.map((stockData) => {
          const value = parseFloat(stockData.quantity) * stockData.rate;

          return {
            transactionTypeId: transactionTypeId,
            projectId: projectId,
            organizationId: organizationId,
            storeId: fromProjectSiteStoreId,
            storeLocationId: toStoreLocationId,
            fromStoreLocationId: stockData?.fromStoreLocationId,
            materialId: stockData.id,
            uomId: stockData.uom_id,
            quantity: stockData.quantity,
            rate: stockData.rate,
            value: value,
            tax: stockData.tax,
            remarks,
            serialNumber: stockData.material_serial_numbers
          };
        }) || []
    };
  };

  const onFormSubmit = async () => {
    setPending(true);
    const payload = makeRequest();
    const resp = await request('/location-to-other-location', { method: 'POST', body: payload });

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
    setTimeout(() => {
      setPending(false);
    }, 100);
    navigate('/stsrc-receipt');
  };

  const addActions = (arr) => {
    let narr = [];
    arr &&
      arr.length > 0 &&
      arr.map((val, ind) => {
        narr.push({
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
        });
      });

    return narr;
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
  }, [onBack, transactionLoaded]);

  return (
    <>
      <CreateNewSTSRC onClick={onBack} saveData={saveData} disableAll={disableAll} setDisableAll={setDisableAll} />
      {showMaterial && materials && materials.length > 0 && (
        <MaterialInputs
          // onMaterailsInput={materialInput}
          onMaterailsInput={(values, id, key) => {
            materialInput(values, id);
            const alreadySelectedItems = selectedItems;
            if (!alreadySelectedItems[key]) alreadySelectedItems[key] = {};
            alreadySelectedItems[key] = values;
            setSelectedItems(alreadySelectedItems);
            setPending(false);
          }}
          storeLocationData={formData?.storeLocationData}
          formData={formData}
          view={view}
          update={update}
          showData={showData}
          materials={materials}
          selectedLocations={alreadySelectedLocations}
          selectedItems={selectedItems}
        />
      )}
      {viewMaterial && materialData && materialData.length > 0 && (
        <>
          <TableForm
            title="STSRC"
            hideHeader
            hidePagination
            data={addActions(materialData)}
            count={materialData.length}
            columns={subColumns}
            hideActions={true}
          />
          <FormProvider>
            <Grid container spacing={4}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', mt: 2 }}>
                <Button onClick={onBack} size="small" variant="outlined" color="primary">
                  Back
                </Button>
                <Button disabled={pending} onClick={onFormSubmit} size="small" variant="contained" color="primary">
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

export default STSRC;
