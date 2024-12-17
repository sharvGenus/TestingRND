import { Button } from '@mui/material';
import PropTypes from 'prop-types';

const ButtonAtom = ({ size, type, color, onClick, value, ...others }) => {
  return (
    <Button onClick={onClick} size={size} variant={type === 'submit' ? 'contained' : 'outlined'} color={color} {...others}>
      {value}
    </Button>
  );
};

ButtonAtom.propTypes = {
  size: PropTypes.string,
  type: PropTypes.string,
  color: PropTypes.string,
  value: PropTypes.string,
  onClick: PropTypes.func
};

export default ButtonAtom;
