import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Grid } from '@mui/material';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, RHFSelectTags, RHFSelectbox, RHFTextField } from 'hook-form';
import {
  getDropdownProjects,
  getFormDataCustom,
  getLovsForMasterName,
  getMasterMakerProjects,
  getProjectWiseTicketMapping
} from 'store/actions';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import { useProjectMasterMaker } from 'pages/extra-pages/project-master-maker/useProjectMasterMaker';
import MainCard from 'components/MainCard';
import toast from 'utils/ToastNotistack';
import request from 'utils/request';
import Validations from 'constants/yupValidations';
import { useMasterMakerLov } from 'pages/extra-pages/master-maker-lov/useMasterMakerLov';
import { useDefaultFormAttributes } from 'pages/form-configurator/useDefaultAttributes';

const CreateProjectWiseMapping = ({ editRow, onBack }) => {
  const dispatch = useDispatch();

  const { projectsDropdown } = useProjects();
  const projectData = projectsDropdown?.projectsDropdownObject;

  const { masterMakerProjects } = useProjectMasterMaker();
  const projectMastersData = masterMakerProjects?.masterMakerProjectsObject?.rows || [];

  const { masterMakerOrgType } = useMasterMakerLov();
  const formTypeData = masterMakerOrgType?.masterObject || [];

  const { formsCustom } = useDefaultFormAttributes();
  const formList = useMemo(() => formsCustom?.formDataCustom?.data?.rows || [], [formsCustom]);

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.other,
        issueFields: Validations.otherArray,
        forms: Validations.otherArray,
        ticketIndex: Validations.other
      })
    ),
    defaultValues: {
      projectId: editRow?.projectId || '',
      issueFields: editRow?.issueFields.map((field) => field.id) || [],
      forms: editRow?.forms.map((form) => form.id) || [],
      formTypes: editRow?.forms.map((form) => form.formTypeId) || [],
      prefix: editRow?.prefix || '',
      ticketIndex: editRow?.ticketIndex || 1
    },
    mode: 'all'
  });

  const { handleSubmit } = methods;

  const onProjectChange = useCallback(
    (e) => {
      if (!editRow) {
        methods.setValue('issueFields', []);
        methods.setValue('formTypes', []);
        methods.setValue('forms', []);
        dispatch(getFormDataCustom({ selectedProject: e?.target?.value, formTypeId: methods.getValues('formTypes') }));
      }
      dispatch(getMasterMakerProjects({ selectedProject: e?.target?.value }));
    },
    [dispatch, editRow, methods]
  );
  const onFormTypeChange = useCallback(
    (formTypeArr) => {
      if (methods.watch('projectId') && formTypeArr.length) {
        dispatch(getFormDataCustom({ projectId: methods.watch('projectId'), formTypeId: formTypeArr }));
      }
    },
    [methods, dispatch]
  );

  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getLovsForMasterName('FORM_TYPES'));
    if (editRow) {
      onProjectChange({ target: { value: editRow.projectId } });
      onFormTypeChange(editRow.forms.map((form) => form.formTypeId));
    }
  }, [dispatch, editRow, onProjectChange, onFormTypeChange]);

  const formTypes = methods.watch('formTypes');
  useEffect(() => {
    const selectedForms = methods.getValues('forms');
    if (formList?.length) {
      if (formList[0].projectId !== methods.watch('projectId')) {
        return;
      }
      methods.setValue(
        'forms',
        selectedForms.filter((formId) => formTypes.includes(formList.filter((form) => form.id === formId)[0]?.formTypeId))
      );
    }
  }, [formTypes, formList, methods]);

  const onSubmitHandler = async (formValues) => {
    const payload = {
      projectId: formValues.projectId,
      issueFields: formValues.issueFields,
      forms: formValues.forms,
      ticketIndex: formValues.ticketIndex,
      prefix: formValues.prefix
    };
    const response = await request(editRow ? '/update-project-wise-ticket-mapping' : '/project-wise-ticket-mapping-create', {
      method: editRow ? 'PUT' : 'POST',
      params: editRow ? editRow.id : null,
      body: payload
    });
    if (response.success) {
      toast(`Successfully ${editRow ? 'updated' : 'created'} project wise ticket mapping.`, {
        variant: 'success',
        autoHideDuration: 10000
      });
      dispatch(getProjectWiseTicketMapping());
      onBack();
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  return (
    <MainCard>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitHandler)}>
        <Grid container rowSpacing={3} columnSpacing={2}>
          <Grid item xl={4} xs={12}>
            <RHFSelectbox
              name={'projectId'}
              onChange={onProjectChange}
              label={'Project'}
              InputLabelProps={{ shrink: true }}
              menus={projectData}
              allowClear
              required
              disable={!!editRow}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <RHFTextField fullWidth disabled={!!editRow} label={'Ticket Number Prefix'} autoComplete={'off'} name={'prefix'} />
          </Grid>
          <Grid item xs={12} md={4}>
            <RHFTextField
              fullWidth
              disabled={!!editRow}
              type="number"
              label={'Ticket Index Number'}
              autoComplete={'off'}
              name={'ticketIndex'}
            />
          </Grid>
          <Grid item xs={12}>
            <RHFSelectTags
              name={'issueFields'}
              label={'Ticket Issue Types'}
              InputLabelProps={{ shrink: true }}
              menus={projectMastersData.map((data) => ({ name: data.name, id: data.id })) || []}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <RHFSelectTags
              onChange={onFormTypeChange}
              name={'formTypes'}
              label={'Form Types'}
              InputLabelProps={{ shrink: true }}
              menus={methods.watch('projectId') ? formTypeData : []}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <RHFSelectTags
              name={'forms'}
              label={'O&M Forms'}
              InputLabelProps={{ shrink: true }}
              menus={methods.watch('projectId') && methods.watch('formTypes').length ? formList : []}
              allowClear
              required
            />
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '1.25rem' }}>
            <Button variant="outlined" size="small" color="primary" onClick={onBack}>
              Back
            </Button>
            <Button variant="contained" size="small" color="primary" type="submit">
              {editRow ? 'Update' : 'Save'}
            </Button>
          </Grid>
        </Grid>
      </FormProvider>
    </MainCard>
  );
};

CreateProjectWiseMapping.propTypes = {
  editRow: PropTypes.any,
  onBack: PropTypes.func
};

export default CreateProjectWiseMapping;
