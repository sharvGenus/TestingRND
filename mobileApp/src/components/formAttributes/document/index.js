import { Text, View, TouchableOpacity, Alert, Image, Platform, Modal } from 'react-native';
import React, { useState } from 'react';
import styles from './style';
import { check, openSettings, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import Icon from '../../../helpers/icon/icon';
import DocumentPicker from 'react-native-document-picker';
import COLORS from '../../../constants/color';
import document from '../../../assets/images/document.png';
import Required from '../required';
import Toast from '../../Toast';

const Document = (props) => {
    const { name, images = [], setImages, description, required } = props;

    const [modalVisible, setModalVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);

    function onSelectPhoto() {
        checkPermissionStorage();
    }

    async function onChooseGallery() {
        try {
            const results = await DocumentPicker.pick({
                type: [
                    DocumentPicker.types.allFiles,
                    DocumentPicker.types.xls,
                    DocumentPicker.types.xlsx
                    // Add any other valid MIME types for other files
                ]
            });

            let object = results[0];
            if (object.type === 'image/jpeg' || object.type === 'image/png') {
                Toast('You cannot upload Images files', 0);
            } else {
                setImages([...results]);
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [index.js] | [#41] | [err] | `, err);
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    }

    async function checkPermissionStorage() {
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
                            onChooseGallery();
                    }
                    break;
                case RESULTS.LIMITED:
                    Toast('The permission is limited: some actions are possible', 0);
                    break;
                case RESULTS.GRANTED:
                    onChooseGallery();
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
                                onPress: handleOpenSettings
                            }
                        ],
                        { cancelable: false }
                    );
            }
        } catch (error) {
            console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [index.js] | [#93] | [error] | `, error);
        }
    }
    async function handleOpenSettings() {
        try {
            await openSettings();
        } catch (error) {
            console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [index.js] | [#100] | [error] | `, error);
        }
    }

    return (
        <View style={styles.container}>
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
                {images.length === 0 ? (
                    <TouchableOpacity style={styles.inputField} onPress={onSelectPhoto}>
                        <Text style={styles.text}>Upload Documents</Text>
                        <View>
                            <Icon
                                type="Ionicons"
                                name="document-attach-sharp"
                                size={35}
                                color={COLORS.black}
                                extraStyles={styles.iconStyle}
                            />
                        </View>
                    </TouchableOpacity>
                ) : (
                    <View>
                        <TouchableOpacity style={styles.imageContainer} onPress={() => setModalVisible(false)}>
                            <Image source={document} style={styles.image} resizeMode={'cover'} />
                        </TouchableOpacity>
                        <Icon
                            type="Entypo"
                            name="circle-with-minus"
                            color={'red'}
                            size={25}
                            extraStyles={styles.iconStyle1}
                            onPress={() => {
                                setImages([]);
                            }}
                        />
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => {
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <TouchableOpacity style={styles.centeredView} onPressOut={() => setModalVisible(false)}>
                                <View style={styles.modalView}>
                                    <Image style={styles.modalImage} source={{ uri: images[0]?.uri }} />
                                </View>
                            </TouchableOpacity>
                        </Modal>
                    </View>
                )}
            </View>
        </View>
    );
};

export default Document;
