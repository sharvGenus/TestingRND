import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import styles from './style';
import COLORS from '../../../constants/color';
import Required from '../required';
import Toast from '../../Toast';
import OTPTextView from 'react-native-otp-textinput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { getSendOtpResponse } from '../../../actions/action';

const PhoneNumber = (props) => {
    const {
        name,
        value,
        setValue,
        error,
        setError,
        columnName,
        setCountyCode,
        validationsChecked,
        editable,
        required,
        isVerify,
        verifiedValue,
        autoFillUserLoggedInNumber,
        formAtrId
    } = props;

    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otpButtonLabel, setOtpButtonLabel] = useState('Verify');
    const [isVerified, setIsVerified] = useState(false);
    const [requiredError, setRequiredError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [refused, setRefused] = useState(false);
    const isOffline = useSelector((state) => !!state.offlineEnabled?.enabled);
    const dispatch = useDispatch();

    const phoneInputRef = useRef();
    const prevValue = useRef();
    const otpRef = useRef();
    const sendVerificationResponse = useSelector((state) => state.sendOtp.sendOtpResponseList);

    useEffect(() => {
        (async () => {
            const fetchUserDetails = await AsyncStorage.getItem('userData');
            if (JSON.parse(fetchUserDetails)?.user?.mobileNumber && autoFillUserLoggedInNumber) {
                setValue(columnName, `${JSON.parse(fetchUserDetails)?.user?.mobileNumber}`);
                setCountyCode((prev) => ({ ...prev, [columnName]: phoneInputRef?.current?.getCallingCode() }));
            }
        })();
    }, []);

    useEffect(() => {
        if (verifiedValue === 'Verified') {
            setIsVerified(true);
            setShowOtpInput(false);
            setOtpButtonLabel('Verified');
            setRequiredError(true);
            setRefused(false);
        }
        if (verifiedValue === 'Refused') {
            setRefused(true);
            setIsVerified(true);
            setShowOtpInput(false);
            setOtpButtonLabel('Refused');
            setRequiredError(true);
        }
        if (verifiedValue === 'Not Verified') {
            setRefused(false);
            setIsVerified(false);
            setOtpButtonLabel('Verify');
            setRequiredError(false);
        }
    }, [verifiedValue]);

    useEffect(() => {
        if (
            phoneInputRef.current?.onChangeText &&
            typeof phoneInputRef.current.onChangeText === 'function' &&
            prevValue.current !== value
        ) {
            phoneInputRef.current.onChangeText(!value ? '' : value);
        }
        // if (!value && required) {
        //     return setError(name + ' is Required');
        // }
        if (!value && !required) {
            return setError(null);
        }
        if (value && phoneInputRef.current?.isValidNumber && typeof phoneInputRef.current.isValidNumber === 'function') {
            setError(phoneInputRef.current.isValidNumber(value) ? '' : 'Invalid Number');
        }
        if (value?.length > 0 && /[^0-9]/.test(value)) {
            setError('Invalid Number');
        }
        if (value?.startsWith('0') && value?.length === 11) {
            setError('Invalid Number');
        }
        if (phoneInputRef.current?.isValidNumber(value) && value?.length > 0 && isVerify && !requiredError && required && !isOffline) {
            setError('OTP Verification Required');
        }
        prevValue.current = value;

        if (value && showOtpInput) {
            setShowOtpInput(true);
        }
    }, [value, requiredError]);

    const handleVerify = async () => {
        setLoading(true);
        setOtp('');
        try {
            if (phoneInputRef.current?.isValidNumber(value) && value?.length > 0) {
                dispatch(getSendOtpResponse(value, formAtrId, Toast, setShowOtpInput, setOtpButtonLabel, setLoading));
            } else {
                setError('Invalid Number');
                setLoading(false);
            }
        } catch (error) {
            Toast('Can`t Verify Number', 0);
            setLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            if (!phoneInputRef.current.isValidNumber(value) && isVerified) {
                setOtpButtonLabel('Verify');
                setIsVerified(false);
                setShowOtpInput(false);
                setRequiredError(true);
                setOtp('');
            }
        })();
    }, [value, isVerified]);

    const handleRefuse = async () => {
        setRefused(true);
        setIsVerified(true);
        setShowOtpInput(false);
        setOtpButtonLabel('Refused');
        setRequiredError(true);
        setValue(`v_${columnName}`, 'Refused');
        const formattedResponseObject = sendVerificationResponse?.response;
        const output = `transaction_id:${formattedResponseObject?.transaction_id},status:${formattedResponseObject?.status}`;
        setValue(`vr_${columnName}`, output);
        Toast('OTP Verification Refused!', 2);
    };

    useEffect(() => {
        if (otp?.length === 4 && sendVerificationResponse) {
            if (otp === sendVerificationResponse?.otp) {
                setIsVerified(true);
                setShowOtpInput(false);
                setOtpButtonLabel('Verified');
                setRequiredError(true);
                setValue(`v_${columnName}`, 'Verified');
                const formattedResponseObject = sendVerificationResponse?.response;
                const output = `transaction_id:${formattedResponseObject?.transaction_id},status:${formattedResponseObject?.status}`;
                setValue(`vr_${columnName}`, output);
                Toast('Phone Number Verified!', 1);
            } else {
                Toast('Incorrect OTP!', 0);
            }
        }
    }, [otp]);

    return (
        <View style={styles.field}>
            <View style={styles.subContainer}>
                <Text style={styles.heading}>{name}</Text>
                {required === true ? <Required /> : <></>}
            </View>
            <PhoneInput
                ref={phoneInputRef}
                defaultValue={value}
                value={value}
                defaultCode="IN"
                layout="second"
                onChangeText={(text) => {
                    setValue(columnName, text);
                    if (validationsChecked) {
                        validationsChecked(text);
                    }
                    if (phoneInputRef?.current?.getCallingCode()) {
                        setCountyCode((prev) => ({ ...prev, [columnName]: phoneInputRef.current.getCallingCode() }));
                    }
                    if (!phoneInputRef?.current?.isValidNumber(text)) {
                        setRefused(false);
                        setOtpButtonLabel('Verify');
                        setIsVerified(false);
                        setShowOtpInput(false);
                        setOtp('');
                        setRequiredError(false);
                        setValue(`vr_${columnName}`, '');
                        setValue(`v_${columnName}`, 'Not Verified');
                    }
                    if (isOffline && !phoneInputRef?.current?.isValidNumber(text)) {
                        setValue(`vr_${columnName}`, '');
                        setValue(`v_${columnName}`, 'Not Verified');
                    }
                }}
                containerStyle={editable === true ? styles.phoneContainer : styles.nonEditableField}
                textInputStyle={styles.phoneInput}
                codeTextStyle={styles.codeText}
                textContainerStyle={styles.textContainer}
                disabled={editable === false ? true : false}
                disableArrowIcon={editable === false ? true : false}
            />
            {!isOffline && isVerify && (
                <>
                    {isVerified && (
                        <Text style={isVerified && !refused ? styles.verifiedStatusText : styles.refusedStatusText}>
                            {isVerified && !refused ? 'Verified' : 'Refused'}
                        </Text>
                    )}
                    {(otpButtonLabel === 'Verify' || otpButtonLabel === 'Resend OTP') && (
                        <View style={styles.errorButtonView}>
                            {error && (
                                <View style={styles.errorView}>
                                    <Text style={styles.error}>{error}</Text>
                                </View>
                            )}
                            <View style={styles.buttonView}>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (!showOtpInput) {
                                            handleVerify();
                                        } else if (!isVerified) {
                                            handleVerify();
                                        }
                                    }}
                                    disabled={isVerified || !phoneInputRef.current?.isValidNumber(value)}
                                >
                                    <Text style={!isVerified && !refused && styles.verifyButton}>
                                        {!isVerified && !refused && otpButtonLabel}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    {loading ? (
                        <ActivityIndicator size={'large'} color={COLORS.buttonColor} />
                    ) : (
                        showOtpInput === true && (
                            <View style={styles.inputField}>
                                <OTPTextView
                                    ref={otpRef}
                                    defaultValue={otp}
                                    textInputStyle={styles.roundedTextInput}
                                    inputCount={4}
                                    handleTextChange={(text) => {
                                        if (text?.length === 4) {
                                            setOtp(text);
                                        }
                                    }}
                                    inputCellLength={1}
                                    tintColor={COLORS.themeColor}
                                    autoFocus={true}
                                />
                                <TouchableOpacity
                                    style={styles.refuseButtonView}
                                    onPress={() => phoneInputRef.current.isValidNumber(value) && handleRefuse()}
                                >
                                    <Text style={styles.refusedIcon}>Refuse</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    )}
                </>
            )}
            {(isOffline || (!isOffline && !isVerify)) && error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
};

export default PhoneNumber;
