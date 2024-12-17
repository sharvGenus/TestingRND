import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const useTickets = () => {
  const [tickets, setTickets] = useState({
    ticketsObject: {},
    error: '',
    loading: true
  });

  const [ticketAging, setTicketAging] = useState({
    ticketAgingObject: {},
    error: '',
    loading: true
  });

  const [ticketHistory, setTicketHistory] = useState({
    ticketHistoryObject: null,
    error: '',
    loading: true
  });

  const ticketsData = useSelector((state) => state.tickets || {});
  const ticketAgingDate = useSelector((state) => state.ticketAging || {});
  const ticketHistoryData = useSelector((state) => state.ticketHistory || {});

  useEffect(() => {
    setTickets((prev) => ({
      ...prev,
      ...ticketsData
    }));
  }, [ticketsData]);

  useEffect(() => {
    setTicketAging((prev) => ({
      ...prev,
      ...ticketAgingDate
    }));
  }, [ticketAgingDate]);

  useEffect(() => {
    setTicketHistory((prev) => ({
      ...prev,
      ...ticketHistoryData
    }));
  }, [ticketHistoryData]);

  return { tickets, ticketAging, ticketHistory };
};
