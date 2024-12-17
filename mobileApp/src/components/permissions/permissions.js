import React from 'react';
import { View, Text, Button, Modal, ScrollView, TouchableOpacity } from 'react-native';
import styles from './style';

const PermissionsModal = ({ isVisible, onGrant }) => {
    return (
        <Modal animationType="slide" transparent={true} visible={isVisible}>
            <View style={styles.mainModalView}>
                <View style={styles.modalView}>
                    <View style={styles.permissionsView}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.termsHeadingView}>
                                <Text style={styles.termsTextView}>{'Terms of service and privacy'} </Text>
                                <Text>
                                    {
                                        'We ask for the following app permissions while onboarding, in order to optimize the experience for you:'
                                    }
                                </Text>
                            </View>
                            <View style={styles.permissionsHeadingView}>
                                <Text style={styles.permissionsdescription}>{'Location'}</Text>
                                <Text>
                                    {
                                        'Access your location using GPS for high accuracy, and cellular data and Wi-Fi for approximate accuracy.It is recommended that you set your location sharing to Always as it helps us to show you location specific data for GENUS-WFM services.'
                                    }
                                </Text>
                            </View>
                            <View style={styles.permissionsHeadingViewTwo}>
                                <Text style={styles.permissionsdescription}>{'Camera'}</Text>
                                <Text>
                                    {
                                        'You can set up a profile picture from this. And to allow you to take a photo of field side & directly upload it to the app.'
                                    }
                                </Text>
                            </View>
                            <View style={styles.permissionsHeadingViewTwo}>
                                <Text style={styles.permissionsdescription}>{'Photos/Media/Files'} </Text>
                                <Text>
                                    {
                                        'Media access permission is needed to store and retrieve your uploads such as Profile Picture and pillar for field information on your device.'
                                    }
                                </Text>
                            </View>
                            <View style={styles.permissionsHeadingViewTwo}>
                                <Text style={styles.permissionsdescription}>{'Phone Number'}</Text>
                                <Text>{'Access your phone number and network info. Required to fetch network signal strength.'}</Text>
                            </View>
                        </ScrollView>
                    </View>
                    <TouchableOpacity onPress={() => onGrant()} style={styles.agreeButtonView}>
                        <Text style={styles.agreeButtonText}>{'I Agree'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default PermissionsModal;
