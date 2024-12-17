import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Divider, Grid, Typography, useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { getFormAttributes, getMasterMakerProjects } from 'store/actions';
import { FormProvider, RHFSelectbox } from 'hook-form';
import { formAttributesSlice, formDetailSlice } from 'store/reducers/formMasterSlice';
import TableForm from 'tables/table';
import ConfirmModal from 'components/modal/ConfirmModal';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import Validations from 'constants/yupValidations';
import { useProjectMasterMaker } from 'pages/extra-pages/project-master-maker/useProjectMasterMaker';

const AddInventoryMapping = ({ formId, screen, setScreen, columnData, formHeaderData }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [inventoryArray, setInventoryArray] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState(null);
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        consumerName: Validations.other,
        kNumber: Validations.other,
        brandMasterId: Validations.other
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue } = methods;

  useEffect(() => {
    if (formId) {
      dispatch(getFormAttributes({ formId, sortBy: 'rank', sortOrder: 'ASC' }));
    }
    return () => {
      dispatch(formAttributesSlice.actions.reset());
      dispatch(formDetailSlice.actions.reset());
    };
  }, [dispatch, formId]);

  useEffect(() => {
    if (formHeaderData?.projectId) {
      dispatch(
        getMasterMakerProjects({
          selectedProject: formHeaderData?.projectId
        })
      );
    }
  }, [dispatch, formHeaderData]);

  const { masterMakerProjects } = useProjectMasterMaker();
  const mastersData = masterMakerProjects?.masterMakerProjectsObject?.rows || [];

  useEffect(() => {
    if (formHeaderData?.properties?.materialArray) {
      const updatedInventoryArray = formHeaderData.properties.materialArray?.map((x, i) => ({ ...x, index: i }));
      setInventoryArray(updatedInventoryArray);
      setValue('brandMasterId', formHeaderData.properties.brandMasterId);
      setValue('consumerName', formHeaderData.properties.consumerName);
      setValue('kNumber', formHeaderData.properties.kNumber);
    }
  }, [formHeaderData, setValue]);

  const columns = [
    {
      Header: 'Serial Number',
      accessor: (list) => columnData?.find((x) => x.id == list.serialNumberId)?.name
    },
    {
      Header: 'Capitalize',
      accessor: (list) => (list.capitalize === 'true' ? 'Yes' : list.capitalize === 'false' ? 'No' : '-')
    },
    {
      Header: 'Brand Name',
      accessor: (list) => columnData?.find((x) => x.id == list.brandName)?.name
    },
    {
      Header: 'Non-Serial Material',
      accessor: (list) => columnData?.find((x) => x.id == list.nonSerializeMaterialId)?.name
    },
    {
      Header: 'Quantity',
      accessor: (list) => columnData?.find((x) => x.id == list.quantity)?.name
    }
  ];

  const onFormSubmit = async (values) => {
    values.formId = formId;
    values.properties = {
      projectId: formHeaderData?.projectId,
      installerId: '',
      brandMasterId: values.brandMasterId,
      consumerName: values.consumerName,
      kNumber: values.kNumber,
      // eslint-disable-next-line no-unused-vars
      materialArray: inventoryArray
        ?.filter((x) => x.isActive)
        ?.map(({ brandName, ...rest }) => {
          delete rest.index;
          return {
            ...rest,
            brandName: brandName === '' ? 'null' : brandName
          };
        })
    };
    const response = await request('/form-update-data-mapping', { method: 'PUT', body: values });
    if (response.success) {
      toast(response.data.message, { variant: 'success', autoHideDuration: 3000 });
      setScreen({ ...screen, default: 1, inventoryMapping: 0 });
    } else {
      toast(response.error.message, { variant: 'error', autoHideDuration: 3000 });
    }
  };

  const confirmDelete = () => {
    const { index } = deleteInfo;
    const cloneFiltered = structuredClone(inventoryArray);
    cloneFiltered[index].isActive = null;
    setInventoryArray(cloneFiltered.map((x, i) => ({ ...x, index: i })));
    setOpenDeleteModal(false);
  };

  const fitleredInventoryArray = useMemo(() => {
    return inventoryArray.filter((item) => item?.isActive);
  }, [inventoryArray]);

  const handleDeleteField = async (row) => {
    setDeleteInfo(row);
    setOpenDeleteModal(true);
  };

  return (
    <Card
      sx={{
        maxHeight: '85vh',
        minHeight: '85vh',
        overflow: 'auto',
        border: '1px solid',
        borderRadius: 1,
        borderColor: theme.palette.grey.A800,
        boxShadow: 'inherit'
      }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <Grid sx={{ position: 'absolute', top: 0, width: '100%', background: 'white', zIndex: 10, p: 2, pb: 0 }}>
          <Grid container>
            <Grid item md={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h4">{formHeaderData?.name} &gt; Inventory Mapping</Typography>
              <Grid item sx={{ display: 'flex', gap: 2 }}>
                <Button
                  onClick={() => setScreen({ ...screen, default: 1, inventoryMapping: 0 })}
                  size="small"
                  variant="outlined"
                  color="primary"
                >
                  Back
                </Button>
                <Button size="small" type="submit" variant="contained" color="primary">
                  Save
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Divider sx={{ mt: 2 }} />
        </Grid>
        <Grid container sx={{ pt: 2, mt: 5 }}></Grid>
        <Grid container spacing={4} mt={1} mb={4} sx={{ pl: 4, pr: 4 }}>
          <Grid item md={3}>
            <RHFSelectbox
              name="brandMasterId"
              placeholder="Select Brand Master"
              label="Select Brand Master"
              menus={mastersData}
              required
              allowClear
            />
          </Grid>
          <Grid item md={3}>
            <RHFSelectbox
              name="consumerName"
              placeholder="Consumer Name Field"
              label="Consumer Name Field"
              menus={columnData?.filter((x) => x.isRequired)}
              required
              allowClear
            />
          </Grid>
          <Grid item md={3}>
            <RHFSelectbox
              name="kNumber"
              placeholder="K Number Field"
              label="K Number Field"
              menus={columnData?.filter((x) => x.isRequired)}
              required
              allowClear
            />
          </Grid>
        </Grid>
      </FormProvider>
      <SubForm setInventoryArray={setInventoryArray} columnData={columnData} />
      <Grid sx={{ pl: 4, pr: 4, pt: 2, mb: 4 }}>
        <TableForm
          hidePagination
          hideHistoryIcon
          hideViewIcon
          hideEditIcon
          hideHeader
          miniAction
          hideEmptyTable
          data={fitleredInventoryArray}
          columns={columns}
          count={fitleredInventoryArray?.length}
          handleRowDelete={handleDeleteField}
        />
      </Grid>
      <ConfirmModal
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        handleConfirm={confirmDelete}
        title="Delete Condition"
        message="Are you sure you want to delete?"
        confirmBtnTitle="Delete"
      />
    </Card>
  );
};

const SubForm = (props) => {
  const { setInventoryArray, columnData } = props;
  const methods = useForm({
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit } = methods;

  const onFormSubmit = async (values) => {
    if (
      (values.capitalize && !values.serialNumberId) ||
      (!values.capitalize && values.serialNumberId) ||
      (values.quantity && !values.nonSerializeMaterialId) ||
      (!values.quantity && values.nonSerializeMaterialId) ||
      (!values.capitalize && !values.quantity)
    ) {
      toast('Please fill all required fields.', { variant: 'error', autoHideDuration: 3000 });
    } else {
      values.isActive = true;
      setInventoryArray((pre) => [...pre, { ...values, index: pre.length }]);
      methods.reset();
    }
  };

  const capitalizeData = [
    {
      id: 'true',
      name: 'Yes'
    },
    {
      id: 'false',
      name: 'No'
    }
  ];

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
      <Grid container alignItems="center" sx={{ pl: 4, pr: 4 }}>
        <Grid container spacing={2} mb={1}>
          <Grid container item spacing={2} md={6.5}>
            <Grid item md={4}>
              <RHFSelectbox
                name="serialNumberId"
                placeholder="Serial Number Field"
                label="Serial Number Field"
                menus={columnData}
                required
                disable={methods.watch('nonSerializeMaterialId') || methods.watch('quantity')}
                allowClear
              />
            </Grid>
            <Grid item md={4}>
              <RHFSelectbox
                name="capitalize"
                placeholder="Capitalize"
                label="Capitalize"
                menus={capitalizeData}
                required
                disable={methods.watch('nonSerializeMaterialId') || methods.watch('quantity')}
                allowClear
              />
            </Grid>
            <Grid item md={4}>
              <RHFSelectbox
                name="brandName"
                placeholder="Brand Field"
                label="Brand Field"
                menus={columnData}
                disable={methods.watch('nonSerializeMaterialId') || methods.watch('quantity')}
                allowClear
              />
            </Grid>
          </Grid>
          <Grid item md={0.5} sx={{ display: 'flex', justifyContent: 'center', alignItem: 'center', mt: 4 }}>
            <Typography>OR</Typography>
          </Grid>
          <Grid item md={3}>
            <RHFSelectbox
              name="nonSerializeMaterialId"
              placeholder="Non-Serial Material Field"
              label="Non-Serial Material Field"
              menus={columnData}
              required
              disable={methods.watch('serialNumberId') || methods.watch('capitalize') || methods.watch('brandName')}
              allowClear
            />
          </Grid>
          <Grid item md={2}>
            <RHFSelectbox
              name="quantity"
              placeholder="Quantity Field"
              label="Quantity Field"
              menus={columnData}
              required
              disable={methods.watch('serialNumberId') || methods.watch('capitalize') || methods.watch('brandName')}
              allowClear
            />
          </Grid>
          <Grid item md={12} sx={{ display: 'grid', justifyContent: 'flex-end' }}>
            <Button variant="contained" size="small" color="primary" type="submit">
              Add
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

SubForm.propTypes = {
  columnData: PropTypes.array,
  setInventoryArray: PropTypes.func
};

AddInventoryMapping.propTypes = {
  formId: PropTypes.string,
  screen: PropTypes.object,
  setScreen: PropTypes.func,
  formHeaderData: PropTypes.object,
  columnData: PropTypes.array
};

export default AddInventoryMapping;
