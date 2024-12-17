// ==============================|| OVERRIDES - TABLE PAGINATION ||============================== //

export default function TablePagination() {
  return {
    MuiTablePagination: {
      styleOverrides: {
        selectLabel: {
          fontSize: '0.825rem'
        },
        displayedRows: {
          fontSize: '0.825rem'
        }
      }
    }
  };
}
