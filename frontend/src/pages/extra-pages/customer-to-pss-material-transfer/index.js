import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Grid, IconButton, Tooltip } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { DeleteOutline } from '@mui/icons-material';
// import { useStockLedger } from '../stock-ledger/useStockLedger';
import { useMasterMakerLov } from '../master-maker-lov/useMasterMakerLov';
import CreateNewCTS from './create-new-cts';
import MaterialInputs from './material-input';
import TableForm from 'tables/table';
import {
  getMasterMakerLov
  // getTransactions
} from 'store/actions';
import { FormProvider } from 'hook-form';
import { getCompanyStoreLocations } from 'store/actions/organizationStoreLocationActions';
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

const SRCTS = () => {
  const navigate = useNavigate();
  const [materialData, setMaterialData] = useState([]);
  const [materials, setMaterial] = useState([]);
  const [showData, setShowData] = useState({});
  const [view, setView] = useState(false);
  const [viewMaterial, setViewMaterial] = useState(false);
  const [update, setUpdate] = useState(false);
  const [formData, setFormData] = useState(null);
  const [disableAll, setDisableAll] = useState(false);
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
        accessor: 'material.name'
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
        Header: 'To Store Location',
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

  const onBack = () => {
    setFormData(null);
    setDisableAll(!disableAll);
  };

  const handleRowUpdate = (row) => {
    setView(false);
    setUpdate(true);
    setShowData(row);
  };

  const handleRowDelete = (ind, vl) => {
    if (materialData) {
      const liData = materialData.filter((_, index) => index !== ind);
      let locData = liData.map((val) => val.toStoreLocationId);
      setMaterialData(liData);
      setAlreadySelectedLocations(locData);
      delete selectedItems[vl.materialId + vl.toStoreLocationId];
    }
  };

  // const { transaction } = useStockLedger();

  // useEffect(() => {
  //   if (transaction?.stocksObject) setMaterial(transaction?.stocksObject);
  // }, [transaction?.stocksObject]);

  const getMaterials = (values, id) => {
    if (id) {
      let matData = materials;
      matData.map((val) => {
        let newVal = {};
        if (val.material.id === values.materialId) {
          newVal = { ...val, ...values };
          newVal.uomId = val?.uomId;
          setAlreadySelectedLocations((prev) => [...prev, newVal.toStoreLocationId]);
          const index = materialData.findIndex((item) => item.materialId === id);
          let newValue = {
            ...newVal
          };
          if (index >= 0) {
            const updatedList = [...materialData];
            updatedList[index] = newValue;
            setMaterialData(updatedList.filter((vl) => vl.id !== '84b473e1-62bb-4afe-af56-1691bdffbc55'));
          } else {
            setMaterialData(materialData.filter((vl) => vl.id !== '84b473e1-62bb-4afe-af56-1691bdffbc55').concat(newValue));
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
      // dispatch(
      //   getTransactions({
      //     project: formValues.projectId,
      //     store: formValues.fromProjectSiteStoreId
      //   })
      // );
      setMaterial(formValues.materials);
      setFormData(formValues);
    }
  };

  const getStockIds = (arr) => {
    let stockIds = [];
    arr &&
      arr.length > 0 &&
      arr.map((vl) => {
        if (vl.quantity === vl.qtyStk) stockIds.push(vl.id);
      });
    return stockIds;
  };

  const makeRequest = () => {
    const {
      transactionTypeId,
      projectId,
      organizationId,
      fromProjectSiteStoreId,
      eWayBillNumber,
      eWayBillDate,
      placeOfSupply,
      transporterName,
      contactNumber,
      vehicleNumber,
      lrNumber,
      remarks
    } = formData;
    return {
      transactionTypeId,
      eWayBillNumber,
      eWayBillDate,
      transporterName,
      transporterContactNumber: contactNumber,
      vehicleNumber,
      placeOfSupply,
      lrNumber,
      remarks,
      fromOrganizationId: organizationId,
      fromStoreId: fromProjectSiteStoreId,
      requestNumber: materialData?.[0]?.requestNumber,
      stockLedgerIds: getStockIds(materialData),
      stock_ledgers:
        materialData?.map((stockData) => {
          const value = parseFloat(stockData.quantity) * stockData.rate;

          return {
            transactionTypeId: transactionTypeId,
            projectId: projectId,
            organizationId:
              stockData?.other_store?.organization?.parentId && stockData?.other_store?.organization?.parentId !== null
                ? stockData?.other_store?.organization?.parentId
                : stockData?.other_store?.organization?.id,
            storeId: stockData.otherStoreId,
            storeLocationId: stockData.toStoreLocationId,
            materialId: stockData.materialId,
            uomId: stockData.uomId,
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
    const payload = makeRequest();
    const resp = await request('/stc-create', { method: 'POST', body: payload });

    if (!resp.success) {
      toast(resp?.error?.message || 'Operation failed. Please try again!', { variant: 'error' });
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

    navigate('/cts-receipt');
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

  return (
    <>
      <CreateNewCTS onClick={onBack} saveData={saveData} disableAll={disableAll} setDisableAll={setDisableAll} />
      {materials && materials.length > 0 && (
        <MaterialInputs
          // onMaterailsInput={materialInput}
          onMaterailsInput={(values, id, key) => {
            materialInput(values, id, key);
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
            title="SRCTS"
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

export default SRCTS;
