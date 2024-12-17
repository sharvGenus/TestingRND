import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useWorkAreaAssignments = () => {
  const [workAreaAssignments, setWorkAreaAssignments] = useState({
    workAreaAssignmentsObject: {},
    error: '',
    loading: true
  });

  const [workAreaAssignmentHistory, setWorkAreaAssignmentHistory] = useState({
    workAreaAssignmentHistoryObject: {},
    error: '',
    loading: true
  });

  const workAreaAssignmentsData = useSelector((state) => state.workAreaAssignments || {});
  const workAreaAssignmentHistoryData = useSelector((state) => state.workAreaAssignmentHistory || {});

  useEffect(() => {
    setWorkAreaAssignments((prev) => ({
      ...prev,
      ...workAreaAssignmentsData
    }));
  }, [workAreaAssignmentsData]);

  useEffect(() => {
    setWorkAreaAssignmentHistory((prev) => ({
      ...prev,
      ...workAreaAssignmentHistoryData
    }));
  }, [workAreaAssignmentHistoryData]);

  return { workAreaAssignments, workAreaAssignmentHistory };
};
