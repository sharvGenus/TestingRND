import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import config from '../../helpers/apiIntegration/config';
import Header from '../../helpers/header/header';
import styles from './style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const ApproverDashboardScreen = () => {
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
    const approverEndPoint = '/approver-dashboard';
    const dashboardUrl = `${baseUrl}auth/login-via-token?redirect_to=${approverEndPoint}`;
    return (
        userToken && (
            <SafeAreaView style={styles.mainContainer}>
                <Header screenName={'Approver Dashboard'} />
                <WebView source={{ uri: dashboardUrl, headers: { Authorization: 'Bearer ' + userToken } }} />
            </SafeAreaView>
        )
    );
};

export default ApproverDashboardScreen;
