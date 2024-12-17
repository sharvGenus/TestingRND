import { PaperClipOutlined } from '@ant-design/icons';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { Box, Button, Stack, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import toast from 'utils/ToastNotistack';

const generateFileName = (files) => {
  var fileName = files[0].name || files[0].fileName;
  fileName = fileName.length > 10 ? `${fileName.slice(0, 7)}...${fileName.slice(-9)}` : fileName;
  if (files.length === 1) {
    return fileName;
  } else {
    return `${fileName} (+${files.length - 1} other)`;
  }
};

const labelStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1px solid #1677FF',
  color: '#1677FF',
  borderRadius: 5,
  padding: '5px 10px',
  width: 123,
  cursor: 'pointer'
};
const cancelButtonStyles = {
  margin: 'auto 0 auto 10px',
  cursor: 'pointer',
  color: 'rgb(51, 126, 232)'
};
const textFieldSx = {
  width: '100%',
  '& .MuiFormHelperText-root': {
    // fontSize: '13px',
    // fontWeight: 500,
    marginLeft: '1px',
    marginTop: '7px',
    marginBottom: '10px'
  },
  '& .MuiInputBase-root': {
    display: 'none'
  }
};

const FileBox = ({ label, name, accept, value, setValue, multiple = false, required = false, ...other }) => {
  const { control } = useFormContext();

  const [files, setFiles] = useState(null);

  useEffect(() => {
    if (value) setFiles(value);
  }, [value]);

  const resetFiles = () => {
    setFiles(null);
    setValue(name, '');
  };

  const handleOnChange = (handleChange, event) => {
    const _files = event.target.files;

    setFiles(_files);

    const fileReaders = Object.values(_files).map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve({ action: 'create', fileName: file.name, fileData: reader.result });
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    );

    Promise.all(fileReaders)
      .then((base64Files) => {
        setValue(`${name}-paths`, base64Files);
      })
      .catch((error) => {
        resetFiles();
        toast(error.message || 'Something wrong happend while picking the file(s)', { variant: 'error' });
      });

    return handleChange(event);
  };

  if (!control) {
    // If we are here that means the component is not put in a controlled form
    // so we will show a dummy button instead of crashing the application
    return (
      <Stack spacing={1}>
        {required ? (
          <Button size="small" variant="outlined" htmlFor="files" color="primary" required>
            <PaperClipOutlined />
            &nbsp;{label}
          </Button>
        ) : (
          <Button size="small" variant="outlined" htmlFor="files" color="primary">
            {label}
          </Button>
        )}
      </Stack>
    );
  } else {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange: controllerOnChange, ...field }, fieldState: { error } }) => (
          <Stack spacing={1} mt={1}>
            <Box>
              <Box display="flex">
                <label htmlFor={`${name}-file`}>
                  <div style={labelStyles}>
                    <PaperClipOutlined />
                    &nbsp;{label}
                    {required && ' *'}
                  </div>
                </label>

                {files && files.length > 0 && <CancelOutlinedIcon onClick={resetFiles} style={cancelButtonStyles} />}
              </Box>

              <TextField
                {...field}
                id={`${name}-file`}
                name={name}
                helperText={error?.message || (files && files.length > 0 && generateFileName(files))}
                error={!!error}
                sx={textFieldSx}
                onChange={handleOnChange.bind(this, controllerOnChange)}
                inputProps={{ multiple, accept }}
                type="file"
                {...other}
              />
            </Box>
          </Stack>
        )}
      />
    );
  }
};

FileBox.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  value: PropTypes.object,
  multiple: PropTypes.bool,
  accept: PropTypes.string,
  required: PropTypes.bool
};

export default FileBox;
