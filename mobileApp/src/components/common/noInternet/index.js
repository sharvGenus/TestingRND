import React from 'react';
import { Text, View } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import styles from './style';

/**
 * No Internet component
 */
function NoInternet() {
    const netInfo = useNetInfo();
    return (
        <React.Fragment>
            {!netInfo.isConnected ? (
                <View style={styles.noInternetBlock}>
                    <Text style={styles.errorMessage}>{'Check Internet Connection'}</Text>
                </View>
            ) : null}
        </React.Fragment>
    );
}

export default NoInternet;
