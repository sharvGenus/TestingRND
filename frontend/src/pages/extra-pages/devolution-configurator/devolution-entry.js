import { Button, Grid } from '@mui/material';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';

const DevolutionEntry = ({ selectedDataId, editRow, onBack, formsList, formId, savedColumn }) => {
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        formAttributeId: Validations.nother,
        formAttributeName: Validations.nother,
        newName: Validations.nother
      })
    ),
    defaultValues: {
      formAttributeId: editRow?.formAttributeId || '',
      formAttributeName: editRow?.formAttributeName || '',
      newName: editRow?.newName || ''
    },
    mode: 'all'
  });

  const { handleSubmit, setValue, reset } = methods;
  useEffect(() => {
    if (editRow?.id) setValue('id', editRow?.id);
    else setValue('id', null);
  }, [editRow, setValue]);

  const onColumnAdded = async (values) => {
    if (selectedDataId !== null) {
      let resp;
      resp = await request(values.id && values?.id !== null ? '/devolution-mapping-update' : '/devolution-mapping-create', {
        method: values.id ? 'PUT' : 'POST',
        body: {
          devolutionConfigId: selectedDataId,
          formAttributeId: values.formAttributeId,
          newName: values.newName
        },
        ...(values.id && { params: values.id })
      });
      if (resp.success) {
        toast(`Devolution mapping ${values.id ? 'updated' : 'created'} successfully`, { variant: 'success' });
      } else {
        toast(resp?.error?.message, { variant: 'error' });
      }
    }
    savedColumn(values);
    reset();
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onColumnAdded)}>
      <MainCard sx={{ mb: 2 }}>
        <Grid container rowSpacing={3} columnSpacing={2}>
          <Grid item md={4} xs={12}>
            <RHFSelectbox
              name={'formAttributeId'}
              label={'Forms Column'}
              InputLabelProps={{ shrink: true }}
              menus={
                formsList
                  .filter((form) => {
                    return form.id == formId;
                  })[0]
                  ?.form_attributes?.map((item) => ({ name: item.name, id: item.id })) || []
              }
              onChange={(e) => {
                setValue('formAttributeName', e?.target?.name);
                setValue('newName', e?.target?.name);
              }}
              required
              disable={false}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <RHFTextField name={'newName'} label={'New Name'} InputLabelProps={{ shrink: true }} required disabled={false} />
          </Grid>
          <Grid item xs={12} textAlign={'right'} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '1.25rem' }}>
            <Button variant="outlined" size="small" color="primary" onClick={onBack}>
              Back
            </Button>
            <Button variant="contained" size="small" color="primary" type="submit">
              {editRow ? 'Update' : 'Add'}
            </Button>
          </Grid>
        </Grid>
      </MainCard>
    </FormProvider>
  );
};

DevolutionEntry.propTypes = {
  selectedDataId: PropTypes.any,
  editRow: PropTypes.any,
  onBack: PropTypes.func,
  formsList: PropTypes.any,
  formId: PropTypes.any,
  savedColumn: PropTypes.func
};

export default DevolutionEntry;
