import { styled } from '@mui/material';
import { Box } from '@mui/system';

export const TableContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  width: 415,
  overflowY: 'auto'
});

export const HeaderCell = styled(Box)({
  width: (props) => props.width || '20%',
  paddingTop: 12,
  paddingBottom: 12,
  textAlign: 'center',
  backgroundColor: '#1677ff',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

export const BodyRow = styled(Box)(({ index }) => ({
  display: 'flex',
  backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'transparent',
  border: '1px solid #ddd',
  '&:hover': {
    backgroundColor: '#ddd'
  }
}));

export const BodyCell = styled(Box)({
  padding: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});
