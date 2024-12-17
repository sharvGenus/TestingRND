import { Button, Grid } from '@mui/material';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';

const AdditionalDetails = ({ formsList, formId, onNext, selectedData }) => {
  const [edited, setEdited] = useState(false);
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        prefix: Validations.alphanumericWithAlphabetRequired('Devolution prefix'),
        index: Validations.nother,
        oldSerialNoId: Validations.nother,
        newSerialNoId: Validations.nother,
        oldMakeId: Validations.nother
      })
    ),
    defaultValues: {
      prefix: selectedData?.prefix || '',
      index: selectedData?.index || 1,
      oldSerialNoId: selectedData?.old_serial_no?.id || null,
      newSerialNoId: selectedData?.new_serial_no?.id || null,
      oldMakeId: selectedData?.old_make?.id || null,
      newMakeId: selectedData?.new_make?.id || null
    },
    mode: 'all'
  });

  const { handleSubmit, setValue, watch } = methods;

  const prefix = watch('prefix');
  const index = watch('index');
  const oldSerialNoId = watch('oldSerialNoId');
  const newSerialNoId = watch('newSerialNoId');
  const oldMakeId = watch('oldMakeId');
  const newMakeId = watch('newMakeId');

  useEffect(() => {
    if (formsList && formsList.length > 0 && selectedData && selectedData?.id) {
      setValue('oldSerialNoId', selectedData?.old_serial_no?.id);
      setValue('newSerialNoId', selectedData?.new_serial_no?.id);
      setValue('oldMakeId', selectedData?.old_make?.id);
      setValue('newMakeId', selectedData?.new_make?.id);
    }
  }, [formsList, selectedData, setValue]);

  useEffect(() => {
    if (
      prefix !== selectedData?.prefix ||
      index !== selectedData?.index ||
      oldSerialNoId !== selectedData?.old_serial_no?.id ||
      oldMakeId !== selectedData?.old_make?.id ||
      newSerialNoId !== selectedData?.new_serial_no?.id ||
      newMakeId !== selectedData?.new_make?.id
    )
      setEdited(true);
    else setEdited(false);
  }, [prefix, index, oldSerialNoId, oldMakeId, newSerialNoId, newMakeId, selectedData]);

  const onDataAdded = async (values) => {
    if (selectedData && selectedData?.id && edited) {
      const resp = await request('/devolution-config-update', {
        method: 'PUT',
        body: { projectId: selectedData?.project?.id, formId: selectedData?.form?.id, ...values },
        params: selectedData.id
      });
      if (resp.success) {
        toast('Devolution Config Update Successfully', { variant: 'success' });
      } else {
        toast(resp?.error?.message, { variant: 'error' });
      }
    }
    onNext(values);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onDataAdded)}>
      <MainCard sx={{ mb: 2 }}>
        <Grid container rowSpacing={3} columnSpacing={2}>
          <Grid item md={4} xs={12}>
            <RHFTextField
              name={'prefix'}
              label={'Devolution Prefix'}
              type="text"
              InputLabelProps={{ shrink: true }}
              required
              disabled={selectedData?.isLocked ? selectedData?.isLocked : false}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <RHFTextField
              name={'index'}
              label={'Index Number'}
              type="number"
              InputLabelProps={{ shrink: true }}
              required
              disabled={selectedData?.isLocked ? selectedData?.isLocked : false}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <RHFSelectbox
              name={'oldSerialNoId'}
              label={'Old Serial Number'}
              InputLabelProps={{ shrink: true }}
              menus={
                formsList
                  .filter((form) => {
                    return form.id == formId;
                  })[0]
                  ?.form_attributes?.map((item) => ({ name: item.name, id: item.id })) || []
              }
              required
              // disable={selectedData?.isLocked ? selectedData?.isLocked : false}
              allowClear
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <RHFSelectbox
              name={'oldMakeId'}
              label={'Old Make'}
              InputLabelProps={{ shrink: true }}
              menus={
                formsList
                  .filter((form) => {
                    return form.id == formId;
                  })[0]
                  ?.form_attributes?.filter((vl) => vl.id !== oldSerialNoId)
                  .map((item) => ({ name: item.name, id: item.id })) || []
              }
              required
              // disable={selectedData?.isLocked ? selectedData?.isLocked : false}
              allowClear
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <RHFSelectbox
              name={'newSerialNoId'}
              label={'New Serial Number'}
              InputLabelProps={{ shrink: true }}
              menus={
                formsList
                  .filter((form) => {
                    return form.id == formId;
                  })[0]
                  ?.form_attributes?.filter((vl) => vl.id !== oldSerialNoId && vl.id !== oldMakeId)
                  .map((item) => ({ name: item.name, id: item.id })) || []
              }
              required
              // disable={selectedData?.isLocked ? selectedData?.isLocked : false}
              allowClear
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <RHFSelectbox
              name={'newMakeId'}
              label={'New Make'}
              InputLabelProps={{ shrink: true }}
              menus={
                formsList
                  .filter((form) => {
                    return form.id == formId;
                  })[0]
                  ?.form_attributes?.filter((vl) => vl.id !== oldSerialNoId && vl.id !== newSerialNoId && vl.id !== oldMakeId)
                  .map((item) => ({ name: item.name, id: item.id })) || []
              }
              // disable={selectedData?.isLocked ? selectedData?.isLocked : false}
              allowClear
            />
          </Grid>
          <Grid item xs={12} textAlign={'right'} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '1.25rem' }}>
            <Button variant="contained" size="small" color="primary" type="submit">
              {selectedData && selectedData?.id && edited ? 'Update' : 'Next'}
            </Button>
          </Grid>
        </Grid>
      </MainCard>
    </FormProvider>
  );
};

AdditionalDetails.propTypes = {
  formsList: PropTypes.any,
  formId: PropTypes.any,
  onNext: PropTypes.func,
  selectedData: PropTypes.any
};

export default AdditionalDetails;
