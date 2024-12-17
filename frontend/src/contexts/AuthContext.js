import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';

import { LOGIN, LOGOUT, REGISTER } from 'store/reducers/actions';
import authReducer from 'store/reducers/auth';

// project import
import Loader from 'components/Loader';

// const
const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

// ==============================|| FIREBASE CONTEXT & PROVIDER ||============================== //

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(
    () => {
      let user;

      if (localStorage.getItem('user')) user = localStorage.getItem('user');

      if (user) {
        dispatch({
          type: LOGIN,
          payload: {
            isLoggedIn: true,
            user: {
              id: user.uid,
              email: user.email,
              name: user.displayName || 'Stebin Ben'
              // role: 'UI/UX Designer'
            }
          }
        });
      } else {
        dispatch({
          type: LOGOUT
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch]
  );

  const emailPasswordSignIn = async (user) => {
    dispatch({
      type: LOGIN,
      payload: {
        isLoggedIn: true,
        user: user
      }
    });
  };

  const register = async (email, password) => {
    localStorage.setItem(
      'user',
      JSON.stringify({
        email: email,
        password: password
      })
    );
    dispatch({
      type: REGISTER,
      payload: {
        isLoggedIn: true,
        user: {
          id: 1,
          email: email,
          name: 'Stebin Ben',
          role: 'UI/UX Designer'
        }
      }
    });
  };

  const logout = () => {
    // localStorage.clear();
    dispatch({
      type: LOGOUT
    });
  };

  const resetPassword = async () => {};

  const updateProfile = () => {};
  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        emailPasswordSignIn,
        login: () => {},
        logout,
        resetPassword,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
AuthProvider.propTypes = {
  children: PropTypes.node
};

export default AuthContext;
