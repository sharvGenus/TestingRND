import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import {
  Grid,
  Button
  //  Stack
} from '@mui/material';

// third party
import * as Yup from 'yup';

// assets

// project import
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { getMasterMakerLov } from '../../../store/actions/masterMakerLovAction';
import { useMasterMaker } from '../master-maker/useMasterMaker';
import request from '../../../utils/request';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import { getMasterMaker } from 'store/actions';
import toast from 'utils/ToastNotistack';

const CreateNewMasterLOV = (props) => {
  const { onClick, data, view, update, refreshPagination } = props;
  const [selectedMaster, setSelectedMaster] = useState('');
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape(
        selectedMaster === 'STORE LOCATION'
          ? {
              masterId: Validations.masterMaker,
              name: Validations.lov,
              code: Validations.masterCode
            }
          : {
              masterId: Validations.masterMaker,
              name: Validations.lov
            }
      )
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue } = methods;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMasterMaker());
  }, [dispatch]);
  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        setValue(fieldName, value);
      });
    };
    if (view || update) handleSetValues(data);
    if (data?.master_maker && data?.master_maker?.name === 'STORE LOCATION') setSelectedMaster('STORE LOCATION');
    else setSelectedMaster('');
  }, [data, update, view, setValue]);

  const { masterMakers } = useMasterMaker();

  const onFormSubmit = async (values) => {
    let response;

    if (update) {
      response = await request('/master-maker-lov-update', { method: 'PUT', body: values, params: data.id });
    } else {
      response = await request('/master-maker-lov-form', { method: 'POST', body: values });
    }

    if (response.success) {
      const successMessage = update ? 'Master Maker LOV updated successfully!' : 'Master Maker LOV added successfully!';
      toast(successMessage, { variant: 'success', autoHideDuration: 10000 });
      refreshPagination();
      dispatch(getMasterMakerLov());
      onClick();
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  const masterData = masterMakers.masterMakerObject?.rows || [];

  const selectBox = (name, label, menus, req, onChange) => {
    return (
      <RHFSelectbox
        name={name}
        label={label}
        InputLabelProps={{ shrink: true }}
        menus={menus}
        onChange={onChange}
        {...(req && { required: true })}
        {...(view ? { disable: true } : update ? { disable: false } : {})}
      />
    );
  };

  const txtBox = (name, label, type, req, shrink = true) => {
    return (
      <RHFTextField
        name={name}
        type={type}
        label={label}
        InputLabelProps={{ shrink: shrink }}
        {...(req && { required: true })}
        {...(view ? { disabled: true } : update ? { disabled: false } : {})}
      />
    );
  };

  const onMasterSelected = (e) => {
    if (e?.target?.name) setSelectedMaster(e?.target?.name);
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={(view ? `View ` : update ? 'Update ' : 'Add ') + 'Master LOV'}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              {selectBox('masterId', 'Master', masterData, true, onMasterSelected)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('name', 'LOV', 'text', true)}
            </Grid>
            {selectedMaster === 'STORE LOCATION' && (
              <Grid item md={3} xl={2}>
                {txtBox('code', 'Code', 'text', true)}
              </Grid>
            )}
          </Grid>
          <Grid container spacing={2} alignItems={'center'} sx={{ mt: 2 }}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
              <Button onClick={onClick} size="small" variant="outlined" color="primary">
                Back
              </Button>
              {!view && (
                <Button size="small" type="submit" variant="contained" color="primary">
                  {update ? 'Update' : 'Save'}
                </Button>
              )}
            </Grid>
          </Grid>
        </MainCard>
      </FormProvider>
    </>
  );
};

CreateNewMasterLOV.propTypes = {
  onClick: PropTypes.func,
  data: PropTypes.object,
  view: PropTypes.bool,
  update: PropTypes.bool,
  refreshPagination: PropTypes.func
};

export default CreateNewMasterLOV;
