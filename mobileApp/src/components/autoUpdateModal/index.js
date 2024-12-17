import { BackHandler, Linking, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import styles from './style';

const AutoUpdateModal = (props) => {
    const { storeUrl } = props;
    return (
        <View style={styles.modalView}>
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Update Available</Text>
                <Text style={styles.modalContent}>A new version of Genus WFM is available now.</Text>
                <TouchableOpacity
                    style={styles.modalUpdate}
                    onPress={() => {
                        [BackHandler.exitApp(), Linking.openURL(storeUrl)];
                    }}
                >
                    <Text style={styles.buttonOne}>Update Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default AutoUpdateModal;
