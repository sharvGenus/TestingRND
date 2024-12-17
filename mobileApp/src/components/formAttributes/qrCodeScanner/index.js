import { Text, TouchableOpacity, SafeAreaView, View, Modal, TextInput, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from './style';
import QRCodeScanner from 'react-native-qrcode-scanner';
import QRCode from 'react-native-qrcode-svg';
import { RNCamera } from 'react-native-camera';
import COLORS from '../../../constants/color';
import Required from '../required';
import Icon from '../../../helpers/icon/icon';

const QrCodeScanner = (props) => {
    const { name, value, setValue, qrType, description, required, editable, separatorType, error, validationsChecked } = props;
    const [open, setOpen] = useState(false);
    const [generator, setGenerator] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const [modalVisible, setModalVisible] = useState(false);
    const [scannedValues, setScannedValues] = useState([]);

    useEffect(() => {
        if (tempValue?.length) {
            if (validationsChecked) {
                validationsChecked(tempValue);
            }
        }
    }, [tempValue]);

    const getSeparator = (type) => {
        switch (type) {
            case 'space':
                return ' ';
            case 'comma':
                return ',';
            case 'hyphen':
                return '-';
            case 'underscore':
                return '_';
            case 'hash':
                return '#';
            case 'colon':
                return ':';
            case 'semiColon':
                return ';';
            case 'slash':
                return '/';
            default:
                return null;
        }
    };

    const onSuccess = (event, check) => {
        try {
            if (check === true) {
                if (separatorType && separatorType !== 'noSeparator') {
                    const separator = getSeparator(separatorType);
                    const splitValues = event.data
                        .split(separator)
                        .map((item) => item.trim())
                        .filter((item) => item.length > 0);
                    setScannedValues((prevValues) => [...prevValues, ...splitValues]);
                    setOpen(false);
                    setModalVisible(true);
                } else {
                    setTempValue(event.data?.toUpperCase());
                    setOpen(false);
                    setValue(event.data?.toUpperCase());
                    validationsChecked(event.data?.toUpperCase());
                }
            } else {
                setTempValue(event.data?.toUpperCase());
                setValue(event.data?.toUpperCase());
                validationsChecked(event.data?.toUpperCase());
                setOpen(false);
            }
        } catch (err) {
            console.error('An error occurred', err);
        }
    };

    const generateValue = { value };

    useEffect(() => {
        if (!value) {
            setGenerator(false);
        }
        setTempValue(value?.toUpperCase());
    }, [value]);

    const handleSelectValue = (selectedValue) => {
        setTempValue(selectedValue?.toUpperCase());
        setValue(selectedValue?.toUpperCase());
        setModalVisible(false);
        validationsChecked(selectedValue);
    };

    return (
        <SafeAreaView style={styles.container}>
            {qrType === 'scanner' ? (
                <View style={styles.field}>
                    <View style={styles.subContainer}>
                        <Text style={styles.heading}>{name}</Text>
                        {required === true ? <Required /> : null}
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
                                placeholder={'Scan QR Code'}
                                value={tempValue}
                                onChangeText={(event) => {
                                    setTempValue(event?.toUpperCase());
                                }}
                                editable={editable}
                                onBlur={() => onSuccess({ data: tempValue })}
                                autoCapitalize="characters"
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.iconStyle}
                            onPress={() => {
                                setOpen(true), setScannedValues([]);
                            }}
                        >
                            <Icon type="Ionicons" name="qr-code" size={30} color={COLORS.black} />
                        </TouchableOpacity>
                    </View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={open}
                        onRequestClose={() => {
                            setOpen(!open);
                        }}
                    >
                        <TouchableOpacity style={styles.centeredView} onPressOut={() => setOpen(false)}>
                            <View style={styles.modalView}>
                                <QRCodeScanner
                                    showMarker={true}
                                    onRead={(event) => onSuccess(event, true)}
                                    flashMode={RNCamera.Constants.FlashMode.auto}
                                />
                            </View>
                        </TouchableOpacity>
                    </Modal>
                </View>
            ) : qrType === 'generator' ? (
                <View style={styles.field}>
                    <View style={styles.subContainer}>
                        <Text style={styles.heading}>{name}</Text>
                        <TouchableOpacity onPress={() => setShowModal(!showModal)}>
                            <Icon type="MaterialIcons" name="info-outline" size={15} color={COLORS.black} extraStyles={styles.infoIcon} />
                        </TouchableOpacity>
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
                    <TouchableOpacity style={styles.inputField} onPress={() => setGenerator(true)}>
                        <Text style={styles.text}>QR Code Generator</Text>
                        <View style={styles.iconStyleGenerator}>
                            <Icon type="Ionicons" name="qr-code" size={30} color={COLORS.black} />
                        </View>
                    </TouchableOpacity>
                </View>
            ) : null}
            {generator === true ? (
                <View style={styles.qrGenerator}>
                    <QRCode value={JSON.stringify(generateValue)} />
                </View>
            ) : null}
            {error ? (
                <View style={styles.error}>
                    <Text style={{ color: 'red', paddingLeft: 20 }}>{error}</Text>
                </View>
            ) : (
                <></>
            )}
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <TouchableOpacity style={styles.modalContainer} onPressOut={() => setModalVisible(false)}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeadingText}>Please select one of these values:</Text>
                        <ScrollView>
                            {scannedValues.map((value, idx) => (
                                <TouchableOpacity key={idx} onPress={() => handleSelectValue(value)} style={styles.valueItem}>
                                    <Text style={styles.modalText}>{value}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
};

export default QrCodeScanner;
