import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CreateNewPermission from './create-new-permission';
import UserSelectorSection from './user-selector-section';
import { getUsers } from 'store/actions';
import { useUsers } from 'pages/extra-pages/users/useUsers';
import toast from 'utils/ToastNotistack';
import request from 'utils/request';

const Permissions = () => {
  const dispatch = useDispatch();

  const [initialFormData, setInitialFormData] = useState(null);
  const [pending, setPending] = useState(false);

  const { users } = useUsers();

  const userData = (!users.loading && users.usersObject?.rows) || [];

  useEffect(() => {
    if (!initialFormData?.organizationId) return;
    dispatch(getUsers({ all: true, organizationId: initialFormData?.organizationId })).then(() => setPending(false));
  }, [dispatch, initialFormData]);

  const onUserSelectionSubmitHandler = async (payload) => {
    const response = await request('/user-update-roles', { method: 'PUT', body: payload });

    if (response.success) {
      toast('Permissions updated successfully!', { variant: 'success', autoHideDuration: 10000 });
    } else {
      toast(response?.error?.message || 'Operation failed. Please try again.', { variant: 'error' });
    }
  };

  return (
    <>
      <CreateNewPermission
        onProceed={(data) => {
          setPending(true);
          setInitialFormData(data);
        }}
      />
      {initialFormData && !pending && (
        <UserSelectorSection onUpdateClickHandler={onUserSelectionSubmitHandler} userData={userData} initialFormData={initialFormData} />
      )}
    </>
  );
};

export default Permissions;
