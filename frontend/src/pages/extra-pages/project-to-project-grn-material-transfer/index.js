import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Grid, IconButton, Tooltip } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { useOrganizationStoreLocation } from '../organization-store-location/useOrganizationStoreLocation';
import CreateNewTransfer from './create-new-transfer';
import MaterialInputs from './material-inputs';
import TableForm from 'tables/table';
import { FormProvider } from 'hook-form';
import { getCompanyStoreLocations } from 'store/actions/organizationStoreLocationActions';
import { isMissingStoreLocation } from 'utils';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';

const Actions = ({ values, onEdit }) => {
  return (
    <div>
      <Tooltip title="Edit" placement="bottom">
        <IconButton color="secondary" onClick={() => onEdit(values)}>
          <EditOutlinedIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

Actions.propTypes = {
  values: PropTypes.any,
  onEdit: PropTypes.func
};

const MaterialTransferProjectToProjectGrnRequest = () => {
  const navigate = useNavigate();
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
        accessor: 'storeLocation.name'
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
  };

  const filteredCompanyStoreLocationData = companyStoreLocationData.filter((val) => val.organization_store?.id === showData?.store?.id);

  const handleRowUpdate = (row) => {
    setView(false);
    setUpdate(true);
    setShowData(row);
  };

  const getSerials = (arr) => {
    let newArr = [];
    arr &&
      arr.length > 0 &&
      arr.map((val) => {
        newArr.push(typeof val === 'object' ? val.serialNumber : val);
      });
    return newArr;
  };

  useEffect(() => {
    const filterMaterials = (materialsData) => {
      const respMaterials = [];
      materialsData &&
        materialsData.map((mat) => {
          respMaterials.push({
            id: mat?.id,
            materialId: mat?.material?.id,
            name: mat?.material?.name,
            isSerialNumber: mat?.material?.isSerialNumber,
            quantity: -mat.quantity,
            referenceDocumentNumber: mat.referenceDocumentNumber,
            tax: mat?.tax,
            value: mat?.value,
            uomName: mat?.uom?.name,
            uomId: mat?.uom?.id,
            rate: parseFloat(mat.rate).toFixed(2),
            code: mat?.material?.code,
            hsnCode: mat?.material?.hsnCode,
            uom: mat?.uom,
            store: mat?.other_store,
            project: formData?.projectId,
            fromStoreLocationId: mat?.organization_store_location?.id,
            material_serial_numbers: mat?.material_serial_numbers
          });
        });
      return respMaterials;
    };

    if (formData?.materials && formData?.materials.length > 0) {
      setMaterialDataList(filterMaterials(formData?.materials));
    }
  }, [formData]);

  const getMaterials = (values) => {
    if (update && values.index >= 0) {
      const matData = materialDataList;
      matData[values.index] = { ...values };
      setMaterialDataList(matData);
    }
    setUpdate(false);
  };

  const getIds = (arr) => {
    const respIds = [];
    arr && arr.length > 0 && arr.map((vl) => respIds.push(vl.id));
    return respIds;
  };

  const saveData = (formValues) => {
    setFormData(formValues);
    setViewMaterial(true);
  };

  const onFormSubmit = async () => {
    const payload = {
      transactionTypeId: formData?.transactionTypeId,
      requestIds: getIds(materialDataList),
      remarks: formData?.remarks,
      placeOfSupply: formData?.placeOfSupply,
      ...(formData?.eWayBillNumber && { eWayBillNumber: formData?.eWayBillNumber }),
      ...(formData?.eWayBillDate && formData?.eWayBillDate !== '' && { eWayBillDate: formData?.eWayBillDate }),
      vehicleNumber: formData?.vehicleNumber,
      stock_ledgers: materialDataList.map((val) => ({
        transactionTypeId: formData?.transactionTypeId,
        requestNumber: val.referenceDocumentNumber,
        organizationId: val?.store?.organization?.parentId ?? val?.store?.organization?.id,
        projectId: formData?.toProjectId,
        otherProjectId: formData?.fromProjectId,
        storeId: formData?.toStoreId,
        otherStoreId: formData?.fromStoreId,
        storeLocationId: val?.storeLocationId,
        otherStoreLocationId: val?.fromStoreLocationId,
        materialId: val?.materialId,
        uomId: val?.uomId,
        quantity: val?.quantity,
        rate: val?.rate,
        value: val?.value,
        tax: val?.tax,
        serialNumber: getSerials(val?.material_serial_numbers)
      }))
    };

    if (isMissingStoreLocation(payload?.stock_ledgers, 'storeLocationId')) return;
    const resp = await request('/project-to-project-grn-create', { method: 'POST', body: { ...payload } });
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

    navigate('/ptp-grn-receipt');
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
        />
      )
    }));
    return tbl;
  };

  return (
    <>
      <CreateNewTransfer onClick={onBack} saveData={saveData} />
      {update && (
        <MaterialInputs
          // materialData={materialData}
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
            title="Material Transfer Project To Project"
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

export default MaterialTransferProjectToProjectGrnRequest;
