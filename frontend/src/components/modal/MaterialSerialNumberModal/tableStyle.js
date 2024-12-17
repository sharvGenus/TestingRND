import { styled } from '@mui/material';

export const TableStyle = styled('table')(() => {
  return {
    width: 415,
    maxHeight: 300,
    overflowY: 'auto',
    textAlign: 'center',
    '& .table': {
      borderCollapse: 'Collapse',
      width: '100%'
    },
    td: {
      border: '1px solid #ddd',
      padding: '8px'
    },
    'tr:nth-child(even)': {
      backgroundColor: '#f2f2f2'
    },
    'tr:hover': {
      backgroundColor: '#ddd'
    },
    th: {
      paddingTop: 12,
      paddingBottom: 12,
      textAlign: 'center',
      backgroundColor: '#1677ff',
      color: 'white'
    }
  };
});
