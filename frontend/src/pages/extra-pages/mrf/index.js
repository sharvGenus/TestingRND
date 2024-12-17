import { useMemo, useRef, useState } from 'react';
import { Button, Grid, IconButton, Tooltip } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import CreateNewMRF from './create-new-mrf';
import TableForm from 'tables/table';
import { FormProvider } from 'hook-form';
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

const MRF = () => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [showData, setShowData] = useState(null);
  const [view, setView] = useState(false);
  const [update, setUpdate] = useState(false);
  const [requestData, setRequestData] = useState([]);

  const ref = useRef();

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
        accessor: 'uom'
      },
      {
        Header: 'To Store Location',
        accessor: 'storeLocation.name'
      }
    ],
    []
  );
  const [showAdd, setShowAdd] = useState(false);

  const onBack = () => {
    setShowAdd(!showAdd);
    setMaterials([]);
    setUpdate(false);
    setView(false);
    setShowData(null);
    ref.current.reset();
  };

  const handleRowUpdate = (row) => {
    setView(false);
    setUpdate(true);
    setShowData(row);
  };

  const handleRowDelete = (id, ind) => {
    if (materials) {
      const liData = materials.filter((_, index) => index !== ind);
      setMaterials(liData);
      setTimeout(() => {
        let newSet = [];
        liData.map((val) => newSet.push(val.materialId));
        setSelectedMaterials(newSet);
      }, 100);
    }
  };

  const getMaterials = (materialData, id) => {
    // if (id && update) {
    //   setMaterials((values) =>
    //     values.map((val) => {
    //       return val.id === id ? (val = materialData) : val;
    //     })
    //   );
    //   setUpdate(false);
    // } else {
    if (materials) {
      const existingMaterial = materials.findIndex(
        (item) => item.materialId === materialData?.materialId && item?.toStoreLocationId === materialData?.toStoreLocationId
      );
      if (existingMaterial > -1) {
        const updatedList = structuredClone(materials);
        const newData = {
          ...materialData,
          id: existingMaterial.toString(),
          requestedQuantity: id
            ? materialData?.requestedQuantity
            : materialData?.requestedQuantity + updatedList[existingMaterial]?.requestedQuantity
        };
        updatedList[existingMaterial] = newData;
        setMaterials(updatedList);
      } else {
        materialData.id = materials.length.toString();
        setMaterials(materials.concat(materialData));
      }
    }
    // }
    if (id) setUpdate(false);
    setSelectedMaterials(selectedMaterials.concat(materialData.materialId));
  };

  // const handleRowView = (row) => {
  //   setView(true);
  //   setUpdate(false);
  //   setShowData(row);
  // };

  const saveData = (formValues) => {
    if (formValues?.contractorEmployeeId === '') {
      formValues.contractorEmployeeId = null;
    }
    setRequestData(formValues);
  };
  const onFormSubmit = async () => {
    const reqData = materials.map((val) => {
      const value = val;
      delete value.id;
      return { ...value, requestName: 'MRF', ...requestData, rate: val?.rate || 0, value: val?.value || 0, tax: val?.tax || 0 };
    });
    const resp = await request('/request-create', { method: 'POST', body: { payload: reqData } });

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

    navigate('/mrf-receipt');
  };

  const addActions = (arr) => {
    const list = [];
    arr.map((val, index) => {
      list.push({
        ...val,
        actions: (
          <Actions
            values={val}
            onEdit={handleRowUpdate}
            onDelete={(id) => {
              handleRowDelete(id, index);
            }}
          />
        )
      });
    });
    return list;
  };

  return (
    <>
      <CreateNewMRF
        ref={ref}
        getMaterialList={getMaterials}
        materials={materials}
        view={view}
        update={update}
        showData={showData}
        saveData={saveData}
      />
      {materials && materials.length > 0 && (
        <>
          <TableForm
            title="MRF"
            hideHeader
            hidePagination
            data={addActions(materials)}
            count={materials.length}
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

export default MRF;
