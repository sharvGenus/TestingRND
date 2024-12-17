import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const useTicketMapping = () => {
  const [formWiseTicketMapping, setFormWiseTicketMapping] = useState({
    formWiseTicketMappingObject: undefined,
    error: '',
    loading: true
  });

  const [projectWiseTicketMapping, setProjectWiseTicketMapping] = useState({
    projectWiseTicketMappingObject: undefined,
    error: '',
    loading: true
  });

  const formWiseTicketMappingData = useSelector((state) => state.formWiseTicketMapping || {});
  const projectWiseTicketMappingData = useSelector((state) => state.projectWiseTicketMapping || {});

  useEffect(() => {
    setFormWiseTicketMapping((prev) => ({
      ...prev,
      ...formWiseTicketMappingData
    }));
  }, [formWiseTicketMappingData]);

  useEffect(() => {
    setProjectWiseTicketMapping((prev) => ({
      ...prev,
      ...projectWiseTicketMappingData
    }));
  }, [projectWiseTicketMappingData]);

  return { formWiseTicketMapping, projectWiseTicketMapping };
};
