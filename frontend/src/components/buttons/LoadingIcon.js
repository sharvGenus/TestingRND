import { Loading3QuartersOutlined } from '@ant-design/icons';
import { styled } from '@mui/material';

const loadingIconStyles = {
  padding: '10px',
  fontSize: '22px',
  marginRight: '7px',
  animation: 'rotate 4s linear infinite',
  '@keyframes rotate': {
    from: {
      transform: 'rotate(0deg)'
    },
    to: {
      transform: 'rotate(360deg)'
    }
  }
};

export const LoadingIcon = styled(Loading3QuartersOutlined)(({ theme, color }) => ({
  ...loadingIconStyles,
  color: color || theme.palette.text.primary
}));
