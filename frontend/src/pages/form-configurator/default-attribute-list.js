import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { useDispatch } from 'react-redux';
import { useDefaultFormAttributes } from './useDefaultAttributes';
import { getDefaultFormAttributes } from 'store/actions';

export default function DefaultAttributeList(props) {
  const { onCallbackMethod, mode } = props;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getDefaultFormAttributes());
  }, [dispatch]);

  const { defaultFormAttributes } = useDefaultFormAttributes();
  const basicAttributesList = defaultFormAttributes?.defaultFormAttributesObject?.rows || [];

  return (
    <>
      <List sx={{ p: 2 }}>
        <ListItemText primary="Attributes" primaryTypographyProps={{ fontWeight: 'bold' }} />
        <Divider sx={{ mt: 1, mb: 1.5 }} />
        <ListItemText sx={{ pl: 1, mb: 1 }} primary="Basics" primaryTypographyProps={{ fontWeight: 'bold' }} />
        {basicAttributesList.slice(0, 10).map((item) => (
          <ListItemButton
            key={item.id}
            onClick={() => {
              !mode || mode === 'edit' ? onCallbackMethod({ default: item.name, mode: 'create', defaultAttributeId: item.id }) : {};
            }}
            sx={{ padding: '4px 4px 4px 16px' }}
          >
            <ListItemText primary={item.name} sx={{ color: !mode || mode === 'edit' ? 'black' : 'grey' }} />
          </ListItemButton>
        ))}
      </List>
      <Divider sx={{ ml: 1, mr: 1 }} />
      <List sx={{ p: 2 }}>
        <ListItemText sx={{ pl: 1, mb: 1 }} primary="Advanced" primaryTypographyProps={{ fontWeight: 'bold' }} />
        {basicAttributesList.slice(10).map((item) => (
          <ListItemButton
            key={item.id}
            onClick={() => {
              !mode || mode === 'edit' ? onCallbackMethod({ default: item.name, mode: 'create', defaultAttributeId: item.id }) : {};
            }}
            sx={{ padding: '4px 4px 4px 16px' }}
          >
            <ListItemText primary={item.name} sx={{ color: !mode || mode === 'edit' ? 'black' : 'grey' }} />
          </ListItemButton>
        ))}
      </List>
    </>
  );
}

DefaultAttributeList.propTypes = {
  onCallbackMethod: PropTypes.func.isRequired,
  mode: PropTypes.string
};
