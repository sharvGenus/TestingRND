/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// project import
import useAuth from 'hooks/useAuth';
import request from 'utils/request';
import { getTokenFromCookie } from 'utils/utils';

// ==============================|| GUEST GUARD ||============================== //

const GuestGuard = ({ children }) => {
  const { isLoggedIn, emailPasswordSignIn } = useAuth();
  const navigate = useNavigate();

  const getUserDetailsByToken = async () => {
    const userDetails = await request('/get-user-details');
    if (userDetails.success) {
      emailPasswordSignIn(userDetails.data.data);
    }
  };

  useEffect(() => {
    localStorage.removeItem('user');
    if (getTokenFromCookie() && !isLoggedIn) {
      getUserDetailsByToken();
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn && window.location.pathname === '/login') {
      navigate('/login');
    } else if (isLoggedIn) {
      navigate('/sample-page');
    }
  }, [isLoggedIn]);

  return children;
};

GuestGuard.propTypes = {
  children: PropTypes.node
};

export default GuestGuard;
