import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import { CardMedia, Grid, Stack, Typography } from '@mui/material';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import ConfirmModal from 'components/modal/ConfirmModal';

const ImageCard = ({ imageList, blockMode = false, base64Image = false, setValue, preview, type, mode, setState }) => {
  const [selected, setSelected] = useState();
  useEffect(() => {
    setSelected(0);
  }, [imageList]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [transformRef, setTransformRef] = useState(null);
  const handleNextImage = () => {
    if (selected < imageList?.length - 1) {
      setSelected(selected + 1);
      if (transformRef) {
        transformRef.resetTransform();
      }
    }
  };

  const handlePreviousImage = () => {
    if (selected > 0) {
      setSelected(selected - 1);
      if (transformRef) {
        transformRef.resetTransform();
      }
    }
  };

  const handleReset = () => {
    if (transformRef) {
      transformRef.resetTransform();
    }
  };

  const confirmDelete = () => {
    const finalValue = type === 'blob' ? '' : imageList?.filter((x, i) => i !== selected);
    setValue(preview.columnName, finalValue);
    setSelected(finalValue.length ? 0 : null);
    setOpenDeleteModal(false);
    setState((pre) => ({ ...pre, preview: { ...pre.preview, inputValue: finalValue } }));
  };

  return imageList?.length > 0 ? (
    <Grid container>
      <Grid item md={12}>
        <MainCard
          content={false}
          boxShadow={false}
          sx={{
            m: '0 auto',
            height: '100%',
            display: 'flex',
            border: 'none',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <TransformWrapper ref={setTransformRef}>
            <TransformComponent>
              <CardMedia
                component="img"
                image={
                  base64Image
                    ? typeof imageList[selected] === 'object'
                      ? URL.createObjectURL(imageList[selected])
                      : imageList[selected]
                    : typeof imageList[selected] === 'object'
                    ? URL.createObjectURL(imageList[selected])
                    : window.location.origin + imageList[selected]
                }
                sx={{ height: blockMode ? '72vh' : '90vh', objectFit: 'contain' }}
              />
            </TransformComponent>
          </TransformWrapper>
          <Stack direction="row" className="tools" sx={{ position: 'absolute', bottom: 5, zIndex: 1, backgroundColor: 'white' }}>
            {imageList.length > 1 && (
              <IconButton title="Prev" color="secondary" disabled={selected === 0} onClick={handlePreviousImage}>
                <LeftOutlined />
              </IconButton>
            )}
            {imageList.length > 1 && (
              <IconButton title="Next" color="secondary" disabled={selected >= imageList?.length - 1} onClick={handleNextImage}>
                <RightOutlined />
              </IconButton>
            )}
            <IconButton title="Reset" color="secondary" onClick={handleReset}>
              <SearchOffIcon />
            </IconButton>
          </Stack>
          {blockMode && mode !== 'view' && preview.update && type !== 'blob' && (
            <Stack direction="row" className="tools" sx={{ position: 'absolute', top: 5, right: 5, zIndex: 1, backgroundColor: 'white' }}>
              <IconButton title="Delete" color="secondary" onClick={() => setOpenDeleteModal(true)}>
                <DeleteOutlineIcon />
              </IconButton>
            </Stack>
          )}
        </MainCard>
      </Grid>
      <ConfirmModal
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        handleConfirm={confirmDelete}
        title="Delete Field"
        message="Are you sure you want to delete?"
        confirmBtnTitle="Delete"
      />
    </Grid>
  ) : (
    <Typography>Image Preview</Typography>
  );
};

ImageCard.propTypes = {
  imageList: PropTypes.array,
  blockMode: PropTypes.bool,
  base64Image: PropTypes.bool,
  setValue: PropTypes.func,
  preview: PropTypes.object,
  type: PropTypes.string,
  mode: PropTypes.string,
  setState: PropTypes.func
};

export default ImageCard;
