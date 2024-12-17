import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, Button } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import request from '../../../../utils/request';
import { FormProvider, RHFSelectbox, RHFTextField, RHFToggleButton } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import toast from 'utils/ToastNotistack';

const CreateNewRole = (props) => {
  const { data, view, update, setRefresh, setSelectedProject, projectData, refreshPagination } = props;
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project
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
      code: '',
      description: '',
      forTicket: false,
      addTicket: false,
      isImport: false,
      isExport: false,
      isUpdate: false,
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
      setValue('projectId', data.projectId);
      handleSetValues(data);
    }
    clearErrors();
  }, [data, update, view, setValue, clearErrors, handleBack]);

  const handleProjectId = (e) => {
    setSelectedProject(e?.target?.value);
  };

  const onFormSubmit = async (values) => {
    let response;
    if (update) response = await request('/role-update', { method: 'PUT', body: values, params: data.id });
    else response = await request('/role-form', { method: 'POST', body: values });
    if (response.success) {
      const successMessage = update ? 'Role updated successfully!' : 'Role added successfully!';
      toast(successMessage, { variant: 'success', autoHideDuration: 10000 });
      handleBack();
      refreshPagination();
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  const selectBox = (name, label, menus, onChange, req, disable = false) => {
    return (
      <RHFSelectbox
        name={name}
        {...(onChange && { onChange })}
        label={label}
        InputLabelProps={{ shrink: true }}
        menus={menus}
        {...(req && { required: true })}
        disable={disable}
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
        <MainCard title="Role Creation" sx={{ mb: 2 }}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={3}>
              {selectBox('projectId', 'Project Name', projectData, handleProjectId, true, view || update)}
            </Grid>
            <Grid item md={3} xl={3}>
              {txtBox('name', 'Role Name', 'text', true)}
            </Grid>
            <Grid item md={3} xl={3}>
              {txtBox('code', 'Code', 'text')}
            </Grid>
            <Grid item md={3} xl={3}>
              {txtBox('description', 'Description', 'text')}
            </Grid>
            <Grid item md={2.4} xl={2}>
              <RHFToggleButton key={data?.addTicket} name="addTicket" label="Ticket Creator" value={data?.addTicket} disabled={view} />
            </Grid>
            <Grid item md={2.4} xl={2}>
              <RHFToggleButton key={data?.forTicket} name="forTicket" label="Ticket Resolver" value={data?.forTicket} disabled={view} />
            </Grid>
            <Grid item md={2.4} xl={2}>
              <RHFToggleButton key={data?.isImport} name="isImport" label="Import" value={data?.isImport} disabled={view} />
            </Grid>
            <Grid item md={2.4} xl={2}>
              <RHFToggleButton key={data?.isExport} name="isExport" label="Export" value={data?.isExport} disabled={view} />
            </Grid>
            <Grid item md={2.4} xl={2}>
              <RHFToggleButton key={data?.isUpdate} name="isUpdate" label="Update" value={data?.isUpdate} disabled={view} />
            </Grid>
            <Grid container spacing={2} alignItems={'end'} sx={{ mt: 2 }}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
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
          </Grid>
        </MainCard>
      </FormProvider>
    </>
  );
};

CreateNewRole.propTypes = {
  onClick: PropTypes.func,
  projectData: PropTypes.array,
  setRefresh: PropTypes.func,
  data: PropTypes.object,
  setSelectedProject: PropTypes.func,
  selectedProject: PropTypes.string,
  view: PropTypes.bool,
  refreshPagination: PropTypes.func,
  update: PropTypes.bool
};

export default CreateNewRole;
