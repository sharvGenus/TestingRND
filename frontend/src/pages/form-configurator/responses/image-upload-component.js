import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import toast from 'utils/ToastNotistack';

const FileInputComponent = ({ columnName, multiple, maxCount, maxSize, isDocument, setValue, value, validationsChecked }) => {
  const fileInputRef = useRef(null);

  const remCount = value?.[0] ? maxCount - value?.length : value?.length ? maxCount - value?.length + 1 : maxCount;

  const handlePlusIconClick = () => {
    fileInputRef?.current?.click();
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    const invalidFiles = files?.filter((file) =>
      isDocument ? !['application/pdf'].includes(file.type) : !['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)
    );
    const maxSizeByte = (maxSize || 0) * 1024 * 1024;
    const filesExceedingMaxSize = files.filter((file) => file.size > maxSizeByte);
    if (maxSize && filesExceedingMaxSize?.length > 0) {
      e.target.value = null;
      return toast(`File(s) exceed the maximum size limit of ${maxSize} MB.`, { variant: 'warning' });
    }
    if (files?.length > remCount) {
      e.target.value = null;
      return toast(`Number of images exceeds the limit (up to ${maxCount} allowed).`, { variant: 'warning' });
    }
    if (invalidFiles?.length > 0) {
      e.target.value = null;
      return isDocument
        ? toast('Please select only PDF files.', { variant: 'warning' })
        : toast('Please select only JPG/JPEG or PNG files.', { variant: 'warning' });
    }
    const cloned = {};
    if (!value || !value?.[0]) cloned[columnName] = [];
    // Replace spaces with underscores in file names
    files.forEach((file) => {
      const fileName = file.name.replace(/\s+/g, '_');
      const modifiedFile = new File([file], fileName, { type: file.type });
      cloned[columnName].push(modifiedFile);
    });
    setValue(columnName, cloned[columnName]);
    validationsChecked();
  };

  return (
    <React.Fragment>
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={isDocument ? 'application/pdf' : 'image/jpeg, image/jpg, image/png'}
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
      />
      <IconButton onClick={handlePlusIconClick} color="primary">
        <FileUploadOutlinedIcon />
      </IconButton>
    </React.Fragment>
  );
};

FileInputComponent.propTypes = {
  columnName: PropTypes.string,
  setInputs: PropTypes.func,
  inputs: PropTypes.object,
  multiple: PropTypes.bool,
  maxCount: PropTypes.string,
  remCount: PropTypes.string,
  maxSize: PropTypes.string,
  isDocument: PropTypes.bool,
  value: PropTypes.array,
  validationsChecked: PropTypes.func,
  setValue: PropTypes.func
};

export default FileInputComponent;
