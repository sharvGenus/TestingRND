import { Text, View, SafeAreaView, TouchableOpacity, Alert, Image, Platform, Modal, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import styles from './style';
import Icon from '../../../helpers/icon/icon';
import COLORS from '../../../constants/color';
import { launchImageLibrary } from 'react-native-image-picker';
import { check, openSettings, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import logo from '../../../assets/images/user-solid.png';
import Required from '../required';
import Toast from '../../Toast';
import { Image as ImageCompressor } from 'react-native-compressor';
import ImageMarker, { ImageFormat, Position } from 'react-native-image-marker';
import { fonts } from '../../../constants/themes';
import Geolocation from 'react-native-geolocation-service';
import { RNCamera } from 'react-native-camera';
import RNFS from 'react-native-fs';

const Images = (props) => {
    const { name, disableLibaray, maxSize, image = [], setImage, imageCount, description, required } = props;

    const [modalVisible, setModalVisible] = useState(null);
    const [error, setError] = useState();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [cameraVisible, setCameraVisible] = useState(false);
    const camera = useRef(null);

    const onAlert = () => {
        disableLibaray === true
            ? checkPermissionCamera()
            : Alert.alert(
                  'Upload Image',
                  'Choose from gallery or take from camera',
                  [
                      {
                          text: 'Cancel',
                          style: 'cancel'
                      },
                      {
                          text: 'Gallery',
                          onPress: checkPermissionStorage
                      },
                      {
                          text: 'Camera',
                          onPress: checkPermissionCamera
                      }
                  ],
                  { cancelable: false }
              );
    };

    const checkPermissionCamera = async () => {
        try {
            const platformPermission = Platform.select({
                android: PERMISSIONS.ANDROID.CAMERA,
                ios: PERMISSIONS.IOS.CAMERA
            });

            const result = await check(platformPermission);

            switch (result) {
                case RESULTS.UNAVAILABLE:
                    Toast('This feature is not available on this device', 0);
                    break;
                case RESULTS.DENIED:
                    const requestResult = await request(platformPermission);
                    switch (requestResult) {
                        case RESULTS.GRANTED:
                            setShowCamera(true);
                            setCameraVisible(true);
                    }
                    break;
                case RESULTS.LIMITED:
                    Toast('', 'The permission is limited: some actions are possible', 0);
                    break;
                case RESULTS.GRANTED:
                    setShowCamera(true);
                    setCameraVisible(true);
                    break;
                case RESULTS.BLOCKED:
                    Alert.alert(
                        'Permission Blocked',
                        'Press OK and provide Camera Access permission in opened app setting',
                        [
                            {
                                text: 'Cancel',
                                style: 'cancel'
                            },
                            {
                                text: 'OK',
                                onPress: handleOpenSetting
                            }
                        ],
                        { cancelable: false }
                    );
            }
        } catch (error) {
            console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [index.js] | [#86] | [error] | `, error);
        }
    };

    const checkPermissionStorage = async () => {
        try {
            const platformPermission = Platform.select({
                android: PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION,
                ios: PERMISSIONS.IOS.PHOTO_LIBRARY
            });

            const result = await check(platformPermission);
            switch (result) {
                case RESULTS.UNAVAILABLE:
                    Toast('This feature is not available (on this device / in this context)', 0);
                    break;
                case RESULTS.DENIED:
                    const requestResult = await request(platformPermission);
                    switch (requestResult) {
                        case RESULTS.GRANTED:
                            onGallery();
                    }
                    break;
                case RESULTS.LIMITED:
                    Toast('', 'The permission is limited: some actions are possible', 0);
                    break;
                case RESULTS.GRANTED:
                    onGallery();
                    break;
                case RESULTS.BLOCKED:
                    Alert.alert(
                        'Permission Blocked',
                        'Press OK and provide Photo Gallery(Storage) Access permission in opened app setting',
                        [
                            {
                                text: 'Cancel',
                                style: 'cancel'
                            },
                            {
                                text: 'OK',
                                onPress: handleOpenSetting
                            }
                        ],
                        { cancelable: false }
                    );
            }
        } catch (error) {
            console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [index.js] | [#133] | [error] | `, error);
        }
    };

    const handleOpenSetting = async () => {
        try {
            await openSettings();
        } catch (error) {
            console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [index.js] | [#141] | [error] | `, error);
        }
    };

    const onGallery = async () => {
        setLoading(true);
        try {
            const getLocationAsync = () => {
                return new Promise((resolve, reject) => {
                    Geolocation.getCurrentPosition(
                        (position) => {
                            resolve(position.coords);
                            setLoading(false);
                        },
                        (error) => {
                            reject(error);
                            setLoading(false);
                        },
                        {
                            enableHighAccuracy: true,
                            timeout: 15000,
                            maximumAge: 0,
                            interval: 1000,
                            fastestInterval: 1000,
                            distanceFilter: 0.00005
                        }
                    );
                });
            };
            // Get location before capturing image
            const location = await getLocationAsync();
            const { latitude, longitude } = location;
            const options = {
                allowsEditing: true,
                multiple: true
            };
            const fileSizeLimitInBytes = parseInt(maxSize, 10);
            launchImageLibrary(options, async (response) => {
                const _image = image ? image : [];
                if (response.assets) {
                    let isSizeError = false;
                    const compressedImages = await Promise.all(
                        response.assets.map(async (selectedImage) => {
                            const fileSize = selectedImage?.fileSize / 1048576;
                            if (!maxSize || +fileSize.toString().substring(0, 6) <= fileSizeLimitInBytes) {
                                // Use latitude and longitude fetched earlier
                                const options = {
                                    backgroundImage: {
                                        src: `file://${selectedImage?.uri}`,
                                        scale: 1,
                                        alpha: 1
                                    },
                                    watermarkTexts: [
                                        {
                                            text: `  Latitude: ${latitude}\n  Longitude: ${longitude}\n  ${new Date().toLocaleString()}`,
                                            positionOptions: {
                                                position: Position.bottomLeft
                                            },
                                            style: {
                                                color: COLORS.white,
                                                fontSize: fonts.size.font30,
                                                fontName: fonts.type.publicSansSemiBold,
                                                shadowStyle: {
                                                    dx: 10,
                                                    dy: 10,
                                                    radius: 10,
                                                    color: COLORS.black
                                                },
                                                textBackgroundStyle: {
                                                    padding: '10%',
                                                    color: COLORS.transparent,
                                                    cornerRadius: {
                                                        topLeft: {
                                                            x: '20%',
                                                            y: '50%'
                                                        },
                                                        topRight: {
                                                            x: '20%',
                                                            y: '50%'
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    ],

                                    scale: 1,
                                    quality: 100,
                                    filename: selectedImage?.fileName,
                                    saveFormat: ImageFormat.jpg
                                };
                                const stamppedImage = await ImageMarker.markText(options);
                                const compressedImage = await ImageCompressor.compress(`file://${stamppedImage}`, {
                                    compressionMethod: 'auto',
                                    quality: 0.9
                                });
                                return {
                                    fileName: selectedImage.fileName,
                                    fileSize: selectedImage.fileSize,
                                    height: selectedImage.height,
                                    type: selectedImage.type,
                                    uri: compressedImage,
                                    width: selectedImage.width
                                };
                            } else {
                                isSizeError = true;
                                return null;
                            }
                        })
                    );
                    const filteredImages = compressedImages.filter((img) => img !== null);
                    setImage([..._image, ...filteredImages]);
                    setError(isSizeError ? `File size exceeds the limit (${maxSize} MB).` : '');
                } else if (response.didCancel) {
                    if (imageCount > 1) {
                        const compressedPrevImages = await Promise.all(
                            _image.map(async (prevImage) => {
                                const options = {
                                    backgroundImage: {
                                        src: `file://${prevImage?.uri}`,
                                        scale: 1,
                                        alpha: 1
                                    },
                                    watermarkTexts: [
                                        {
                                            text: `  Latitude: ${latitude}\n  Longitude: ${longitude}\n  ${new Date().toLocaleString()}`,
                                            positionOptions: {
                                                position: Position.bottomLeft
                                            },
                                            style: {
                                                color: COLORS.white,
                                                fontSize: fonts.size.font30,
                                                fontName: fonts.type.publicSansSemiBold,
                                                shadowStyle: {
                                                    dx: 10,
                                                    dy: 10,
                                                    radius: 10,
                                                    color: COLORS.black
                                                },
                                                textBackgroundStyle: {
                                                    padding: '10%',
                                                    color: COLORS.transparent,
                                                    cornerRadius: {
                                                        topLeft: {
                                                            x: '20%',
                                                            y: '50%'
                                                        },
                                                        topRight: {
                                                            x: '20%',
                                                            y: '50%'
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    ],

                                    scale: 1,
                                    quality: 100,
                                    filename: prevImage?.fileName,
                                    saveFormat: ImageFormat.jpg
                                };
                                const stamppedPrevImage = await ImageMarker.markText(options);
                                const compressedPrevImage = await ImageCompressor.compress(`file://${stamppedPrevImage}`, {
                                    compressionMethod: 'auto',
                                    quality: 0.9
                                });
                                return {
                                    fileName: prevImage.fileName,
                                    fileSize: prevImage.fileSize,
                                    height: prevImage.height,
                                    type: prevImage.type,
                                    uri: compressedPrevImage,
                                    width: prevImage.width
                                };
                            })
                        );
                        setImage([...compressedPrevImages]);
                    } else {
                        setImage([]);
                    }
                } else if (response === 'Permissions weren granted') {
                    setImage([]);
                } else {
                    setImage([]);
                }
            });
        } catch (error) {
            console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [index.js] | [#192] | [error] | `, error);
        }
    };

    const generateFileName = () => {
        const timestamp = new Date().getTime();
        const randomString = Math.random().toString(36).substring(2, 8); // Generates a random 6-character string
        return `image_${timestamp}_${randomString}`;
    };

    const onCamera = async () => {
        setLoading(true);
        try {
            const getLocationAsync = () => {
                return new Promise((resolve, reject) => {
                    Geolocation.getCurrentPosition(
                        (position) => {
                            resolve(position.coords);
                            setLoading(false);
                            setModalVisible(false);
                        },
                        (error) => {
                            reject(error);
                            setLoading(false);
                            setModalVisible(false);
                        },
                        {
                            enableHighAccuracy: true,
                            timeout: 15000,
                            maximumAge: 0,
                            interval: 1000,
                            fastestInterval: 1000,
                            distanceFilter: 0.00005
                        }
                    );
                });
            };

            const location = await getLocationAsync();
            const { latitude, longitude } = location;

            if (error?.length > 0) {
                setError();
            }

            if (camera.current !== null) {
                const imageData = await camera.current.takePictureAsync({});
                const imageDataArray = [imageData];
                const _image = image ? image : [];
                async function processImages(imageDataArray) {
                    const resultArray = [];

                    await Promise.all(
                        imageDataArray.map(async (imageData) => {
                            if (imageData.uri) {
                                const fileName = generateFileName();
                                const fileSize = await RNFS.stat(imageData?.uri);
                                const options = {
                                    backgroundImage: {
                                        src: `file://${imageData?.uri}`,
                                        scale: 1,
                                        alpha: 1
                                    },
                                    watermarkTexts: [
                                        {
                                            text: `  Latitude: ${latitude}\n  Longitude: ${longitude}\n  ${new Date().toLocaleString()}`,
                                            positionOptions: {
                                                position: Position.bottomLeft
                                            },
                                            style: {
                                                color: COLORS.white,
                                                fontSize: fonts.size.font42,
                                                fontName: fonts.type.publicSansSemiBold,
                                                shadowStyle: {
                                                    dx: 10,
                                                    dy: 10,
                                                    radius: 10,
                                                    color: COLORS.black
                                                },
                                                textBackgroundStyle: {
                                                    padding: '10%',
                                                    color: COLORS.transparent,
                                                    cornerRadius: {
                                                        topLeft: {
                                                            x: '20%',
                                                            y: '50%'
                                                        },
                                                        topRight: {
                                                            x: '20%',
                                                            y: '50%'
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    ],

                                    scale: 1,
                                    quality: 100,
                                    fileName: fileName,
                                    saveFormat: ImageFormat.jpg
                                };

                                const stamppedImage = await ImageMarker.markText(options);
                                const compressedImage = await ImageCompressor.compress(`file://${stamppedImage}`, {
                                    compressionMethod: 'auto',
                                    quality: 0.9
                                });
                                resultArray.push({
                                    fileName: fileName,
                                    fileSize: fileSize?.size,
                                    height: imageData.height,
                                    type: 'image/jpeg',
                                    uri: compressedImage,
                                    width: imageData.width
                                });
                            }
                        })
                    );

                    return resultArray;
                }
                const compressedImages = await processImages(imageDataArray);
                setImage([..._image, ...compressedImages]);
                setShowCamera(false);
            }
        } catch (err) {
            console.log(`Error in onCamera function: ${err}`);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {showCamera && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={cameraVisible}
                    onRequestClose={() => {
                        setCameraVisible(false);
                    }}
                >
                    <SafeAreaView style={StyleSheet.absoluteFill}>
                        <RNCamera
                            ref={camera}
                            style={styles.cameraView}
                            type={RNCamera.Constants.Type.back}
                            flashMode={RNCamera.Constants.FlashMode.auto}
                            captureAudio={false}
                        />
                        <View style={styles.buttonContainer}>
                            {loading && <ActivityIndicator size="small" color={COLORS.themeColor} />}
                            <TouchableOpacity style={styles.camButton} disabled={loading} onPress={() => onCamera()} />
                        </View>
                    </SafeAreaView>
                </Modal>
            )}
            <View style={styles.field}>
                <View style={styles.subContainer}>
                    <Text style={styles.heading}>{name}</Text>
                    {required === true ? <Required /> : <></>}
                    {/* <TouchableOpacity onPress={() => setShowModal(!showModal)}>
                        <Icon type="MaterialIcons" name="info-outline" size={15} color={COLORS.black} extraStyles={styles.infoIcon} />
                    </TouchableOpacity> */}
                    {showModal && description && (
                        <View style={styles.descriptionView}>
                            <TouchableOpacity style={styles.centeredDescriptionView} onPressOut={() => setShowModal(false)}>
                                <View style={styles.modalDescriptionView}>
                                    <Text style={styles.descriptionText}>{description}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                {parseInt(imageCount, 10) === 1 && image?.length === 0 ? (
                    <TouchableOpacity style={styles.inputField} onPress={onAlert}>
                        <Text style={styles.text}>Choose an Image</Text>
                        <View>
                            <Icon type="FontAwesome" name="camera" size={25} color={COLORS.black} extraStyles={styles.iconStyle} />
                        </View>
                    </TouchableOpacity>
                ) : (
                    <>
                        {image?.map((img, index) => (
                            <View key={index}>
                                <TouchableOpacity style={styles.imageContainer} onPress={() => (img?.uri ? setModalVisible(index) : true)}>
                                    <Image source={img?.uri ? { uri: img?.uri } : logo} style={styles.image} resizeMode="contain" />
                                </TouchableOpacity>
                                <Icon
                                    type="Entypo"
                                    name="circle-with-minus"
                                    color="red"
                                    size={25}
                                    extraStyles={styles.iconStyle1}
                                    onPress={() => {
                                        const prev = JSON.parse(JSON.stringify(image));
                                        prev.splice(index, 1);
                                        setImage(prev); // Call a function to remove the image at the given index
                                    }}
                                />
                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    visible={modalVisible === index}
                                    onRequestClose={() => {
                                        setModalVisible(null);
                                    }}
                                >
                                    <TouchableOpacity style={styles.centeredView} onPressOut={() => setModalVisible(null)}>
                                        <View style={styles.modalView}>
                                            <Image style={styles.modalImage} source={{ uri: img?.uri }} resizeMode="contain" />
                                        </View>
                                    </TouchableOpacity>
                                </Modal>
                            </View>
                        ))}
                        {parseInt(imageCount, 10) !== image?.length ? (
                            <TouchableOpacity style={styles.inputField} onPress={onAlert}>
                                <Text style={styles.text}>Choose an Image</Text>
                                <View>
                                    <Icon type="FontAwesome" name="camera" size={25} color={COLORS.black} extraStyles={styles.iconStyle} />
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <></>
                        )}
                    </>
                )}

                {error && <Text style={{ color: 'red', paddingLeft: 20 }}>{error}</Text>}
            </View>
        </SafeAreaView>
    );
};

export default Images;
