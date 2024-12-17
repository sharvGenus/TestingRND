import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import config from '../../helpers/apiIntegration/config';
import Header from '../../helpers/header/header';
import styles from './style';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SupervisorTicketsScreen = () => {
    const [userToken, setUserToken] = useState(null);
    const { baseUrl } = config;
    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                const token = await AsyncStorage.getItem('token');
                setUserToken(token);
            })();
        }, [])
    );
    const supervisorTicketsEndPoint = '/my-tickets';
    const supervisorTicketsUrl = `${baseUrl}auth/login-via-token?redirect_to=${supervisorTicketsEndPoint}`;

    return (
        userToken && (
            <SafeAreaView style={styles.mainContainer}>
                <Header screenName={'Supervisor Tickets'} />
                <WebView source={{ uri: supervisorTicketsUrl, headers: { Authorization: 'Bearer ' + userToken } }} />
            </SafeAreaView>
        )
    );
};

export default SupervisorTicketsScreen;
