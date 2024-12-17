// project import
import GuestGuard from 'utils/route-guard/GuestGuard';
import CommonLayout from 'layout/CommonLayout';
import AuthForgotPassword from 'sections/auth/auth-forms/AuthForgotPassword';
import AuthLogin from 'sections/auth/auth-forms/AuthLogin';
import AuthResetPassword from 'sections/auth/auth-forms/AuthResetPassword';

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <GuestGuard>
          <CommonLayout />
        </GuestGuard>
      ),
      children: [
        {
          path: '/',
          element: <AuthLogin />
        },
        {
          path: 'login',
          element: <AuthLogin />
        },
        {
          path: 'forgot-password',
          element: <AuthForgotPassword />
        },
        {
          path: 'reset-password',
          element: <AuthResetPassword />
        }
      ]
    }
  ]
};

export default LoginRoutes;
