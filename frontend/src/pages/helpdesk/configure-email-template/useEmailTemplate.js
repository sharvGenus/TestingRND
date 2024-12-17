import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useEmailTemplate = () => {
  const [templateList, setTemplateList] = useState({
    ticketEmailTemplates: {},
    error: '',
    loading: true
  });

  const data = useSelector((state) => state.ticketEmailTemplates || {});

  useEffect(() => {
    setTemplateList((prev) => ({
      ...prev,
      ...data
    }));
  }, [data]);
  return { templateList };
};
