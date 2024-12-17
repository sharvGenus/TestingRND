import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const useSupervisorTickets = () => {
  const [supervisorTicket, setSupervisorTicket] = useState({
    supervisorTicketObj: [],
    error: '',
    loading: true
  });

  const supervisorTicketData = useSelector((state) => state.supervisorTickets || []);

  useEffect(() => {
    setSupervisorTicket((prev) => ({
      ...prev,
      ...supervisorTicketData
    }));
  }, [supervisorTicketData]);

  return { supervisorTicket };
};
