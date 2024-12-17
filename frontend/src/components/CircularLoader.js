import { styled } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';

// loader style
const LoaderWrapper = styled('div')(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: '9999'
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

// ==============================|| Circular Loader ||============================== //

const CircularLoader = () => (
  <>
    <LoaderBackground>
      <LoaderWrapper>
        <CircularProgress color="primary" thickness={5} size={70} sx={{}} />
      </LoaderWrapper>
    </LoaderBackground>
  </>
);

export default CircularLoader;
