import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ApproverDetails from './approver-details';
import { FormProvider } from 'hook-form';
import MainCard from 'components/MainCard';
import Validations from 'constants/yupValidations';

const CreateNewApprover = (props) => {
  const { view, updateData, updates, saveData, showData, organizationId } = props;
  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project,
        transactionTypeId: Validations.transaction
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const setSaveData = (values) => {
    saveData({ ...values });
  };

  return (
    <>
      <FormProvider methods={methods}>
        <MainCard title={(view ? `View ` : updates ? 'Update ' : 'Add ') + 'Approver'}>
          <ApproverDetails
            view={view}
            showData={showData}
            setShowData={setSaveData}
            updateData={updateData}
            updates={updates}
            organizationId={organizationId}
          />
        </MainCard>
      </FormProvider>
    </>
  );
};

CreateNewApprover.propTypes = {
  onClick: PropTypes.func,
  data: PropTypes.object,
  view: PropTypes.bool,
  update: PropTypes.bool,
  saveData: PropTypes.func,
  updateData: PropTypes.object,
  updates: PropTypes.bool,
  showData: PropTypes.array,
  organizationId: PropTypes.string
};

export default CreateNewApprover;
