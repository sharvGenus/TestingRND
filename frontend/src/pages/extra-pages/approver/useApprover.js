import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useApprovers = () => {
  const [approvers, setApprovers] = useState({
    approversObject: {},
    error: '',
    loading: true
  });
  const [approversList, setApproversList] = useState({
    approversListObject: [],
    error: '',
    loading: true
  });

  const [reqApproversList, setReqApproversList] = useState({
    approversListObject: [],
    error: '',
    loading: true
  });

  const approversData = useSelector((state) => state.approvers || []);
  const approversListData = useSelector((state) => state.getAllApproversList || []);
  const reqApprovers = useSelector((state) => state.getAllApproversData || []);

  useEffect(() => {
    setApprovers((prev) => ({
      ...prev,
      ...approversData
    }));
  }, [approversData]);

  useEffect(() => {
    setApproversList((prev) => ({
      ...prev,
      ...approversListData
    }));
  }, [approversListData]);

  useEffect(() => {
    setReqApproversList((prev) => ({
      ...prev,
      ...reqApprovers
    }));
  }, [reqApprovers]);

  return { approvers, approversList, reqApproversList };
};
