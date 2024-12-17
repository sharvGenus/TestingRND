// material-ui
import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

// loader style
const LoaderWrapper = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 2001,
  width: '100%',
  '& > * + *': {
    marginTop: theme.spacing(2)
  }
}));

const LoaderBackground = styled('div')(() => ({
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  background: 'rgba(255, 255, 255, 0.4)',
  height: '100%',
  zIndex: '2000'
}));

// ==============================|| Loader ||============================== //

const Loader = () => (
  <LoaderBackground>
    <LoaderWrapper>
      <LinearProgress color="primary" />
    </LoaderWrapper>
  </LoaderBackground>
);

export default Loader;
