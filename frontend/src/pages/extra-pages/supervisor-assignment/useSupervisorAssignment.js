import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useSupervisorAssignments = () => {
  const [supervisorAssignments, setSupervisorAssignments] = useState({
    supervisorAssignmentsObject: {},
    error: '',
    loading: true
  });

  const [supervisorAssignmentHistory, setSupervisorAssignmentHistory] = useState({
    supervisorAssignmentHistoryObject: {},
    error: '',
    loading: true
  });

  const supervisorAssignmentsData = useSelector((state) => state.supervisorAssignments || {});
  const supervisorAssignmentHistoryData = useSelector((state) => state.supervisorAssignmentHistory || {});

  useEffect(() => {
    setSupervisorAssignments((prev) => ({
      ...prev,
      ...supervisorAssignmentsData
    }));
  }, [supervisorAssignmentsData]);

  useEffect(() => {
    setSupervisorAssignmentHistory((prev) => ({
      ...prev,
      ...supervisorAssignmentHistoryData
    }));
  }, [supervisorAssignmentHistoryData]);

  return { supervisorAssignments, supervisorAssignmentHistory };
};
