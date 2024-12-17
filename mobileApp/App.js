import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, SafeAreaView, StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { Provider } from 'react-redux';
import COLORS from './src/constants/color';
import { store } from './src/helpers/configureStore';
import AppRouter from './src/navigation/AppRouter';
import NoInternet from './src/components/common/noInternet';
import SplashScreen from 'react-native-splash-screen';
import FlashMessage from 'react-native-flash-message';
import PermissionsModal from './src/components/permissions/permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from './src/components/loader';
import VersionCheck from 'react-native-version-check';
import AutoUpdateModal from './src/components/autoUpdateModal';
import { BaseUrl } from './src/helpers/apiIntegration/config';

const App = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const [isPermissionsModalVisible, setIsPermissionsModalVisible] = useState(false);
    const [updateValue, setUpdateValue] = useState('');

    const backgroundStyle = {
        backgroundColor: isDarkMode ? COLORS.darker : COLORS.lighter
    };

    useEffect(() => {
        (async () => {
            // await AsyncStorage.setItem('HOST', 'http://10.141.12.179');
            const host = await AsyncStorage.getItem('HOST');
            if (host) BaseUrl.updateUrl(host);
            const modalVisible = await AsyncStorage.getItem('AllPermissions');
            if (modalVisible === true) {
                setIsPermissionsModalVisible(false);
            } else {
                requestAllPermissions();
            }
        })();
        SplashScreen.hide();
    }, []);

    useEffect(() => {
        checkUpdateVersion();
    }, []);

    const requestAllPermissions = async () => {
        try {
            const permissionsToRequest = [
                PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
                PermissionsAndroid.PERMISSIONS.CAMERA,
                PermissionsAndroid.PERMISSIONS.ACCESS_MEDIA_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
            ];
            const status = await Promise.all(permissionsToRequest.map((x) => PermissionsAndroid.check(x)));
            if (status.some((x) => !x)) {
                setIsPermissionsModalVisible(true);
            }
        } catch (error) {
            console.error('Error checking permissions:', error);
        }
    };
    const handleGrantPermissions = async () => {
        try {
            const permissionsToRequest = [
                PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
                PermissionsAndroid.PERMISSIONS.CAMERA,
                PermissionsAndroid.PERMISSIONS.ACCESS_MEDIA_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
            ];
            const status = await PermissionsAndroid.requestMultiple(permissionsToRequest);
            if (status) {
                setIsPermissionsModalVisible(false);
            }
            // Check if all permissions were granted
            const allPermissionsGranted = Object.values(status).every((permissionStatus) => permissionStatus === 'granted');

            if (allPermissionsGranted === true) {
                // Mark that all permissions have been granted
                await AsyncStorage.setItem('AllPermissions', 'true');
            }
            setIsPermissionsModalVisible(false); // Close the modal
        } catch (error) {
            console.error('Error requesting permissions:', error);
        }
    };

    //Func for auto-update version from playstore and show pop-up
    const checkUpdateVersion = async () => {
        const updateNeeded = await VersionCheck.needUpdate({
            currentVersion: VersionCheck.getCurrentVersion()
        });
        setUpdateValue(updateNeeded);
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={backgroundStyle.backgroundColor} />
            <Provider store={store}>
                {updateValue?.isNeeded === true && <AutoUpdateModal storeUrl={updateValue?.storeUrl} />}
                <PermissionsModal isVisible={isPermissionsModalVisible} onGrant={handleGrantPermissions} />
                <Loader />
                <AppRouter />
                <NoInternet />
            </Provider>
            <FlashMessage position="top" animated hideOnPress autoHide />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    }
});

export default App;
