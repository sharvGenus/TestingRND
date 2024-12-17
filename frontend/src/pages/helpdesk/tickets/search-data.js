import { Button, Grid, IconButton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { useTicketMapping } from '../configurator/useTicketMapping';
import { getDropdownProjects, getFormWiseTicketMapping } from 'store/actions';
import MainCard from 'components/MainCard';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import Validations from 'constants/yupValidations';

const SearchData = ({ onSearchResult, onCloseTicketForm }) => {
  const dispatch = useDispatch();
  const [selectedForm, setSelectedForm] = useState();
  const [loading, setLoading] = useState(false);

  const { projectsDropdown } = useProjects();
  const projectData = projectsDropdown?.projectsDropdownObject;

  const { formWiseTicketMapping } = useTicketMapping();
  const formWiseTicketMappingData = formWiseTicketMapping?.formWiseTicketMappingObject?.rows || [];

  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getFormWiseTicketMapping());
  }, [dispatch]);

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.required,
        formId: Validations.required,
        searchField: Validations.required,
        searchValue: Validations.required
      })
    ),
    defaultValues: {
      searchField: '',
      searchValue: '',
      projectId: '',
      formId: ''
    },
    mode: 'all'
  });

  const { handleSubmit } = methods;

  const onSubmitHandler = async (values) => {
    const payload = {
      searchValue: values.searchValue.trim() || '',
      searchField: values.searchField,
      formId: values.formId,
      displayColumns: ['id', ...selectedForm.displayFields.map((field) => field.columnName)]
    };

    if (selectedForm.geoLocationField) {
      payload.displayColumns.push(selectedForm.geoLocationField?.columnName);
    }

    payload.displayColumns = JSON.stringify(payload.displayColumns);

    setLoading(true);
    const response = await request('/ticket-mapping-form-data-list', { method: 'GET', query: payload });
    setLoading(false);

    if (response.success) {
      if (!response.data.data.length) {
        toast('Data not found. Please try again with valid search.', { variant: 'warning' });
      } else {
        onSearchResult({ data: [...response.data.data], ticketIssueTypes: selectedForm.ticketIssueTypes, form: selectedForm });
      }
    } else {
      toast(response?.error?.message || 'Search failed. Please try again.', { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitHandler)}>
      <MainCard
        title={
          <Grid sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
            <IconButton sx={{ position: 'absolute', left: 10 }} onClick={() => onCloseTicketForm()} color="primary">
              <ArrowBackOutlinedIcon />
            </IconButton>
            <Typography sx={{ position: 'relative', left: 25 }} variant="h4">
              Create Ticket
            </Typography>
          </Grid>
        }
        sx={{ mb: 2 }}
      >
        <Grid container sx={{ mb: 2 }} spacing={2}>
          <Grid item xs={12} md={2.75}>
            <RHFSelectbox
              name={'projectId'}
              label={'Select Project'}
              placeholder="Project"
              menus={projectData}
              onChange={() => {
                methods.setValue('formId', '');
                methods.setValue('searchField', '');
                methods.setValue('searchValue', '');
              }}
              required
            />
          </Grid>
          <Grid item xs={12} md={2.75}>
            <RHFSelectbox
              name={'formId'}
              label={'Select Form'}
              placeholder="Form"
              menus={formWiseTicketMappingData
                ?.filter((data) => data.projectId === methods.watch('projectId'))
                ?.map((mapping) => mapping.form)}
              onChange={(e) => {
                methods.setValue('searchField', '');
                methods.setValue('searchValue', '');
                setSelectedForm(formWiseTicketMappingData?.filter((mapping) => mapping.form?.id === e.target?.value)[0] || undefined);
              }}
              required
            />
          </Grid>
          <Grid item xs={12} md={2.75}>
            <RHFSelectbox
              name={'searchField'}
              label={'Filter By'}
              placeholder="Filter"
              menus={selectedForm?.searchFields?.map((field) => ({ id: field.columnName, name: field.name })) || []}
              onChange={() => {
                methods.setValue('searchValue', '');
              }}
              required
            />
          </Grid>
          <Grid item xs={12} md={2.75}>
            <RHFTextField fullWidth label={'Search Value'} placeholder="Value" autoComplete={'off'} name={'searchValue'} required />
          </Grid>
          <Grid
            item
            xs={12}
            md={1}
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center'
            }}
          >
            <Button disabled={loading} size="small" variant="contained" color="primary" type="submit">
              Search
            </Button>
          </Grid>
        </Grid>
      </MainCard>
    </FormProvider>
  );
};

SearchData.propTypes = {
  onSearchResult: PropTypes.func,
  onCloseTicketForm: PropTypes.func
};

export default SearchData;
