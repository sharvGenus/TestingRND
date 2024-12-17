import { Text, View, SafeAreaView, TouchableOpacity, Image, Modal } from 'react-native';
import React, { useState, useRef } from 'react';
import logo from '../../../assets/images/user-solid.png';
import styles from './style';
import SignatureCapture from 'react-native-signature-capture';
import COLORS from '../../../constants/color';
import Icon from '../../../helpers/icon/icon';
import Required from '../required';

const Signature = (props) => {
    const { name, signatureImage, setSignatureImage, description, required } = props;
    const signatureRef = useRef(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [imageModal, setImageModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const saveSign = async () => {
        try {
            const pathName = await new Promise((resolve, reject) => {
                signatureRef.current.saveImage(
                    (res) => {
                        resolve(res.pathName);
                    },
                    (error) => {
                        reject(error);
                    }
                );
            });
            setSignatureImage(pathName);
        } catch (error_1) {
            console.error(error_1);
        }
    };
    const resetSign = () => {
        signatureRef.current.resetImage();
        setSignatureImage(null);
    };

    const onSaveEvent = (result) => {
        base64Image = `data:image/png;base64,${result?.encoded}`;
        setSignatureImage(base64Image);
        setModalVisible(false);
    };

    const onDragEvent = () => {
        console.log('dragged');
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
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <SignatureCapture
                    style={styles.signature}
                    ref={signatureRef}
                    onSaveEvent={onSaveEvent}
                    onDragEvent={onDragEvent}
                    saveImageFileInExtStorage={false}
                    showNativeButtons={false}
                    showTitleLabel={false}
                    backgroundColor="white"
                    strokeColor="black"
                    minStrokeWidth={4}
                    maxStrokeWidth={4}
                    viewMode={'portrait'}
                />

                <View style={{ flexDirection: 'row', backgroundColor: 'white' }}>
                    <TouchableOpacity style={styles.buttonStyle} onPress={() => setModalVisible(false)}>
                        <Text style={{ color: COLORS.themeColor }}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonStyle} onPress={resetSign}>
                        <Text style={{ color: COLORS.themeColor }}>Reset</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonStyle} onPress={saveSign}>
                        <Text style={{ color: COLORS.themeColor }}>Save</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            {!signatureImage ? (
                <TouchableOpacity style={styles.inputField} onPress={() => setModalVisible(true)}>
                    <Text style={styles.text}>Add Signature</Text>
                </TouchableOpacity>
            ) : (
                <View>
                    <TouchableOpacity style={styles.signatureContainer} onPress={() => setImageModal(true)}>
                        <Image
                            source={signatureImage.startsWith('data:image/png;base64') ? { uri: signatureImage } : logo}
                            style={styles.signatureImage}
                        />
                    </TouchableOpacity>
                    <Icon
                        type="Entypo"
                        name="circle-with-minus"
                        color={'red'}
                        size={25}
                        extraStyles={styles.iconStyle1}
                        onPress={() => {
                            setSignatureImage();
                        }}
                    />
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={imageModal}
                        onRequestClose={() => {
                            setImageModal(!imageModal);
                        }}
                    >
                        <TouchableOpacity style={styles.centeredView} onPressOut={() => setImageModal(false)}>
                            <View style={styles.modalView}>
                                <Image style={styles.modalImage} source={{ uri: signatureImage }} />
                            </View>
                        </TouchableOpacity>
                    </Modal>
                </View>
            )}
        </SafeAreaView>
    );
};

export default Signature;
