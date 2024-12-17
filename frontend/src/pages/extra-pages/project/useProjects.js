import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useProjects = () => {
  const [projects, setProjects] = useState({
    projectsObject: {},
    error: '',
    loading: true
  });
  const [projectDetails, setProjectDetails] = useState({
    projectDetailsObject: {},
    error: '',
    loading: true
  });
  const [projectsDropdown, setProjectsDropdown] = useState({
    projectsDropdownObject: [],
    error: '',
    loading: true
  });
  const [allProjectsDropdown, setAllProjectsDropdown] = useState({
    projectsDropdownObject: [],
    error: '',
    loading: true
  });
  const [projectsGovernForRoleOrUser, setProjectsGovernForRoleOrUser] = useState({
    projectsObject: [],
    error: '',
    loading: true
  });
  const [projectsHistory, setProjectsHistory] = useState({
    projectsHistoryObject: {},
    error: '',
    loading: true
  });

  const projectsData = useSelector((state) => state.projects || {});
  const projectDetailsData = useSelector((state) => state.projectDetails || {});
  const projectsDropdownData = useSelector((state) => state.projectsDropdown || []);
  const allProjectsDropdownData = useSelector((state) => state.allProjectsDropdown || []);
  const projectsGovernForRoleOrUserData = useSelector((state) => state.projectsForRoleOrUser || []);
  const projectsHistoryData = useSelector((state) => state.projectsHistory || {});

  useEffect(() => {
    setProjects((prev) => ({
      ...prev,
      ...projectsData
    }));
  }, [projectsData]);

  useEffect(() => {
    setProjectDetails((prev) => ({
      ...prev,
      ...projectDetailsData
    }));
  }, [projectDetailsData]);

  useEffect(() => {
    setProjectsDropdown((prev) => ({
      ...prev,
      ...projectsDropdownData
    }));
  }, [projectsDropdownData]);

  useEffect(() => {
    setAllProjectsDropdown((prev) => ({
      ...prev,
      ...allProjectsDropdownData
    }));
  }, [allProjectsDropdownData]);

  useEffect(() => {
    setProjectsGovernForRoleOrUser((prev) => ({
      ...prev,
      ...projectsGovernForRoleOrUserData
    }));
  }, [projectsGovernForRoleOrUserData]);

  useEffect(() => {
    setProjectsHistory((prev) => ({
      ...prev,
      ...projectsHistoryData
    }));
  }, [projectsHistoryData]);

  return { projects, projectsDropdown, allProjectsDropdown, projectsHistory, projectsGovernForRoleOrUser, projectDetails };
};
