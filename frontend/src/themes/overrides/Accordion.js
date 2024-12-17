// ==============================|| OVERRIDES - ALERT TITLE ||============================== //

export default function Accordion(theme) {
  return {
    MuiAccordion: {
      defaultProps: {
        disableGutters: true,
        square: true,
        elevation: 0
      },
      styleOverrides: {
        root: {
          border: 'none',
          '&:not(:last-child)': {
            borderBottom: 0
          },
          '&:before': {
            display: 'none'
          },
          '&.Mui-disabled': {
            backgroundColor: theme.palette.secondary.lighter
          }
        }
      }
    }
  };
}
