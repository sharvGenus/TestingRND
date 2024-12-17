import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, Button, Stack } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import request from '../../../utils/request';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import toast from 'utils/ToastNotistack';

const CreateNewNetwork = (props) => {
  const { data, view, update, setRefresh, setSelectedProject, projectData, refreshPagination } = props;
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        name: Validations.other,
        code: Validations.other,
        rank: Validations.other,
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
      setValue('projectId', data.project.id);
      handleSetValues(data);
    }
    clearErrors();
  }, [data, update, view, setValue, clearErrors, handleBack]);

  const handleProjectId = (e) => {
    setSelectedProject(e?.target?.value);
  };

  const onFormSubmit = async (values) => {
    values['levelType'] = 'network';
    let response;
    if (update) {
      response = await request('/network-hierarchies-update', { method: 'PUT', body: values, params: data.id });
    } else {
      response = await request('/network-hierarchies-form', { method: 'POST', body: values });
    }
    if (response.success) {
      const successMessage = update ? 'Level updated successfully!' : 'Level added successfully!';
      toast(successMessage, { variant: 'success', autoHideDuration: 10000 });
      setRefresh();
      refreshPagination();
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  const selectBox = (name, label, menus, onChange, req) => {
    return (
      <Stack>
        <RHFSelectbox
          name={name}
          label={label}
          onChange={onChange}
          InputLabelProps={{ shrink: true }}
          menus={menus}
          {...(req && { required: true })}
          {...(view || update ? { disable: true } : {})}
        />
      </Stack>
    );
  };

  const txtBox = (name, label, type, req, shrink = true) => {
    return (
      <Stack spacing={1}>
        <RHFTextField
          name={name}
          type={type}
          label={label}
          InputLabelProps={{ shrink: shrink }}
          {...(req && { required: true })}
          {...(view ? { disabled: true } : update ? { disabled: false } : {})}
        />
      </Stack>
    );
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
        <MainCard title={(view ? `View ` : update ? 'Update ' : 'Add ') + 'Network Level'} sx={{ mb: 2 }}>
          <Grid container spacing={4}>
            <Grid item md={3} xl={2}>
              {selectBox('projectId', 'Project Name', projectData, handleProjectId, true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('name', 'Level Name', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('code', 'Level Code', 'text', true)}
            </Grid>
            <Grid item md={3} xl={2}>
              {txtBox('rank', 'Rank', 'number', true)}
            </Grid>
            <Grid container spacing={2} alignItems={'end'} sx={{ mt: 1 }}>
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
                    <Grid item sx={{ display: 'flex', gap: '20px' }}>
                      <Button size="small" type="submit" variant="contained" color="primary">
                        Save
                      </Button>
                    </Grid>
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

CreateNewNetwork.propTypes = {
  onClick: PropTypes.func,
  projectData: PropTypes.array,
  setRefresh: PropTypes.func,
  data: PropTypes.object,
  setSelectedProject: PropTypes.func,
  selectedProject: PropTypes.string,
  view: PropTypes.bool,
  update: PropTypes.bool,
  setShowAdd: PropTypes.func,
  refreshPagination: PropTypes.func
};

export default CreateNewNetwork;
