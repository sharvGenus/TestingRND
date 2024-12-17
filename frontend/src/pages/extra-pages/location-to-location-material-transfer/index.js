import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Grid, IconButton, Tooltip } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useStockLedger } from '../stock-ledger/useStockLedger';
import CreateNewRequestLTL from './create-new-LTL-request';
import MaterialInputs from './material-inputs';
import TableForm from 'tables/table';
import { getTransactionMaterialList } from 'store/actions';
import { FormProvider } from 'hook-form';
import { isMissingStoreLocation } from 'utils';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
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
    accessor: 'uomName'
  },
  {
    Header: 'From Store Location',
    accessor: 'fromStoreLocationName'
  }
];

const MaterialTransferLocationToLocationRequest = () => {
  const navigate = useNavigate();
  const [materialData, setMaterialData] = useState([]);
  const [materialDataList, setMaterialDataList] = useState([]);
  const [showData, setShowData] = useState({});
  const [view, setView] = useState(false);
  const [viewMaterial, setViewMaterial] = useState(false);
  const [update, setUpdate] = useState(false);
  const [formData, setFormData] = useState(null);
  const [filterStoreLocation, setfilterStoreLocationData] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [alreadySelectedLocations, setAlreadySelectedLocations] = useState([]);
  const [serialNumber, setSerialNumber] = useState(null);
  const [openSerialNumber, setOpenSerialNumber] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [companyStoreLocationData, setCompanyStoreLocationData] = useState([]);
  const dispatch = useDispatch();

  const filteredFilterStoreLocations =
    filterStoreLocation && filterStoreLocation.filter((item) => item.organizationStoreId === formData?.projectSiteStoreId);

  const onBack = () => {
    setUpdate(false);
    setMaterialDataList([]);
    setMaterialData([]);
    setMaterialDataList([]);
  };

  const handleRowUpdate = (row) => {
    setView(false);
    setUpdate(true);
    setShowData(row);
  };

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
            id: mat.id,
            name: mat.name,
            isSerialNumber: mat.is_serial_number,
            quantity: mat.quantity,
            tax: mat.tax,
            value: mat.value,
            uomName: mat.uom_name,
            uomId: mat.uom_id,
            rate: parseFloat(mat.rate).toFixed(2),
            code: mat.code,
            hsnCode: mat.hsn_code,
            uom: mat.uom
          });
        });
      // respMaterials.map((val) => {
      //   val.actions = <Actions values={val} onEdit={handleRowUpdate} />;
      // });
      if (respMaterials.length === 0) toast('No Material Available', { variant: 'error' });
      return respMaterials;
    };

    if (materials && materials.length > 0) {
      setMaterialData(filterMaterials(materials));
    }
  }, [materials]);

  // const filterLocationId = (fId) => {
  //   const filteredValue = companyStoreLocationData.filter((locationData) => locationData.id === fId);
  //   return filteredValue[0].name;
  // };

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
  const materialInput = (values, id, key) => {
    getMaterials(values, id);
    const alreadySelectedItems = selectedItems;
    if (!alreadySelectedItems[key]) alreadySelectedItems[key] = {};
    alreadySelectedItems[key] = values;
    setSelectedItems(alreadySelectedItems);
  };
  const saveData = (formValues) => {
    if (formValues && formValues.projectId && formValues.projectSiteStoreId) {
      dispatch(getTransactionMaterialList({ project: formValues.projectId, store: formValues.projectSiteStoreId }));
      setFormData(formValues);
      setViewMaterial(true);
    }
  };

  const onSelectedStoreLocation = (e) => {
    if (e?.target?.value) setfilterStoreLocationData(companyStoreLocationData.filter((x) => x.id !== e.target.value));
  };

  const makeRequest = (values) => {
    const { transactionTypeId, projectId, organizationId, projectSiteStoreId, remarks } = values;
    return {
      transactionTypeId,
      remarks,
      stock_ledgers:
        materialDataList?.map((stockData) => {
          const value = stockData.quantity * stockData.rate;

          return {
            transactionTypeId: transactionTypeId,
            projectId: projectId,
            organizationId: organizationId,
            storeId: projectSiteStoreId,
            storeLocationId: values?.toOrganizationStoreLocationId,
            fromStoreLocationId: stockData?.fromStoreLocationId,
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
    const payload = makeRequest(formData);

    if (payload.stock_ledgers?.length === 0) {
      toast('Please have atleast one material with some quantity', { variant: 'error' });
      return;
    }

    if (isMissingStoreLocation(payload?.stock_ledgers, 'fromStoreLocationId')) {
      return;
    }
    const resp = await request('/location-to-other-location', { method: 'POST', body: payload, timeoutOverride: 120000 });

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

    navigate('/ltl-receipt');
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

  const transactionLoaded = useValueAfterLoad({
    dataObject: transactionMaterialList,
    key: 'stocksObject'
  });

  useEffect(() => {
    if (Array.isArray(transactionLoaded) && transactionLoaded.length === 0) {
      onBack();
      toast('There are no available materials for your selected combination', { variant: 'error' });
    }
  }, [transactionLoaded]);

  return (
    <>
      <CreateNewRequestLTL
        disableAll={viewMaterial && !!materialData?.length}
        onClick={onBack}
        saveData={saveData}
        onSelectedStoreLocation={onSelectedStoreLocation}
        setLocations={(vl) => {
          setCompanyStoreLocationData(vl);
        }}
      />
      {materialData && viewMaterial && materialData.length > 0 && (
        <>
          <MaterialInputs
            materialData={materialData}
            onMaterailsInput={materialInput}
            storeLocationData={filteredFilterStoreLocations}
            view={view}
            hideTaxDetails
            update={update}
            showData={showData}
            formData={formData}
            selectedLocations={alreadySelectedLocations}
            selectedItems={selectedItems}
          />

          {(!materialDataList || materialDataList.length === 0) && (
            <>
              <Grid container spacing={4}>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', mt: 3 }}>
                  <Button onClick={onBack} size="small" variant="outlined" color="primary">
                    Back
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
        </>
      )}
      {materialDataList && materialDataList.length > 0 && (
        <>
          <TableForm
            title="Material Transfer Location To Location Request"
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

export default MaterialTransferLocationToLocationRequest;
