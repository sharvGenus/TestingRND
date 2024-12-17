// project import
import PropTypes from 'prop-types';
import Navigation from './Navigation';
import SimpleBar from 'components/third-party/SimpleBar';

// ==============================|| DRAWER CONTENT ||============================== //

const DrawerContent = ({ menus }) => {
  return (
    <SimpleBar
      sx={{
        '& .simplebar-content': {
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <Navigation
        menus={{
          items: menus
        }}
      />
    </SimpleBar>
  );
};

DrawerContent.propTypes = {
  menus: PropTypes.any
};

export default DrawerContent;
