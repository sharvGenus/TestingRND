import { Modal, TouchableOpacity, View, Text } from 'react-native';
import React, { useRef } from 'react';
import styles from './style';
import Toast from '../../Toast';
import { googleCloudVisionApi } from '../../../helpers/apiIntegration/userService';
import { CropView } from 'react-native-image-crop-tools';
import RNFS from 'react-native-fs';

const ImageCropperTool = (props) => {
    const { imagePath, setIsLoading, setValue, setCroppedImage, croppedImage } = props;
    const cropViewRef = useRef();

    const onOcrApiCall = async (imageData) => {
        setIsLoading(true);
        try {
            const payload = {
                requests: [
                    {
                        image: {
                            content: imageData
                        },
                        features: [{ type: 'TEXT_DETECTION', maxResults: 5 }]
                    }
                ]
            };
            const response = await googleCloudVisionApi(payload);

            if (response[0]?.data) {
                setIsLoading(false);
                setValue(response[0]?.data);
            } else {
                throw new Error("Can't read");
            }
        } catch (error) {
            setIsLoading(false);
            Toast(`Can't Read Clicked Image!`, 0);
        }
    };

    const onFetchResponse = async (response) => {
        const fileContent = await RNFS.readFile(response?.uri, 'base64');
        if (fileContent) {
            onOcrApiCall(fileContent);
            setCroppedImage(false);
        } else {
            Toast('Cropped Image Not Saved!', 0);
        }
    };

    return (
        <Modal visible={croppedImage} animationType="fade" transparent={true} onRequestClose={() => setCroppedImage(!croppedImage)}>
            <View style={styles.mainContainer}>
                <TouchableOpacity
                    style={styles.doneTextView}
                    onPress={() => {
                        cropViewRef.current.saveImage(true, 100);
                    }}
                >
                    <Text style={styles.doneTextStyles}>Done</Text>
                </TouchableOpacity>
                <CropView
                    sourceUrl={imagePath}
                    style={styles.mainContainer}
                    ref={cropViewRef}
                    onImageCrop={(res) => onFetchResponse(res)}
                />
            </View>
        </Modal>
    );
};

export default ImageCropperTool;
