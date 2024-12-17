import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Button, Grid } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { stores } from './rights';
import Validations from 'constants/yupValidations';
import { FormProvider, RHFSelectbox, RHFTextField } from 'hook-form';
import {
  getDropdownProjects,
  getLovsForMasterName,
  getMasterMakerLov,
  getOrgStoreDropdown,
  getOrganizations,
  getOrganizationsLocationByParent,
  getProjectsForRoleOrUser,
  // getProjectsForRoleOrUser,
  getRoles,
  getUsers
} from 'store/actions';
import { useMasterMakerLov } from 'pages/extra-pages/master-maker-lov/useMasterMakerLov';
import { useProjects } from 'pages/extra-pages/project/useProjects';
import { useUsers } from 'pages/extra-pages/users/useUsers';
import request from 'utils/request';
import toast from 'utils/ToastNotistack';
import { useOrganizationStore } from 'pages/extra-pages/organization-store/useOrganizationStore';
import { useRoles } from 'pages/extra-pages/roles-and-permissions/useRoles';
import { useOrganizations } from 'pages/extra-pages/organization/useOrganizations';
import { concateNameAndCode } from 'utils';

const FilterData = ({ rightsData, rightsFor, setAllData, resetTable }) => {
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState(null);
  const [storesDropDown, setStoresDropDown] = useState([]);
  const [store, setStore] = useState('');
  const [level, setLevel] = useState('');
  const [nOrgType, setNOrgType] = useState('');
  const [showProject, setShowProject] = useState(false);
  const [selectedRightFor, setSelectedRightFor] = useState('');
  const [userORRoleQuery, setUserORRoleQuery] = useState(null);
  const [orgTypeId, setOrgTypeId] = useState(null);
  const [govern, setGovern] = useState('');
  const { users } = useUsers();
  const { userData } = useMemo(
    () => ({
      userData: users.usersObject?.rows || [],
      count: users.usersObject?.count || 0,
      isLoading: users.loading || false
    }),
    [users]
  );

  const { projectsDropdown, projectsGovernForRoleOrUser } = useProjects();
  const projectData = projectsDropdown?.projectsDropdownObject || [];
  const projectGovernData = projectsGovernForRoleOrUser?.projectsObject || [];

  const { orgStoreDropDown } = useOrganizationStore();

  const { orgStoreData } = useMemo(
    () => ({
      orgStoreData: orgStoreDropDown?.orgStoreDropDownObject?.rows || [],
      count: orgStoreDropDown?.orgStoreDropDownObject?.count || 0,
      isLoading: orgStoreDropDown.loading || false
    }),
    [orgStoreDropDown]
  );

  const mergeNameAndCode = (arr) => {
    let newArr = [];
    arr &&
      arr.length > 0 &&
      arr.map((val) => {
        newArr.push({
          ...val,
          name: val?.name + ' - ' + val?.code
        });
      });
    return newArr;
  };

  useEffect(() => {
    setStoresDropDown(orgStoreData);
  }, [orgStoreData]);

  useEffect(() => {
    dispatch(getLovsForMasterName('ORGANIZATION TYPE'));
  }, [dispatch]);

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape(
        govern === 'Roles' && rightsFor === 'Menu'
          ? {
              governType: Validations.requiredWithLabel('Govern'),
              projectId: Validations.accessProject,
              roleId: Validations.requiredWithLabel('RoleId')
            }
          : govern === 'Roles' && store !== ''
          ? {
              governType: Validations.requiredWithLabel('Govern'),
              projectId: Validations.accessProject,
              roleId: Validations.requiredWithLabel('RoleId'),
              rightsFor: Validations.rightsFor,
              storesId: store === 'Store' ? Validations.accessStore : Validations.accessStoreLocationId
            }
          : govern === 'Roles' &&
            (level === 'GAA & Network' || level === 'Mobile-Forms' || level === 'Web-Forms' || level === 'Web-Reports')
          ? {
              governType: Validations.requiredWithLabel('Govern'),
              projectId: Validations.accessProject,
              roleId: Validations.requiredWithLabel('RoleId'),
              rightsFor: Validations.rightsFor,
              projectGovernId: Validations.requiredWithLabel('Govern Project')
            }
          : govern === 'Roles'
          ? {
              governType: Validations.requiredWithLabel('Govern'),
              projectId: Validations.accessProject,
              roleId: Validations.requiredWithLabel('RoleId'),
              rightsFor: Validations.rightsFor
            }
          : govern === 'Users' && rightsFor === 'Menu'
          ? {
              governType: Validations.requiredWithLabel('Govern'),
              organizationType: Validations.organizationType,
              organizationId: Validations.accessOrganizationId,
              userId: Validations.accessUser
            }
          : govern === 'Users' && store !== ''
          ? {
              governType: Validations.requiredWithLabel('Govern'),
              organizationType: Validations.organizationType,
              organizationId: Validations.accessOrganizationId,
              userId: Validations.accessUseorgnTyper,
              rightsFor: Validations.rightsFor,
              storesId: store === 'Store' ? Validations.accessStore : Validations.accessStoreLocationId
            }
          : govern === 'Users' &&
            (level === 'GAA & Network' || level === 'Mobile-Forms' || level === 'Web-Forms' || level === 'Web-Reports')
          ? {
              governType: Validations.requiredWithLabel('Govern'),
              organizationType: Validations.organizationType,
              organizationId: Validations.accessOrganizationId,
              userId: Validations.accessUser,
              rightsFor: Validations.rightsFor,
              projectGovernId: Validations.requiredWithLabel('Govern Project')
            }
          : govern === 'Users'
          ? {
              governType: Validations.requiredWithLabel('Govern'),
              organizationType: Validations.organizationType,
              organizationId: Validations.accessOrganizationId,
              userId: Validations.accessUser,
              rightsFor: Validations.rightsFor
            }
          : {}
      )
    ),
    defaultValues: {},
    mode: 'all'
  });

  const { handleSubmit, setValue, reset } = methods;

  useEffect(() => {
    setValue('organizationId', null);
    setValue('organisationBranchId', null);
    setValue('userId', null);
    setValue('rightsFor', null);
    reset();
    dispatch(getMasterMakerLov());
  }, [dispatch, setValue, reset]);
  const { masterMakerLovs, masterMakerOrgType } = useMasterMakerLov();
  const organizationTypeData = masterMakerOrgType.masterObject;
  const fetchTransactionType = (data, type) => {
    const res = data && data.filter((obj) => obj.name === type);
    return res && res.length ? res[0].id : null;
  };
  const transactionTypeData = masterMakerLovs.masterMakerLovsObject.rows;

  const { roles } = useRoles();

  const { rolesData } = useMemo(
    () => ({
      rolesData: roles.rolesObject?.rows || [],
      count: roles.rolesObject?.count || 0,
      isLoading: roles.loading || false
    }),
    [roles]
  );
  const onRequest = async (path, params, query = {}) => {
    const response = await request(
      path,
      {
        method: 'GET',
        params: params,
        query: query
      },
      false
    );
    if (response.success) {
      return response.data;
    } else {
      const error = response.error && response.error.message ? response.error.message : response.error;
      toast(error || 'Operation failed. Please try again!', { variant: 'error' });
    }
  };

  const onFormSubmit = async (values) => {
    let params = govern === 'Roles' ? values.roleId : values.userId;
    if (values.rightsFor && values.rightsFor !== 'stores' && values.rightsFor !== 'storesLocation') params += '/' + values.rightsFor;
    else params += '/' + values.storesId;
    if (
      selectedRightFor === 'Supplier' ||
      selectedRightFor === 'Customer' ||
      selectedRightFor === 'Company' ||
      selectedRightFor === 'Contractor'
    ) {
      setNOrgType('');
      const orgType = fetchTransactionType(transactionTypeData, selectedRightFor.toUpperCase());
      values.orgType = orgType;
      if (
        values.rightsFor === 'stores' ||
        values.rightsFor === 'a8bbb41a-57d4-443d-ac6c-784dc1f0d1cb' ||
        values.rightsFor === 'storesLocation'
      ) {
        if (values.rightsFor === 'stores') {
          params = (govern === 'Roles' ? values.roleId : values.userId) + '/' + values.storesId + '/' + orgType + '/' + orgType;
        } else if (values.rightsFor === 'a8bbb41a-57d4-443d-ac6c-784dc1f0d1cb') {
          params = (govern === 'Roles' ? values.roleId : values.userId) + '/' + values.rightsFor + '/' + values.storesId + '/' + orgType;
        } else params = (govern === 'Roles' ? values.roleId : values.userId) + '/' + values.storesId + '/' + orgType + '/' + null;
      } else {
        params = params + '/' + orgType + '/' + null;
      }
    } else if (
      values.rightsFor === 'stores' ||
      values.rightsFor === 'a8bbb41a-57d4-443d-ac6c-784dc1f0d1cb' ||
      values.rightsFor === 'storesLocation'
    ) {
      if (values.rightsFor === 'stores') {
        params = (govern === 'Roles' ? values.roleId : values.userId) + '/' + values.storesId + '/' + nOrgType + '/' + nOrgType;
      } else if (values.rightsFor === 'a8bbb41a-57d4-443d-ac6c-784dc1f0d1cb') {
        params = (govern === 'Roles' ? values.roleId : values.userId) + '/' + values.rightsFor + '/' + values.storesId + '/' + nOrgType;
      } else params = (govern === 'Roles' ? values.roleId : values.userId) + '/' + values.storesId + '/' + nOrgType + '/' + null;
      values.orgType = nOrgType;
    } else {
      params = params + '/' + null + '/' + null;
    }
    if (rightsFor === 'Menu') {
      const resp = await onRequest('/get-masters', values.roleId != null ? values.roleId : values.userId, { sort: ['rank', 'ASC'] });
      resp &&
        resp.data &&
        setAllData({
          userId: values.roleId != null ? null : values.userId,
          roleId: values.userId != null ? null : values.roleId,
          data: resp.data
        });
    } else if (rightsFor === 'Masters') {
      if (level === 'GAA & Network' || level === 'Web-Forms' || level === 'Web-Reports' || level === 'Mobile-Forms') {
        params = (govern === 'Roles' ? values.roleId : values.userId) + '/' + values.rightsFor + '/' + values.projectGovernId + '/' + null;
      }
      const resp2 = await onRequest('/get-lovs', params);
      let respData = {
        userId: values.roleId != null ? null : values.userId,
        roleId: values.userId != null ? null : values.roleId,
        masterId: values.rightsFor === 'stores' || values.rightsFor === 'storesLocation' ? values.storesId : values.rightsFor,
        ...(values.rightsFor === 'a8bbb41a-57d4-443d-ac6c-784dc1f0d1cb' && { storesOrgType: values.orgType }),
        data: resp2?.data
      };
      if (level === 'GAA & Network' || level === 'Web-Forms' || level === 'Web-Reports' || level === 'Mobile-Forms') {
        respData['forGAA'] = true;
        respData['projectId'] = values.projectGovernId;
      }
      resp2 && resp2.data && resp2.data.length >= 0 && setAllData(respData);
    }
  };

  const selectBox = (name, label, menus, req, onChange) => {
    return (
      <RHFSelectbox
        name={name}
        label={label}
        {...(typeof onChange === 'function' && { onChange: onChange })}
        InputLabelProps={{ shrink: true }}
        menus={menus || []}
        {...(req && { required: true })}
      />
    );
  };

  const resetContents = (stage) => {
    if (stage === 'govern') setValue('organizationType', null);
    if (stage === 'govern' || stage === 'orgType') setValue('organizationId', null);
    if (stage === 'govern' || stage === 'orgType' || stage === 'org') setValue('organisationBranchId', null);
    if (stage === 'govern' || stage === 'orgType' || stage === 'org' || stage === 'orgBranch') setValue('userId', null);
    if (stage === 'govern' || stage === 'orgType' || stage === 'org' || stage === 'orgBranch' || stage === 'user')
      setValue('projectId', null);
    if (stage === 'govern' || stage === 'orgType' || stage === 'org' || stage === 'orgBranch' || stage === 'user' || stage === 'project')
      setValue('roleId', null);
    if (
      stage === 'govern' ||
      stage === 'orgType' ||
      stage === 'org' ||
      stage === 'orgBranch' ||
      stage === 'user' ||
      stage === 'project' ||
      stage == 'role'
    )
      setValue('rightsFor', null);
    if (
      stage === 'govern' ||
      stage === 'orgType' ||
      stage === 'org' ||
      stage === 'orgBranch' ||
      stage === 'user' ||
      stage === 'project' ||
      stage == 'role' ||
      stage === 'rights'
    )
      setValue('storesId', null);
    if (
      stage === 'govern' ||
      stage === 'orgType' ||
      stage === 'org' ||
      stage === 'orgBranch' ||
      stage === 'user' ||
      stage === 'project' ||
      stage == 'role' ||
      stage === 'rights' ||
      stage === 'store'
    )
      setValue('projectGovernId', null);
    if (stage === 'govern' || stage === 'orgType' || stage === 'org' || stage === 'orgBranch' || stage === 'user') setUserDetails(null);
    setAllData({});
  };

  const onOrgSelected = (e) => {
    resetTable([]);
    if (e?.target?.value) {
      setValue('code', '');
      setValue('mobileNumber', '');
      setValue('email', '');
      setUserDetails(null);
      resetContents('org');
      dispatch(getOrganizationsLocationByParent({ params: orgTypeId + '/' + e?.target?.value }));
      dispatch(getUsers({ all: true, organizationId: e?.target?.value }));
    }
  };

  const onOrgBranchSelected = (e) => {
    resetContents('orgBranch');
    dispatch(getUsers({ all: true, organisationBranchId: e?.target?.value }));
  };

  const onRightsSelected = (e) => {
    resetTable([]);
    resetContents('rights');
    setValue('projectGovernId', null);
    setValue('levelId', null);
    setValue('storesId', null);
    setShowProject(false);
    if (e?.target?.value && e?.target?.name === 'View Stores') {
      setStoresDropDown(stores.store);
      setStore('Store');
      setLevel('');
    } else if (e?.target?.value && e?.target?.value === 'stores') {
      setStoresDropDown(stores.store);
      setStore('Store');
      setLevel('');
    } else if (e?.target?.value && e?.target?.value === 'storesLocation') {
      dispatch(
        getOrgStoreDropdown(
          userORRoleQuery
            ? userORRoleQuery.userId
              ? userORRoleQuery.userId
              : userORRoleQuery.roleId
              ? userORRoleQuery.roleId
              : null
            : null
        )
      );
      setStore('Store');
      setLevel('');
    } else if (e?.target?.name && e?.target?.name === 'GAA & Network') {
      setLevel('GAA & Network');
      dispatch(getProjectsForRoleOrUser(userORRoleQuery));
      setShowProject(true);
      setStoresDropDown([]);
      setStore('');
    } else if (
      e?.target?.name &&
      (e?.target?.name === 'Mobile-Forms' || e?.target?.name === 'Web-Forms' || e?.target?.name === 'Web-Reports')
    ) {
      setShowProject(true);
      dispatch(getProjectsForRoleOrUser(userORRoleQuery));
      setStoresDropDown([]);
      setStore('');
      setLevel(e?.target?.name);
    } else {
      setStoresDropDown([]);
      setStore('');
      setLevel('');
      setShowProject(false);
    }
    if (e?.target?.name) {
      setSelectedRightFor(e?.target?.name);
    }
  };

  const onStoreSelected = (e) => {
    resetTable([]);
    resetContents('store');
    if (e?.target?.name) {
      let name = e?.target?.name;
      setSelectedRightFor(name?.split(' ')[0]);
    }
    if (e?.target && e?.target?.row && e?.target?.row?.organizationType) {
      setNOrgType(e?.target?.row?.organizationType);
    }
  };

  const onUserSelected = (e) => {
    resetTable([]);
    if (e?.target?.row) {
      resetContents('user');
      setUserDetails(e.target.row);
      setUserORRoleQuery({ userId: e?.target?.value });
    }
  };

  const onRoleSelected = (e) => {
    if (e?.target?.value) {
      resetContents('role');
      setUserORRoleQuery({ roleId: e?.target?.value });
      setUserDetails(null);
    }
  };

  const { organizations, organizationsLocByParent } = useOrganizations();

  const { orgData } = useMemo(
    () => ({
      orgData: (!organizations.loading && organizations.organizationObject?.rows) || [],
      isLoading: organizations.loading || false
    }),
    [organizations]
  );

  const onOrgTypeSelected = (e) => {
    if (e?.target?.value) {
      setOrgTypeId(e?.target?.value);
      resetContents('orgType');
      dispatch(getOrganizations({ transactionTypeId: e?.target?.value }));
    }
  };

  const governData = [
    {
      id: 'Users',
      name: 'Users'
    },
    {
      id: 'Roles',
      name: 'Roles'
    }
  ];

  const onGovernData = (e) => {
    if (e?.target?.value) {
      if (e?.target?.value === 'Roles') {
        dispatch(getDropdownProjects());
        setValue('userId', null);
      } else if (e?.target?.value === 'Users') {
        setValue('roleId', null);
      }
      resetContents('govern');
      setGovern(e?.target?.value);
    }
  };

  const onProjectSelected = (e) => {
    if (e?.target?.value) {
      resetContents('project');
      dispatch(getRoles({ projectId: e?.target?.value }));
    }
  };

  const { organizationBranchData } = useMemo(
    () => ({
      organizationBranchData: organizationsLocByParent?.organizationObject?.rows || [],
      isLoading: organizationsLocByParent.loading || false
    }),
    [organizationsLocByParent]
  );

  return (
    <FormProvider methods={methods}>
      {rightsFor !== '' && (
        <Grid item xs={12} mt={-5}>
          <Button variant="contained" onClick={handleSubmit(onFormSubmit)} sx={{ mt: 4, float: 'right' }}>
            Proceed
          </Button>
        </Grid>
      )}
      <Grid container spacing={4} alignItems="center" sx={{ mb: 2 }}>
        <Grid item md={3} xl={2}>
          {selectBox('governType', 'Govern', governData, true, onGovernData)}
        </Grid>
        {govern === 'Users' && (
          <>
            <Grid item md={3} xl={2}>
              {selectBox('organizationType', 'Organization Type', organizationTypeData, true, onOrgTypeSelected)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('organizationId', 'Organization', mergeNameAndCode(orgData), true, onOrgSelected)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox(
                'organisationBranchId',
                'Organization Branch',
                mergeNameAndCode(organizationBranchData),
                false,
                onOrgBranchSelected
              )}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('userId', 'User', concateNameAndCode(userData), true, onUserSelected)}
            </Grid>
          </>
        )}
        {govern === 'Roles' && (
          <>
            <Grid item md={3} xl={2}>
              {selectBox('projectId', 'Project', projectData, true, onProjectSelected)}
            </Grid>
            <Grid item md={3} xl={2}>
              {selectBox('roleId', 'Roles', rolesData, true, onRoleSelected)}
            </Grid>
          </>
        )}

        {rightsFor !== 'Menu' ? (
          <Grid item md={3} xl={2}>
            {selectBox('rightsFor', 'Rights For', rightsData, true, onRightsSelected)}
          </Grid>
        ) : (
          <Grid item md={3} xl={2}></Grid>
        )}
        {rightsFor === 'Masters' && storesDropDown && storesDropDown.length > 0 && (
          <Grid item md={3} xl={2}>
            {selectBox('storesId', store, storesDropDown, true, onStoreSelected)}
          </Grid>
        )}
        {rightsFor === 'Masters' && showProject && (
          <Grid item md={3} xl={2}>
            {selectBox('projectGovernId', 'Govern Project', projectGovernData, true, () => {
              resetTable([]);
            })}
          </Grid>
        )}
        {rightsFor !== '' && (
          <>
            {userDetails !== null && userData.length > 0 && (
              <>
                <Grid item xs={12} mt={-5}></Grid>
                <Grid item xs={3}>
                  <RHFTextField name="code" value={userDetails.code} type="text" label="Code" disabled />
                </Grid>
                <Grid item xs={3}>
                  <RHFTextField name="mobileNumber" value={userDetails.mobileNumber} type="text" label="Mobile Number" disabled />
                </Grid>
                <Grid item xs={3}>
                  <RHFTextField name="email" value={userDetails.email} type="text" label="Email" disabled />
                </Grid>{' '}
              </>
            )}
          </>
        )}
      </Grid>
    </FormProvider>
  );
};

FilterData.propTypes = {
  rightsFor: PropTypes.string,
  rightsData: PropTypes.array,
  setAllData: PropTypes.func,
  resetTable: PropTypes.bool
};

export default FilterData;
