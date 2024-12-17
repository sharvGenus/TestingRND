import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useSmtp = () => {
  const [smtp, setSmtp] = useState({
    smtpObject: {},
    error: '',
    loading: true
  });

  const smtpData = useSelector((state) => state.smtp);

  useEffect(() => {
    setSmtp((prev) => ({
      ...prev,
      ...smtpData
    }));
  }, [smtpData]);

  return { smtp };
};
