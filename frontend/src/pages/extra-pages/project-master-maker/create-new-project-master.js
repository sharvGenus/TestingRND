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

const CreateNewProjectMaster = (props) => {
  const { data, view, update, setRefresh, refreshPagination, setSelectedProject, projectData } = props;
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project,
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
      projectId: formValues.projectId
    });
  }, [setRefresh, methods, getValues]);

  useEffect(() => {
    const handleSetValues = (fieldValues) => {
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        setValue(fieldName, value);
      });
    };
    if (!data) {
      handleBack();
    }
    if (view || update) {
      setValue('projectId', data?.project?.id);
      handleSetValues(data);
    }
    clearErrors();
  }, [data, update, view, setValue, clearErrors, handleBack]);

  const handleProjectId = (e) => {
    setSelectedProject(e?.target?.value);
  };

  const onFormSubmit = async (values) => {
    let response;

    if (update) {
      response = await request('/project-master-maker-update', { method: 'PUT', body: values, params: data.id });
    } else {
      response = await request('/project-master-maker-form', { method: 'POST', body: values });
    }

    if (response.success) {
      const successMessage = update ? 'Project Master Maker updated successfully!' : 'Project Master Maker added successfully!';
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
        <MainCard title={(view ? `View ` : update ? 'Update ' : 'Add ') + 'Project Master'} sx={{ mb: 2 }}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              {selectBox('projectId', 'Project Name', projectData, true, handleProjectId)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('name', 'Master Name', 'text', true)}
            </Grid>
            <Grid item md={6} xl={2} sx={{ mt: 4 }}>
              {!view ? (
                update ? (
                  <Grid item sx={{ display: 'flex', gap: '20px' }}>
                    <Button size="small" type="submit" variant="contained" color="primary">
                      Update
                    </Button>
                    <Button onClick={handleBack} size="small" variant="outlined" color="primary">
                      Back
                    </Button>
                  </Grid>
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

CreateNewProjectMaster.propTypes = {
  onClick: PropTypes.func,
  projectData: PropTypes.object,
  setRefresh: PropTypes.func,
  data: PropTypes.object,
  setSelectedProject: PropTypes.func,
  selectedProject: PropTypes.string,
  view: PropTypes.bool,
  refreshPagination: PropTypes.func,
  update: PropTypes.bool
};

export default CreateNewProjectMaster;
