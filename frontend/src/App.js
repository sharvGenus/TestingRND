// project import
import { useEffect } from 'react';
import Routes from 'routes';
import ThemeCustomization from 'themes';
import Locales from 'components/Locales';
// import RTLLayout from 'components/RTLLayout';
import ScrollTop from 'components/ScrollTop';
import Snackbar from 'components/@extended/Snackbar';
import Notistack from 'components/third-party/Notistack';

// auth-providers
import { AuthProvider as Provider } from 'contexts/AuthContext';
import ErrorBoundary from 'ErrorBoundary';
import request from 'utils/request';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => {
  useEffect(() => {
    (async () => {
      try {
        const { data } = await request('/google-captcha-keys');
        if (data.success && data.data.siteKey) {
          sessionStorage.GOOGLE_CAPTCHA_KEY = data.data.siteKey || '6Ld4tnYmAAAAAPnfDu5jwrxKPDFDQZShQh8bmZf3';
        }
      } catch (error) {
        sessionStorage.GOOGLE_CAPTCHA_KEY = '6Ld4tnYmAAAAAPnfDu5jwrxKPDFDQZShQh8bmZf3';
      }
    })();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeCustomization>
        {/* <RTLLayout> */}
        <Locales>
          <ScrollTop>
            <Provider>
              <>
                <Notistack>
                  <Routes />
                  <Snackbar />
                </Notistack>
              </>
            </Provider>
          </ScrollTop>
        </Locales>
        {/* </RTLLayout> */}
      </ThemeCustomization>
    </ErrorBoundary>
  );
};

export default App;
