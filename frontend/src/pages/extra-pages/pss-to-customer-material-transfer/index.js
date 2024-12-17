import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Grid, IconButton, Tooltip } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useStockLedger } from '../stock-ledger/useStockLedger';
import CreateNewTransfer from './create-new-stc';
import MaterialInputs from './material-input';
import TableForm from 'tables/table';
import { getTransactionMaterialList } from 'store/actions';
import { FormProvider } from 'hook-form';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import { isMissingStoreLocation } from 'utils';
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

const MaterialTransferProjectSiteStoreToCustomer = () => {
  const navigate = useNavigate();
  const [materialData, setMaterialData] = useState([]);
  const [showData, setShowData] = useState({});
  const [materialDataList, setMaterialDataList] = useState([]);
  const [view, setView] = useState(false);
  const [viewMaterial, setViewMaterial] = useState(false);
  const [update, setUpdate] = useState(false);
  const [formData, setFormData] = useState(null);
  const [pending, setPending] = useState(false);
  const [disableAll, setDisableAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [alreadySelectedLocations, setAlreadySelectedLocations] = useState([]);
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
        Header: 'Rate',
        accessor: 'rate'
      },
      {
        Header: 'Tax',
        accessor: 'tax'
      },
      {
        Header: 'Value',
        accessor: 'value'
      },
      {
        Header: 'From Store Location',
        accessor: 'fromStoreLocationName'
      }
    ],
    []
  );

  const onBack = useCallback(() => {
    setFormData(null);
    setDisableAll(false);
  }, []);

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
      let locData = liData.map((val) => val.fromStoreLocationId);
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

  const { transactionMaterialList } = useStockLedger();

  const { materials } = useMemo(
    () => ({
      materials: transactionMaterialList?.stocksObject || [],
      count: transactionMaterialList?.stocksObject?.count || 0,
      loading: transactionMaterialList?.loading
    }),
    [transactionMaterialList]
  );

  const materialInput = (values, id, key) => {
    getMaterials(values, id);
    const alreadySelectedItems = selectedItems;
    if (!alreadySelectedItems[key]) alreadySelectedItems[key] = {};
    alreadySelectedItems[key] = values;
    setSelectedItems(alreadySelectedItems);
  };

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
            hsnCode: mat?.hsn_code
            // uom: mat.uom
            // material_serial_numbers: serialNumbersData[mat?.id] ? serialNumbersData[mat?.id] : []
          });
        });
      // respMaterials.map((val) => {
      //   val.actions = <Actions values={val} onEdit={handleRowUpdate} />;
      // });
      if (respMaterials.length === 0) toast('No Material Available', { variant: 'error' });
      return respMaterials;
    };

    if (materials && materials.length > 0) {
      setMaterialData(filterMaterials(materials).filter((vl) => vl.id !== '84b473e1-62bb-4afe-af56-1691bdffbc55'));
    }
  }, [materials]);

  // const filterLocationId = (fId) => {
  //   const filteredValue = companyStoreLocationData.filter((locationData) => locationData.id === fId);
  //   return filteredValue[0].name;
  // };

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
    if (formValues && formValues.projectId && formValues.projectSiteStoreId) {
      dispatch(getTransactionMaterialList({ project: formValues.projectId, store: formValues.projectSiteStoreId }));
      setFormData(formValues);
      setViewMaterial(true);
    }
  };

  const onFormSubmit = async () => {
    setPending(true);
    const {
      transactionTypeId,
      projectId,
      projectSiteStoreId,
      toCustomerId,
      customerSiteStoreId,
      eWayBillNumber,
      eWayBillDate,
      transporterName,
      contactNumber,
      vehicleNumber,
      lrNumber,
      remarks
    } = formData;

    var date = new Date();
    const payload = {
      transactionTypeId,
      eWayBillNumber,
      eWayBillDate,
      lrNumber,
      transporterName,
      transporterContactNumber: contactNumber,
      vehicleNumber,
      actualReceiptDate: date.toISOString(),
      remarks,
      fromOrganizationId: formData?.fromStoreDetails?.organization?.parentId
        ? formData?.fromStoreDetails?.organization?.parentId
        : formData?.fromStoreDetails?.organization?.id,
      fromStoreId: projectSiteStoreId,
      ...(formData?.placeOfSupply && { placeOfSupply: formData?.placeOfSupply }),
      stock_ledgers: materialDataList?.map((matItem) => {
        const { id: materialId, material_serial_numbers, fromStoreLocationId, quantity, rate, tax, uomId, value, willReturn } = matItem;

        return {
          transactionTypeId,
          organizationId: toCustomerId,
          projectId: projectId,
          fromStoreLocationId: fromStoreLocationId,
          storeId: customerSiteStoreId,
          materialId,
          willReturn,
          uomId,
          quantity,
          rate,
          value,
          tax,
          remarks,
          serialNumber: material_serial_numbers || []
        };
      })
    };

    if (payload.stock_ledgers?.length === 0) {
      toast('Please have atleast one material with some quantity', { variant: 'error' });
      setPending(false);
      return;
    }

    if (isMissingStoreLocation(payload?.stock_ledgers, 'fromStoreLocationId')) {
      setPending(false);
      return;
    }

    const resp = await request('/stc-create', { method: 'POST', body: payload, timeoutOverride: 120000 });

    if (!resp?.success) {
      toast(resp?.error?.message || 'Something wrong happened!', { variant: 'error' });
      setPending(false);
      return;
    }

    toast(`Transaction created with reference number: ${resp?.data?.data?.referenceDocumentNumber}`, {
      variant: 'success',
      autoHideDuration: 10000
    });

    setPending(false);
    navigate('/stc-receipt');
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
      {pending && <Loader />}
      <CreateNewTransfer onClick={onBack} saveData={saveData} disableAll={disableAll} setDisableAll={setDisableAll} />
      {formData && materialData && materialData.length > 0 && (
        <MaterialInputs
          materials={materialData}
          onMaterailsInput={materialInput}
          hideTaxDetails
          formData={formData}
          view={view}
          update={update}
          showData={showData}
          selectedLocations={alreadySelectedLocations}
          selectedItems={selectedItems}
        />
      )}
      {formData && materialDataList && viewMaterial && materialDataList.length > 0 && (
        <>
          <TableForm
            title="Material Transfer Company Store To Customer"
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

      {formData && materialDataList && materialDataList.length > 0 && (
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
      )}
    </>
  );
};

export default MaterialTransferProjectSiteStoreToCustomer;
