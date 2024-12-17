import { Button, styled } from '@mui/material';

const TranslucentButton = styled(Button)(({ margin }) => ({
  background: 'none',
  border: 'none',
  padding: '3px',
  margin: margin || '-3px',
  minWidth: '1px',
  '&:hover': {
    backgroundColor: '#E6F4FF'
  }
}));

export default TranslucentButton;
