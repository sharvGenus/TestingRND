/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// project import
import useAuth from 'hooks/useAuth';
import { getTokenFromCookie } from 'utils/utils';
import request from 'utils/request';

// ==============================|| AUTH GUARD ||============================== //

const AuthGuard = ({ children }) => {
  const { isLoggedIn, emailPasswordSignIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getUserDetailsByToken = async () => {
    const userDetails = await request('/get-user-details');
    if (userDetails.success) {
      emailPasswordSignIn(userDetails.data.data);
    }
  };

  useEffect(() => {
    if (!isLoggedIn && !getTokenFromCookie()) {
      navigate('login', {
        state: {
          from: location.pathname
        },
        replace: true
      });
      navigate('login', { replace: true });
    } else if (!user && getTokenFromCookie()) {
      getUserDetailsByToken();
    }
  }, [isLoggedIn, user]);

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node
};

export default AuthGuard;
