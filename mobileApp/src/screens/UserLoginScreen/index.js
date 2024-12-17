import { View, Text, SafeAreaView, KeyboardAvoidingView, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import styles from './style';
import logo from '../../assets/images/logo.png';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from '../../constants/color';
import ReactNativeBiometrics from 'react-native-biometrics';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/button';
import Toast from '../../components/Toast';

const UserLogin = (route) => {
    const routes = route?.route?.params;
    const [enable, setEnable] = useState(routes?.toggleCheckBox);
    const [value, setValue] = useState();
    const navigation = useNavigation();
    const rnBiometrics = new ReactNativeBiometrics();

    const biometric = () => {
        rnBiometrics
            .simplePrompt({ promptMessage: 'Confirm fingerprint' })
            .then((resultObject) => {
                const { success } = resultObject;

                if (success === true) {
                    navigation.navigate('DrawerStack');
                } else if (success === false) {
                    Toast('Please Enter your App Pin', 0);
                } else {
                    Toast('Please Enter your App Pin', 0);
                }
            })
            .catch((err) => {
                console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [index.js] | [#35] | [err] | `, err);
            });
    };

    const onEnableBiometric = () => {
        Alert.alert('', 'You have not enable biometric, To enable Press ok! ', [
            {
                text: 'OK',
                onPress: () => {
                    setEnable(true);
                }
            },
            { text: 'Cancel' }
        ]);
    };

    React.useEffect(() => {
        if (enable === true) {
            biometric();
        }
    }, [enable]);

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.topContainer}>
                <Image source={logo} />
            </View>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={styles.keyborardContainer}>
                <View style={styles.container}>
                    <View style={styles.titleView}>
                        <Text style={styles.title}>LOG IN</Text>
                    </View>
                    <View style={styles.container1}>
                        <View>
                            <Text style={styles.screenTitle}>ENTER YOUR APP PIN </Text>
                        </View>
                        <View style={styles.inputField}>
                            <SmoothPinCodeInput
                                value={value}
                                cellSpacing={20}
                                password={true}
                                onTextChange={(event) => setValue(event)}
                                autoFocus
                            />
                        </View>
                    </View>
                    <View>
                        <Text style={styles.text}>OR</Text>
                        <Text style={styles.biometricText}>LOG IN USING YOUR BIOMETRIC CREDENTIALS</Text>
                        <TouchableOpacity
                            style={styles.biometricIcon}
                            onPress={() => (enable === true ? biometric() : onEnableBiometric())}
                        >
                            <Icon name="fingerprint" size={50} color={COLORS.themeColor} />
                        </TouchableOpacity>
                        <Text style={styles.biometricLabel}>Touch Your Fingerprint Sensor</Text>
                        <TouchableOpacity style={styles.forgotView} onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.forgotText}>FORGOT APP PIN?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Button title="LOGIN" onPress={() => navigation.navigate('DrawerStack')} />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default UserLogin;
