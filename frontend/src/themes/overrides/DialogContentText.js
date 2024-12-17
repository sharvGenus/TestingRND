// ==============================|| OVERRIDES - DIALOG CONTENT TEXT ||============================== //

export default function DialogContentText(theme) {
  return {
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          fontSize: '0.825rem',
          color: theme.palette.text.primary
        }
      }
    }
  };
}
