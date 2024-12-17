import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const useEscalation = () => {
  const [escalationMatrix, setEscalationMatrix] = useState({
    escalationMatrixObject: undefined,
    error: '',
    loading: true
  });

  const escalationMatrixData = useSelector((state) => state.escalationMatrix);

  useEffect(() => {
    setEscalationMatrix((prev) => ({
      ...prev,
      ...escalationMatrixData
    }));
  }, [escalationMatrixData]);

  return { escalationMatrix };
};
