import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useTemplateList = () => {
  const [templateList, setTemplateList] = useState({
    templateObject: {},
    error: '',
    loading: true
  });

  const data = useSelector((state) => state.emailTemplatesList || {});
  useEffect(() => {
    setTemplateList((prev) => ({
      ...prev,
      ...data
    }));
  }, [data]);
  return { templateList };
};
