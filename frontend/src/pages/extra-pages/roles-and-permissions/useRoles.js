import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useRoles = () => {
  const [roles, setRoles] = useState({
    rolesObject: {},
    error: '',
    loading: true
  });
  const [roleProjects, setRoleProjects] = useState({
    roleProjectsObject: [],
    error: '',
    loading: true
  });
  const [rolesHistory, setRolesHistory] = useState({
    rolesHistoryObject: {},
    error: '',
    loading: true
  });

  const rolesData = useSelector((state) => state.roles || {});
  const rolesProjectsData = useSelector((state) => state.roleProjects || []);
  const rolesHistoryData = useSelector((state) => state.rolesHistory || {});

  useEffect(() => {
    setRoles((prev) => ({
      ...prev,
      ...rolesData
    }));
  }, [rolesData]);

  useEffect(() => {
    setRoleProjects((prev) => ({
      ...prev,
      ...rolesProjectsData
    }));
  }, [rolesProjectsData]);

  useEffect(() => {
    setRolesHistory((prev) => ({
      ...prev,
      ...rolesHistoryData
    }));
  }, [rolesHistoryData]);

  return { roles, roleProjects, rolesHistory };
};
