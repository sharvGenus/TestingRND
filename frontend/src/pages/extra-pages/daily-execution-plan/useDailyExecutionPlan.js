import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useDailyExecutionPlan = () => {
  const [dailyExecutionPlan, setDailyExecutionPlan] = useState({
    dailyExecutionPlanObject: {},
    error: '',
    loading: true
  });

  const [allDailyExecutionPlan, setAllDailyExecutionPlan] = useState({
    allDailyExecutionPlanObject: {},
    error: '',
    loading: true
  });

  const [dailyExecutionPlanHistory, setDailyExecutionPlanHistory] = useState({
    dailyExecutionPlanHistoryObject: {},
    error: '',
    loading: true
  });

  // ---------------------------------------------------------------------------------------

  const dailyExecutionPlanData = useSelector((state) => state.dailyExecutionPlan || {});
  const allDailyExecutionPlanData = useSelector((state) => state.allDailyExecutionPlan || {});
  const dailyExecutionPlanHistoryData = useSelector((state) => state.dailyExecutionPlanHistory || {});

  // ---------------------------------------------------------------------------------------

  useEffect(() => {
    setDailyExecutionPlan((prev) => ({
      ...prev,
      ...dailyExecutionPlanData
    }));
  }, [dailyExecutionPlanData]);

  useEffect(() => {
    setAllDailyExecutionPlan((prev) => ({
      ...prev,
      ...allDailyExecutionPlanData
    }));
  }, [allDailyExecutionPlanData]);

  useEffect(() => {
    setDailyExecutionPlanHistory((prev) => ({
      ...prev,
      ...dailyExecutionPlanHistoryData
    }));
  }, [dailyExecutionPlanHistoryData]);

  // ---------------------------------------------------------------------------------------

  return {
    dailyExecutionPlan,
    allDailyExecutionPlan,
    dailyExecutionPlanHistory
  };
};
