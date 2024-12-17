import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, Button } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import request from '../../../utils/request';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import toast from 'utils/ToastNotistack';

const CreateNewQAMaster = (props) => {
  const { data, view, update, setRefresh, refreshPagination, setSelectedProject, setSelectedMeterType, projectData, meterTypeData } = props;
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.other,
        meterTypeId: Validations.other,
        name: Validations.name
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue, clearErrors, getValues } = methods;

  const handleBack = useCallback(() => {
    setRefresh();
    const formValues = getValues();
    methods.reset({
      name: '',
      projectId: formValues.projectId,
      meterTypeId: formValues.meterTypeId
    });
  }, [setRefresh, methods, getValues]);

  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        setValue(fieldName, value);
      });
    };
    // if (!data) {
    //   handleBack();
    // }
    if (view || update) {
      setValue('projectId', data?.project?.id);
      setValue('meterTypeId', data?.meterType?.id);
      handleSetValues(data);
    }
    clearErrors();
  }, [data, update, view, setValue, clearErrors, handleBack]);

  const handleProjectId = (e) => {
    setSelectedProject(e?.target?.value);
  };

  const handleMeterTypeId = (e) => {
    setSelectedMeterType(e?.target?.value);
  };

  const onFormSubmit = async (values) => {
    let response;

    if (update) {
      response = await request('/qa-master-maker-update', { method: 'PUT', body: values, params: data.id });
    } else {
      response = await request('/qa-master-maker-form', { method: 'POST', body: values });
    }

    if (response.success) {
      const successMessage = update ? 'QA Master Maker updated successfully!' : 'QA Master Maker added successfully!';
      toast(successMessage, { variant: 'success', autoHideDuration: 10000 });
      refreshPagination();
      handleBack();
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  const selectBox = (name, label, menus, req, onChange) => {
    return (
      <RHFSelectbox
        name={name}
        label={label}
        InputLabelProps={{ shrink: true }}
        menus={menus}
        onChange={onChange}
        {...(req && { required: true })}
        {...(view || update ? { disable: true } : {})}
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

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={(view ? `View ` : update ? 'Update ' : 'Add ') + 'QA Master'} sx={{ mb: 2 }}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              {selectBox('projectId', 'Project Name', projectData, true, handleProjectId)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('meterTypeId', 'Meter Type', meterTypeData || [], true, handleMeterTypeId)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('name', 'Master Name', 'text', true)}
            </Grid>
            <Grid item md={12} xl={6} sx={{ mt: 4, textAlign: 'right' }}>
              {!view ? (
                update ? (
                  <>
                    <Button style={{ marginRight: 20 }} size="small" type="submit" variant="contained" color="primary">
                      Update
                    </Button>
                    <Button onClick={handleBack} size="small" variant="outlined" color="primary">
                      Back
                    </Button>
                  </>
                ) : (
                  <Button size="small" type="submit" variant="contained" color="primary">
                    Save
                  </Button>
                )
              ) : (
                <Button onClick={handleBack} size="small" variant="outlined" color="primary">
                  Back
                </Button>
              )}
            </Grid>
          </Grid>
        </MainCard>
      </FormProvider>
    </>
  );
};

CreateNewQAMaster.propTypes = {
  onClick: PropTypes.func,
  projectData: PropTypes.any,
  meterTypeData: PropTypes.any,
  setRefresh: PropTypes.func,
  data: PropTypes.object,
  setSelectedProject: PropTypes.func,
  setSelectedMeterType: PropTypes.func,
  selectedProject: PropTypes.string,
  view: PropTypes.bool,
  refreshPagination: PropTypes.func,
  update: PropTypes.bool
};

export default CreateNewQAMaster;
