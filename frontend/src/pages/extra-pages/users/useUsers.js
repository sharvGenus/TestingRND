import { useSelector } from 'react-redux';

export const useUsers = () => {
  const usersData = useSelector((state) => state.users);
  const usersByPermissionData = useSelector((state) => state.usersByPermission);
  const usersWithFormsData = useSelector((state) => state.usersWithForms);
  const usersDataSecond = useSelector((state) => state.usersSecond);
  const usersHistoryData = useSelector((state) => state.usersHistory);
  const supervisorUsersData = useSelector((state) => state.supervisorUsers);

  return {
    users: usersData,
    usersByPermission: usersByPermissionData,
    usersWithForms: usersWithFormsData,
    usersSecond: usersDataSecond,
    usersHistory: usersHistoryData,
    supervisorUsers: supervisorUsersData
  };
};
