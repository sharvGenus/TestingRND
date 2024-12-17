const { IconButton, styled } = require('@mui/material');

const SmallIconButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.5),
  '& .MuiSvgIcon-root': {
    fontSize: '20px',
    color: '#3c3c3c'
  },
  '&:disabled .MuiSvgIcon-root': {
    color: 'gray'
  },
  '&:hover': {
    backgroundColor: '#E6F4FF'
  }
}));

export default SmallIconButton;
