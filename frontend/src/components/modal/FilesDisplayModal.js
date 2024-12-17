import React, { Suspense, lazy, useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { PaperClipOutlined } from '@ant-design/icons';
import toast from 'utils/ToastNotistack';
import FileBox from 'components/attachments/FileBox';
import FileActions from 'components/attachments/FileActions';
import { transformDataWithFilePaths } from 'utils';

const camelCaseToWords = (term) => {
  const modified = term.replace(/([A-Z])/g, ' $1');
  return modified.charAt(0).toUpperCase() + modified.slice(1);
};
const filterKeysWithPaths = (data) => {
  return data ? Object.fromEntries(Object.entries(data).filter(([key]) => key.includes('-paths'))) : {};
};

const TableForm = lazy(() => import('tables/table'));
const Modal = lazy(() => import('@mui/material/Modal'));
const imageExtensions = ['png', 'jpeg', 'jpg', 'webp', 'gif', 'avif', 'tiff', 'svg'];

const modalStyles = { display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'scroll' };
const buttonSx = {
  border: '1px solid #1677FF',
  color: '#1677FF',
  backgroundColor: 'transparent',
  borderRadius: '5px',
  padding: '5px 10px',
  width: 125,
  height: '28px',
  cursor: 'pointer'
};
const modalBoxSx = {
  borderRadius: '10px',
  width: '85%',
  height: '80%',
  backgroundColor: 'white',
  paddingBottom: '3rem',
  overflow: 'scroll'
};
const submitButtonSx = { position: 'absolute', justifySelf: 'end', marginY: '1rem' };
const paperClipStyles = { marginRight: '5px' };

const isAnImageExtension = (extension) => imageExtensions.includes(extension.toLowerCase());
const replacePaths = (string) => string.replace('-paths', '');

const columns = [
  { Header: 'Actions', accessor: 'actions' },
  { Header: 'File Name', accessor: 'fileName' },
  { Header: 'Preview', accessor: 'preview' }
];

const calculateFinalLength = (selectedData, tasks) => {
  if (!selectedData) return 0;

  const deleteCount = tasks.filter((task) => task.action === 'delete' && task.key === selectedData?.key).length;
  const createCount = tasks.filter((task) => task.action === 'create' && task.key === selectedData?.key).length;
  const currentLength = selectedData?.data?.length || 0;

  return currentLength + createCount - deleteCount;
};

const FilesDisplayModal = ({ data, tasks, setTasks, update, view, setValue, fileFields }) => {
  const transformedData = transformDataWithFilePaths(data, fileFields);
  const filteredData = filterKeysWithPaths(transformedData);

  const [selectedData, setSelectedData] = useState(null);

  const handleClose = () => {
    if (view) {
      setSelectedData(null);
      return;
    }

    const { multiple, required } = selectedData;
    const projectedLength = calculateFinalLength(selectedData, tasks);

    if (!multiple && projectedLength > 1) {
      toast(`Multple ${selectedData?.title.toLowerCase()} not allowed. Delete the existing or current.`, {
        variant: 'error'
      });
      return;
    }

    if (required && projectedLength === 0) {
      toast(`Must have at least one ${selectedData?.title?.toLowerCase()}`, { variant: 'error' });
      return;
    }

    setSelectedData(null);
  };

  const handleDownload = ({ fileUrl, fileName }) => {
    fetch(fileUrl, {
      method: 'GET',
      headers: {
        'Content-Disposition': 'attachment'
      }
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        toast(error.message || 'Something wrong happened while downloading the file', { variant: 'error' });
      });
  };

  const handleDelete = useCallback(
    (item) => {
      setTasks((prev) => [
        ...prev,
        {
          key: selectedData?.key,
          action: 'delete',
          filePath: item
        }
      ]);
    },
    [selectedData?.key, setTasks]
  );

  const checkFlaggedForDeletion = useCallback(
    (filePath) => {
      return tasks
        .filter(
          (item) => typeof item === 'object' && item.key === selectedData?.key && item.filePath === filePath && item.action === 'delete'
        )
        .map((item) => item.filePath)
        .includes(filePath);
    },
    [selectedData?.key, tasks]
  );

  const handleUndo = useCallback(
    (filePath) => {
      setTasks(tasks.filter((item) => !(item.filePath == filePath && item.key === selectedData?.key && item.action === 'delete')));
    },
    [selectedData?.key, setTasks, tasks]
  );

  const tableData = useMemo(
    () =>
      selectedData?.data?.map((filePath) => {
        const fileUrl = `/api/v1/files/${filePath}`;
        const fileName = filePath.split('/').pop();
        return {
          filePath,
          actions: (
            <FileActions
              flaggedForDeletion={checkFlaggedForDeletion(filePath)}
              onDownload={() => handleDownload({ fileUrl, fileName })}
              onDelete={() => handleDelete(filePath)}
              onUndo={() => handleUndo(filePath)}
              update={update}
            />
          ),
          fileName,
          preview: isAnImageExtension(filePath.split('.').pop()) ? <img width="400px" height="auto" alt={filePath} src={fileUrl} /> : 'N/A'
        };
      }),
    [checkFlaggedForDeletion, handleDelete, handleUndo, selectedData?.data, update]
  );

  const setCreateTasks = (name, currentCreateTasks) => {
    const filteredTasks = tasks.filter((item) => !(item.action === 'create' && item.key === selectedData?.key));
    var updatedTasks = filteredTasks;
    if (currentCreateTasks) {
      updatedTasks = [...updatedTasks, ...currentCreateTasks.map((item) => ({ ...item, key: selectedData.key }))];
    }

    setTasks(updatedTasks);
    setValue(replacePaths(selectedData.key), '');
  };

  const getCreateTasks = () => {
    return tasks.filter((item) => item.action === 'create' && item.key === selectedData?.key);
  };

  if (!data) return <></>;
  return (
    <>
      {Object.entries(filteredData).map(([key, value]) => (
        <Button
          disableRipple
          sx={buttonSx}
          key={key}
          variant="outlined"
          onClick={() => {
            const [{ required, multiple, accept, label }] = fileFields.filter((item) => item.name === replacePaths(key));
            setSelectedData({
              key,
              required,
              multiple,
              accept,
              title: label,
              data: value
            });
          }}
        >
          <PaperClipOutlined style={paperClipStyles} />
          {camelCaseToWords(replacePaths(key))}
        </Button>
      ))}

      <Suspense fallback={<></>}>
        {selectedData && (
          <Modal open sx={modalStyles}>
            <Box style={modalBoxSx}>
              <Box marginTop="5rem" display="grid">
                <Box width="80%" height="100%" margin="auto" display="grid">
                  <Typography gutterBottom variant="h3">
                    {selectedData.title}
                  </Typography>
                  <Suspense fallback={<></>}>
                    <TableForm
                      hideActions
                      hideHeader
                      hidePagination
                      columns={columns}
                      data={tableData || []}
                      count={tableData?.length || 0}
                    />
                  </Suspense>
                  <Box position="relative" display="grid">
                    {update && (
                      <Box marginY="1rem" justifySelf="start">
                        <FileBox
                          name={replacePaths(selectedData.key)}
                          label={'Add More'}
                          accept={selectedData?.accept}
                          multiple={selectedData?.multiple}
                          value={getCreateTasks()}
                          setValue={setCreateTasks}
                        />
                      </Box>
                    )}

                    {view ? (
                      <Button sx={submitButtonSx} type="button" variant="outlined" onClick={handleClose}>
                        Close
                      </Button>
                    ) : (
                      <Button sx={submitButtonSx} type="button" variant="contained" onClick={handleClose}>
                        Submit
                      </Button>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Modal>
        )}
      </Suspense>
    </>
  );
};

FilesDisplayModal.propTypes = {
  data: PropTypes.object,
  fileFields: PropTypes.array,
  tasks: PropTypes.array,
  setTasks: PropTypes.func,
  update: PropTypes.bool,
  view: PropTypes.bool,
  setValue: PropTypes.func
};

export default FilesDisplayModal;
