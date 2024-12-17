import React, { useEffect, useState } from 'react';
import {
    View,
    SafeAreaView,
    TextInput,
    Image,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    ActivityIndicator,
    ScrollView,
    Platform
} from 'react-native';
import styles from './style';
import { useNavigation } from '@react-navigation/native';
import logo from '../../assets/images/logo.png';
import Button from '../../components/button';
import { UserVerify } from '../../helpers/apiIntegration/userService';
import Toast from '../../components/Toast';
import RNOtpVerify from 'react-native-otp-verify';
import { useDispatch } from 'react-redux';
import { setLoader } from '../../actions/action';
import COLORS from '../../constants/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BaseUrl } from '../../helpers/apiIntegration/config';
import { NativeModules } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import LinearGradient from 'react-native-linear-gradient';

const VersionNameModule = NativeModules.VersionNameModule;

const LoginScreen = () => {
    const [value, setValue] = useState(null);
    const [domainValue, setDomainValue] = useState(null);
    const [hash, setHash] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [verified, setVerified] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const [version, setVersion] = useState(null);
    const [imeiNumber, setImeiNumber] = useState();
    const [logoOneUrl, setLogoOneUrl] = useState(null);
    const [showLogoOne, setShowLogoOne] = useState(false);

    const dispatch = useDispatch();
    function setIsLoading(enabled) {
        dispatch(setLoader({ enabled }));
    }

    const onChange = (event, domainInput) => {
        if (domainInput === 'domain') {
            setDomainValue(event);
        } else {
            setValue(event);
        }
    };

    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            const host = await AsyncStorage.getItem('HOST');
            if (host) {
                setDomainValue(host);
            }
        })();
        RNOtpVerify.getHash()
            .then(setHash)
            .catch(console.log.bind(null, `> [genus-wfm] | [${new Date().toLocaleString()}] | [index.js] | [#28] | [error] | `));
        DeviceInfo.getUniqueId()
            .then((item) => {
                setImeiNumber(item);
            })
            .catch((error) => {
                console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [index.js] | [#32] | [error] | `, error);
            });
    }, []);

    useEffect(() => {
        VersionNameModule.getVersionName()
            .then((versionName) => setVersion(versionName))
            .catch((error) => console.error('Error getting versionName:', error));
    }, [version]);

    const onLogin = async () => {
        setIsLoading(true);
        try {
            if (version) {
                const [res, status] = await UserVerify(value, hash, version, imeiNumber);
                if (status === 200 && res.data) {
                    setIsLoading(false);
                    navigation.navigate('Otp', { ...res.data, mobile: value, logoOneUrl: logoOneUrl });
                    return res;
                }
                Toast('Something went wrong', 0);
            } else {
                Toast('No Version detected!', 0);
            }
        } catch (error) {
            Toast(error.message, 0);
        }
        setIsLoading(false);
    };

    const onVerifyDomain = async () => {
        setIsLoader(true);
        let domainwithoutProtocol = domainValue.replace(/(http|https):\/\//g, '');
        const protocol = domainValue.replace(domainwithoutProtocol, '').replace('://', '');
        domainwithoutProtocol = domainwithoutProtocol.includes('/') ? domainwithoutProtocol?.split('/')[0] : domainwithoutProtocol;
        let finalUri = `${protocol || 'http'}://${domainwithoutProtocol}`;
        const apiRoute = '/api/v1/verify-genus-domain';
        const domainUrl = `${finalUri}${apiRoute}`;
        try {
            const response = await axios({
                method: 'GET',
                url: domainUrl,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response?.request?.responseURL?.replace(apiRoute, '')) {
                setDomainValue(response?.request?.responseURL?.replace(apiRoute, ''));
            }
            setDisabled(false);
            setVerified(true);
            setIsLoader(false);
            await AsyncStorage.setItem('HOST', finalUri);
            BaseUrl.updateUrl(finalUri);
            onRefreshLogo();
        } catch (error) {
            setIsLoader(false);
            Toast(`Invalid Domain Can't Verify!`, 0);
        }
    };

    const onRefreshLogo = async () => {
        const host = await AsyncStorage.getItem('HOST');
        if (host) {
            try {
                const responseLogoOne = await axios({
                    method: 'GET',
                    url: `${host}/project-logo?logoType=logo-one`,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (responseLogoOne.status === 200) {
                    setLogoOneUrl(`${host}/project-logo?logoType=logo-one`);
                    setShowLogoOne(true);
                }
            } catch (error) {
                if (error.code !== 'ERR_BAD_REQUEST') {
                    console.log('error :', error);
                }
            }
        }
    };

    useEffect(() => {
        onRefreshLogo();
    }, []);

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
                        source={showLogoOne ? { uri: logoOneUrl } : logo}
                        style={showLogoOne ? styles.imageLogo : styles.genusLogo}
                        resizeMode="contain"
                    />
                </View>
            </LinearGradient>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={{ flex: 1, padding: 10 }}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.container}>
                        <View style={styles.inputFieldView}>
                            <Text style={!verified ? styles.inputTitle : styles.disabledInputTitle}>Domain</Text>
                            <TextInput
                                placeholderTextColor={disabled ? COLORS.black : COLORS.transparent}
                                style={styles.inputField}
                                value={domainValue}
                                keyboardType="default"
                                placeholder="Please Enter Your Domain Here.."
                                onChangeText={(event) => {
                                    onChange(event, 'domain');
                                }}
                                editable={!verified ? true : false}
                            />
                            {isLoader && <ActivityIndicator color={COLORS.themeColor} size={'small'} style={styles.loader} />}
                            <TouchableOpacity
                                style={styles.verifyButtonTextView}
                                onPress={() => onVerifyDomain()}
                                disabled={!verified ? false : true}
                            >
                                <Text style={!verified ? styles.verifyButtonText : styles.disabledVerifyButtonText}>
                                    {!verified ? 'Verify' : 'Verified'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputFieldView}>
                            <Text style={disabled ? styles.disabledInputTitle : styles.inputTitle}>Mobile Number</Text>
                            <View>
                                <TextInput
                                    placeholderTextColor={disabled ? COLORS.transparent : COLORS.black}
                                    style={styles.inputField}
                                    value={value}
                                    maxLength={10}
                                    keyboardType="numeric"
                                    placeholder="Please Enter Your Mobile Number Here.."
                                    onChangeText={(event) => {
                                        onChange(event);
                                    }}
                                    editable={disabled ? false : true}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.buttonContainer}>
                    <Button title="LOGIN" onPress={() => onLogin()} disabled={disabled} />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default LoginScreen;
