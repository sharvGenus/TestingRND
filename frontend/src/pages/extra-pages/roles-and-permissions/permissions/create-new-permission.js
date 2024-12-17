import { useForm } from 'react-hook-form';
import { Grid } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useProjects } from '../../project/useProjects';
import { useMasterMakerLov } from '../../master-maker-lov/useMasterMakerLov';
import { useOrganizations } from '../../organization/useOrganizations';
import { useRoles } from '../useRoles';
import { FormProvider, RHFSelectbox } from 'hook-form';
import MainCard from 'components/MainCard';
import { getDropdownProjects, getLovsForMasterName, getOrganizationsListData, getRoles } from 'store/actions';
import Validations from 'constants/yupValidations';
import { concateNameAndCode } from 'utils';

const CreateNewPermission = ({ disableAll, onProceed: handleProceed, resetSignal }) => {
  const dispatch = useDispatch();

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        projectId: Validations.project,
        roleId: Validations.requiredWithLabel('Role'),
        organizationTypeId: Validations.requiredWithLabel('Organization'),
        organizationId: Validations.requiredWithLabel('Organization Name')
      })
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { watch, setValue, getValues, reset } = methods;
  const [projectId, organizationTypeId] = watch(['projectId', 'organizationTypeId']);

  const { roles } = useRoles();
  const rolesData = roles.rolesObject?.rows || [];

  const { projectsDropdown } = useProjects();
  const projectData = projectsDropdown?.projectsDropdownObject;

  const { masterMakerOrgType } = useMasterMakerLov();
  const organizationTypeData = masterMakerOrgType.masterObject;

  const { organizationsGetListData } = useOrganizations();
  const organizationListData = organizationsGetListData?.organizationGetListObject?.rows || [];

  const filteredOrganizationList = organizationListData.filter((item) => item.organizationTypeId === organizationTypeId);

  const selectBox = (name, label, menus, onChange, req) => {
    return (
      <RHFSelectbox
        name={name}
        onChange={onChange}
        label={label}
        InputLabelProps={{ shrink: true }}
        menus={menus}
        required={req}
        disable={disableAll}
      />
    );
  };

  const handleChange = (event, name) => {
    const { value } = event.target;

    const formValues = getValues();

    if (['projectId', 'organizationTypeId'].includes(name)) {
      if (name === 'projectId') {
        setValue('roleId', '');
      }

      if (name === 'organizationTypeId') {
        setValue('organizationId', '');
      }

      handleProceed(null);
      return;
    }

    formValues[name] = value;

    const isAnyFieldEmpty = Object.values(formValues).some((fieldValue) => !fieldValue);

    if (isAnyFieldEmpty) {
      handleProceed(null);
      return;
    }

    handleProceed(formValues);
  };

  useEffect(() => {
    reset();
  }, [resetSignal, reset]);

  useEffect(() => {
    if (!projectId) return;
    dispatch(getRoles({ projectId }));
  }, [dispatch, projectId]);

  useEffect(() => {
    dispatch(getDropdownProjects());
    dispatch(getOrganizationsListData());
    dispatch(getLovsForMasterName('ORGANIZATION TYPE'));
  }, [dispatch]);

  return (
    <FormProvider methods={methods}>
      <MainCard title="Role Permissions" sx={{ mb: 2 }}>
        <Grid container spacing={4}>
          <Grid item md={3} xl={2}>
            {selectBox('projectId', 'Project Name', projectData, (event) => handleChange(event, 'projectId'), true)}
          </Grid>
          <Grid item md={3} xl={2}>
            {selectBox('roleId', 'Role', rolesData, (event) => handleChange(event, 'roleId'), true)}
          </Grid>
          <Grid item md={3} xl={2}>
            {selectBox(
              'organizationTypeId',
              'Organization Type',
              organizationTypeData,
              (event) => handleChange(event, 'organizationTypeId'),
              true
            )}
          </Grid>
          <Grid item md={3} xl={2}>
            {selectBox(
              'organizationId',
              'Organization Name',
              concateNameAndCode(filteredOrganizationList),
              (event) => handleChange(event, 'organizationId'),
              true
            )}
          </Grid>
        </Grid>
      </MainCard>
    </FormProvider>
  );
};

CreateNewPermission.propTypes = {
  disableAll: PropTypes.bool,
  onProceed: PropTypes.func,
  resetSignal: PropTypes.func
};

export default CreateNewPermission;
