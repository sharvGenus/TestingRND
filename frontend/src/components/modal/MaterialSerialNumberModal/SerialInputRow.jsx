import { TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { memo, useEffect, useState } from 'react';
import { BodyCell, BodyRow } from './SerialInputElements';

const SerialInputRow = memo(({ index, style, data }) => {
  const { segments, handleOnChange, onPaste } = data;

  const segmentValue = segments[index];
  const [localValue, setLocalValue] = useState('');

  useEffect(() => {
    setLocalValue(segmentValue);
  }, [segmentValue]);

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData('Text');

    if (pastedData.includes('\n')) {
      onPaste(event, index);
    } else {
      let newValue = event.target.value + pastedData;
      newValue = newValue.replace(/[^\w]/gi, '').toUpperCase();
      setLocalValue(newValue);
      handleOnChange(newValue, index);
    }
  };

  return (
    <BodyRow index={index} style={style} key={index}>
      <BodyCell width="20%">{index + 1}</BodyCell>
      <BodyCell width="80%">
        <TextField
          type="text"
          value={localValue}
          onChange={(event) => {
            let { value } = event.target;
            value = value.replace(/[^\w]/gi, '').toUpperCase();
            setLocalValue(value);
            handleOnChange(value, index);
          }}
          onPaste={handlePaste}
        />
      </BodyCell>
    </BodyRow>
  );
});

SerialInputRow.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  data: PropTypes.shape({
    segments: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.any
      })
    ).isRequired,
    handleOnChange: PropTypes.func.isRequired,
    onPaste: PropTypes.func.isRequired
  }).isRequired
};

export default SerialInputRow;
