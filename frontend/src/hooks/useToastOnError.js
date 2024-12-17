import { useEffect } from 'react';
import toast from 'utils/ToastNotistack';

// ==============================|| TOAST ON ERROR HOOK ||============================== //

export const useToastOnError = (error) => {
  useEffect(() => {
    if (error) {
      toast(error, { variant: 'error' });
    }
  }, [error]);
};
