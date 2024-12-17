import React, { useState } from 'react';
import { View, TouchableOpacity, Text, SafeAreaView, Alert, Platform, TextInput, ActivityIndicator, Image } from 'react-native';
import styles from './style';
import Required from '../required';
import COLORS from '../../../constants/color';
import Icon from '../../../helpers/icon/icon';
import { openCamera } from 'react-native-image-crop-picker';
import { check, openSettings, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import Toast from '../../Toast';
import ImageCropperTool from '../cropperTool';
import ocrLogo from '../../../assets/images/ocr.png';

const MeterReadingScanner = (props) => {
    const { name, description, required, value, setValue, editable, error, validationsChecked } = props;
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [croppedImage, setCroppedImage] = useState(false);
    const [imagePath, setImagePath] = useState(null);

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
                            await onCamera();
                    }
                    break;
                case RESULTS.LIMITED:
                    Toast('', 'The permission is limited: some actions are possible', 0);
                    break;
                case RESULTS.GRANTED:
                    await onCamera();
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

    const onCamera = async () => {
        try {
            const options = {
                includeBase64: true,
                maxFiles: 1
            };

            const image = await openCamera(options);
            if (image?.data) {
                setImagePath(image?.path);
                setCroppedImage(true);
            } else {
                Toast('Please Click An Image', 0);
            }
        } catch (err) {
            console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [index.js] | [#223] | [err] | `, err);
        }
    };

    const handleOpenSetting = async () => {
        try {
            await openSettings();
        } catch (error) {
            console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [index.js] | [#141] | [error] | `, error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
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
                <View style={styles.inputField}>
                    <View>
                        <TextInput
                            multiline
                            placeholder={'Scan Meter Reading'}
                            value={value}
                            onChangeText={(text) => {
                                setValue(text);
                                validationsChecked(text);
                            }}
                            editable={editable}
                            keyboardType="number-pad"
                        />
                        {isLoading && <ActivityIndicator color={COLORS.themeColor} size={'small'} style={styles.loader} />}
                    </View>
                    <TouchableOpacity onPress={() => checkPermissionCamera()} style={isLoading ? styles.iconStyle1 : styles.iconStyle}>
                        <Image source={ocrLogo} style={styles.ocrLogo} />
                    </TouchableOpacity>
                </View>
                {croppedImage === true && (
                    <ImageCropperTool
                        imagePath={imagePath}
                        setIsLoading={setIsLoading}
                        setValue={(...valueee) => {
                            setValue(...valueee);
                            validationsChecked(...valueee)
                        }}
                        setCroppedImage={setCroppedImage}
                        croppedImage={croppedImage}
                    />
                )}
                {error ? (
                    <View style={styles.error}>
                        <Text style={{ color: 'red', paddingLeft: 20 }}>{error}</Text>
                    </View>
                ) : (
                    <></>
                )}
            </View>
        </SafeAreaView>
    );
};

export default MeterReadingScanner;
