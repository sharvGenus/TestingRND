import React, { useEffect, useRef, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image, KeyboardAvoidingView, Keyboard, ScrollView, Platform } from 'react-native';
import styles from './style';
import OTPTextView from 'react-native-otp-textinput';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../../constants/color';
import logo from '../../assets/images/logo.png';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../../components/button';
import { UserLoginWithOtp, ResendOtp } from '../../helpers/apiIntegration/userService';
import RNOtpVerify from 'react-native-otp-verify';
import Toast from '../../components/Toast';
import { useDispatch } from 'react-redux';
import { setLoader } from '../../actions/action';
import LinearGradient from 'react-native-linear-gradient';

const OtpScreen = ({ route }) => {
    const navigation = useNavigation();
    const [secretToken, setSecretToken] = useState(route?.params?.token);
    const [value, setValue] = useState();
    const otpRef = useRef();
    const dispatch = useDispatch();
    function setIsLoading(enabled) {
        dispatch(setLoader({ enabled }));
    }

    useEffect(() => {
        RNOtpVerify.getOtp()
            .then((p) => RNOtpVerify.addListener(otpHandler))
            .catch(console.log.bind(null, `> [genus-wfm] | [${new Date().toLocaleString()}] | [index.js] | [#29] | [error] | `));
        return () => {
            RNOtpVerify.removeListener();
        };
    }, [secretToken]);

    const otpHandler = (message) => {
        console.log('message :', message);
        const otp = /(\d{4})/g?.exec(message)?.[1];
        if (otp) {
            otpRef.current.setValue(otp);
            doLoginWithOtp(otp);
            RNOtpVerify.removeListener();
            Keyboard.dismiss();
        }
    };

    const doLoginWithOtp = (otp) => {
        UserLoginWithOtp({ secretToken, otp: otp || value }, navigation, setIsLoading, otpRef.current.setValue, dispatch);
    };

    const otpSendAgain = async () => {
        setIsLoading(true);
        const [res, status] = await ResendOtp(secretToken);
        if (status === 200 && res.data) {
            setSecretToken(res.data.token);
            Toast('OTP has been sent again', 1);
        }
        setIsLoading(false);
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <LinearGradient
                colors={[COLORS.gradientStartColor, COLORS.gradientEndColor]}
                style={styles.topContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <View style={styles.imageContainer}>
                    <Image
                        source={route?.params?.logoOneUrl ? { uri: route?.params?.logoOneUrl } : logo}
                        style={route?.params?.logoOneUrl ? styles.imageLogo : styles.genusLogo}
                        resizeMode="contain"
                    />
                </View>
            </LinearGradient>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={{ flex: 1, padding: 10 }}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <TouchableOpacity
                        style={styles.onBackPress}
                        onPress={() => {
                            setValue('');
                            navigation.replace('Login');
                        }}
                    >
                        <Icon name="arrow-back" size={30} color={COLORS.black} />
                    </TouchableOpacity>
                    <View style={styles.container}>
                        <View>
                            <Text style={styles.screenTitle}>
                                OTP has been sent to your registered mobile number {route?.params?.mobile || '91XXXXXXXX'}
                            </Text>
                        </View>
                        <View style={styles.inputField}>
                            <OTPTextView
                                ref={otpRef}
                                textInputStyle={styles.roundedTextInput}
                                inputCount={4}
                                handleText
                                defaultValue={value}
                                handleTextChange={setValue}
                                inputCellLength={1}
                                tintColor={COLORS.themeColor}
                                autoFocus={true}
                            />
                        </View>
                        <TouchableOpacity style={styles.inputField} onPress={otpSendAgain}>
                            <Text style={styles.resendOtp}> RESEND OTP </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <View style={styles.buttonContainer}>
                    <Button title="CONFIRM" onPress={() => doLoginWithOtp()} />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default OtpScreen;
