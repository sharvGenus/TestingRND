import React, { useEffect, useRef, useState } from 'react';
import { TextInput, View, Text, TouchableOpacity, PermissionsAndroid, Linking } from 'react-native';
import styles from './style';
import Geolocation from 'react-native-geolocation-service';
import { openSettings } from 'react-native-permissions';
import Icon from '../../../helpers/icon/icon';
import COLORS from '../../../constants/color';
import { NativeModules } from 'react-native';
import Required from '../required';
import Toast from '../../Toast';
import { Button } from 'react-native';

const SignalStrengthModule = NativeModules.SignalStrengthModule;
const NetworkSpeedModule = NativeModules.NetworkSpeedModule;

const InputField = (props) => {
    const {
        name,
        type,
        description,
        editable,
        maxLength,
        minLength,
        value,
        setValue,
        accuracyInMeter,
        autoCapture,
        minValue,
        maxValue,
        error,
        setError,
        validationsChecked,
        decimal,
        decimalPoints,
        required,
        networkType,
        isReady,
        refreshAllow,
        isEditOrResurvey
    } = props;

    const [signalStrength, setSignalStrength] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [accuracy, setAccuracy] = useState('');
    const [isWatching, setIsWatching] = useState(false);
    const [location, setLocation] = useState('');
    const [autoHeight, setAutoHeight] = useState('');
    const isFirstTimeResurveyCall = useRef(false);

    const onChange = (event) => {
        let modifiedValue = event;

        setValue(modifiedValue);
        setError();
    };

    const toggleIsWatching = () => {
        if (!location) return;
        setValue(location);
        if (accuracy > accuracyInMeter && accuracyInMeter) {
            setError(`You Are ${(accuracy - accuracyInMeter)?.toFixed(2)}m Away from Your Location`);
        } else {
            setError('');
        }
    };

    const watchId = useRef();
    const isAutoCapturing = useRef(autoCapture);
    const hasRendered = useRef(false);
    const isListenening = useRef(false);

    function watchPosition(isAutoCapture) {
        hasRendered.current = true;
        watchId.current = Geolocation.watchPosition(
            successCallback.bind(null, isAutoCapture),
            errorCallBack_highAccuracy.bind(null, isAutoCapture),
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
                interval: 1000,
                fastestInterval: 1000,
                distanceFilter: 0.00005
            }
        );
    }
    const generateCustomCode = () => {
        const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const digits = '0123456789';
        const randomLetters = Array.from({ length: 4 }, () => alphabets[Math.floor(Math.random() * alphabets.length)]).join('');
        const randomDigits = Array.from({ length: 6 }, () => digits[Math.floor(Math.random() * digits.length)]).join('');
        const customCode = randomLetters + randomDigits;
        return customCode;
    };

    useEffect(() => {
        if (type === 'Reference Code' && !value) {
            setValue(generateCustomCode());
        }
    }, [value]);

    useEffect(() => {
        return () => {
            if (!!watchId?.current?.toString()) {
                Geolocation.clearWatch(watchId.current);
                watchId.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (type === 'GEO Location' && autoCapture && isReady) {
            isAutoCapturing.current = true;
            setIsWatching(true);
        }
    }, [autoCapture, isReady]);

    useEffect(() => {
        isListenening.current = isWatching;
        if (type === 'GEO Location') {
            if (!watchId.current && !isWatching && !isAutoCapturing.current && hasRendered.current) {
            }

            // Start watching the user's location when the component mounts
            if (isWatching) {
                watchPosition(isAutoCapturing.current);
            }
            return () => {
                if (isAutoCapturing.current) isAutoCapturing.current = false;
                if (!!watchId?.current?.toString()) {
                    Geolocation.clearWatch(watchId.current);
                    watchId.current = null;
                }
            };
        }
    }, [isWatching]);

    const errorCallBack_highAccuracy = (isAutoCapture, error) => {
        if (error.code == error.TIMEOUT) {
            Geolocation.watchPosition(successCallback.bind(null, isAutoCapture), errorCallback_lowAccuracy, {
                enableHighAccuracy: false,
                timeout: 5000,
                maximumAge: 0,
                interval: 1000,
                fastestInterval: 1000,
                distanceFilter: 0.00005
            });
            return;
        }
        Toast(error.message, 0);
    };

    const errorCallback_lowAccuracy = (error) => {
        Toast(error.message, 0);
    };

    const successCallback = (isAutoCapture, position) => {
        if (isListenening.current) {
            const latitude = position?.coords?.latitude;
            const longitude = position?.coords?.longitude;
            const _accuracy = +position?.coords?.accuracy;
            setAccuracy(_accuracy);
            setLocation(`${latitude},${longitude},${_accuracy}`);
        }
    };

    useEffect(() => {
        if (value?.length > 0) {
            if (validationsChecked) {
                validationsChecked();
            }
            if (type === 'Email') {
                if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
                    setError('Please Enter Valid Email');
                }
            } else if (type === 'Number' || type === 'Text') {
                if (minLength !== '' && value?.length < minLength) {
                    setError(`Please Enter Atleast ${minLength} characters or numbers`);
                } else if (maxLength !== '' && value?.length > maxLength) {
                    setError(`Please Enter Less Than ${maxLength} characters or numbers`);
                } else if (minValue !== '' && parseInt(value, 10) < minValue) {
                    setError(`Please Enter Greater Than ${minValue}`);
                } else if (maxValue !== '' && parseInt(value, 10) > maxValue) {
                    setError(`Please Enter Less Than ${maxValue}`);
                } else {
                    setError();
                }
            }
            if (type === 'Number') {
                if (value?.length > 0) {
                    const checkValid = /^[0-9]+(\.[0-9]*)?$/;
                    if (!checkValid.test(value?.toString())) {
                        setError('Please Enter Valid Number.');
                    }
                }
            }
            if (type === 'Text') {
                if (!/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(value)) {
                    setError('Please Enter In English Only.');
                }
            }
            if (decimal === true && decimalPoints > 0) {
                const stringValue = value?.toString();
                const hasDecimal = stringValue.includes('.');

                if (hasDecimal) {
                    const parts = stringValue.split('.');

                    if (parts[1]?.length > decimalPoints || parts.length === 1) {
                        setError(`Values up to ${decimalPoints} decimal points are allowed only.`);
                    } else {
                        setValue(value);
                    }
                }
            }
        }
    }, [value]);

    useEffect(() => {
        if (signalStrength === true) {
            setSignalStrength(false);
            onSignalStrength();
        }
        return () => {
            if (networkType === 'Mbps') {
                NetworkSpeedModule.stopMonitoring();
            } else {
                stopListening();
            }
        };
    }, [signalStrength]);

    const onSignalStrength = async () => {
        const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE);
        const hasOnePermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if (hasPermission && hasOnePermission) {
            onReadNativeModules();
        } else {
            handleOpenSettings();
        }
        const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE);
        const statusLocation = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if (status && statusLocation === PermissionsAndroid.RESULTS.GRANTED) {
            onReadNativeModules();
        }
        if (status && statusLocation === PermissionsAndroid.RESULTS.DENIED) {
            Toast('Read Phone permission denied by user.', 0);
            handleOpenSettings();
        } else if (status && statusLocation === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            Toast('Please allow read phone permission.', 0);
            handleOpenSettings();
        }
    };

    const onReadNativeModules = () => {
        if (networkType === 'Mbps') {
            NetworkSpeedModule.startMonitoring((downSpeedMBps, upSpeedMBps) => {
                setValue(
                    `Download Speed:${downSpeedMBps ? downSpeedMBps?.toFixed(2) : 0}MB/s, Upload Speed:${
                        upSpeedMBps ? upSpeedMBps?.toFixed(2) : 0
                    }MB/s`
                );
            });
        } else if (!value) {
            startListening();
        } else if(value && isEditOrResurvey && !isFirstTimeResurveyCall.current){
            startListening();
            isFirstTimeResurveyCall.current = true;
        } else {
            Toast('You have captured Network Strength already', 1);
        }
    };

    const startListening = () => {
        SignalStrengthModule.startListening(
            (
                rsrp,
                rsrq,
                sinr,
                asu,
                carrierName,
                networkType,
                simSlotIndex,
                rsrp2,
                rsrq2,
                sinr2,
                asu2,
                carrierName2,
                networkTypeString2,
                simSlotIndex2
            ) => {
                const rsrpRate = `${!rsrp || rsrpRate === -1 || rsrp === 2147483647 ? null : `${rsrp}dBm`}`;
                const rsrqRate = `${!rsrq || rsrqRate === -1 || rsrq === 2147483647 ? null : `${rsrq}db`}`;
                const sinrRate = `${!sinr || sinrRate === -1 || sinr === 2147483647 ? null : `${sinr}db`}`;
                const asuRate = `${!asu || asuRate === -1 || asu === 2147483647 ? null : `${asu}asu`}`;
                const rsrp2Rate = `${!rsrp2 || rsrp2Rate === -1 || rsrp2 === 2147483647 ? null : `${rsrp2}dBm`}`;
                const rsrq2Rate = `${!rsrq2 || rsrq2Rate === -1 || rsrq2 === 2147483647 ? null : `${rsrq2}db`}`;
                const sinr2Rate = `${!sinr2 || sinr2Rate === -1 || sinr2 === 2147483647 ? null : `${sinr2}db`}`;
                const asuRate2 = `${!asu2 || asuRate2 === -1 || asu2 === 2147483647 ? null : `${asu2}asu`}`;

                const simArray = [];
                if (carrierName && networkType && simSlotIndex != -1) {
                    const sim1Details = `SIM${
                        simSlotIndex + 1
                    }: RSRP:${rsrpRate},RSRQ:${rsrqRate},SINR:${sinrRate},ASU:${asuRate},${carrierName},${networkType}`;
                    simArray.push(sim1Details);
                } else if (carrierName === null) {
                    const sim1NullDetails = `SIM${simSlotIndex + 1}: RSRP:null,RSRQ:null,SINR:null,ASU:null,No Service,null `;
                    simArray.push(sim1NullDetails);
                }
                if (carrierName2 && networkTypeString2 && simSlotIndex2 != -1) {
                    const sim2Details = `SIM${
                        simSlotIndex2 + 1
                    }: RSRP:${rsrp2Rate},RSRQ:${rsrq2Rate},SINR:${sinr2Rate},ASU:${asuRate2},${carrierName2},${networkTypeString2}`;
                    simArray.push(sim2Details);
                } else if (carrierName2 === null) {
                    const sim2NullDetails = `SIM${simSlotIndex2 + 1}: RSRP:null,RSRQ:null,SINR:null,ASU:null,No Service,null `;
                    simArray.push(sim2NullDetails);
                }
                simArray.sort((a, b) => {
                    if (a.includes('SIM1:') && !b.includes('SIM1:')) return -1;
                    if (b.includes('SIM1:') && !a.includes('SIM1:')) return 1;
                    return 0;
                });
                setValue((name) => (prev) => {
                    return simArray.join(';  ');
                });
                // Stop listening after processing the details for both SIMs
                stopListening();
                // }
            }
        );
    };

    // Stop listening to signal strength updates
    const stopListening = () => {
        SignalStrengthModule.stopListening();
    };

    async function handleOpenSettings() {
        try {
            await openSettings();
        } catch (error) {
            console.log('Unable to open App Settings:', error);
        }
    }

    const visitLocation = () => {
        const [lat, long] = type === 'GEO Location' && (value?.split(',') || []);
        Linking.openURL(`https://maps.google.com?q=${lat},${long}`);
    };

    const onFormattedDecimalValue = () => {
        let valueStr = value?.toString();
        if (valueStr === '.') {
            valueStr = '0';
        } else if (valueStr?.includes('.') && valueStr?.split('.')[1].length === 0) {
            valueStr += '0';
        } else if (valueStr?.includes('.') && valueStr?.split('.')[0].length === 0) {
            valueStr = '0' + valueStr;
        }

        setValue(valueStr);
    };

    return (
        <View style={styles.field}>
            <View style={styles.subContainer}>
                <Text style={styles.heading}>{name}</Text>
                {required === true ? <Required /> : <></>}
              {/* <TouchableOpacity onPress={() => setShowModal(!showModal)}>
                    <Icon type="MaterialIcons" name="info-outline" size={15} color={COLORS.black} extraStyles={styles.infoIcon} />
                </TouchableOpacity>   */}
                {showModal && description && (
                    <View style={styles.descriptionView}>
                        <TouchableOpacity style={styles.centeredView} onPressOut={() => setShowModal(false)}>
                            <View style={styles.modalView}>
                                <Text style={styles.descriptionText}>{description}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            {editable !== false && type === 'GEO Location' && value && (
                <View style={styles.locationCapturedView}>
                    <Text style={styles.locationCapturedText}>{'Location Captured*'}</Text>
                </View>
            )}
            <TouchableOpacity
                onPress={() => {
                    type === 'GEO Location' && editable !== false
                        ? toggleIsWatching()
                        : type === 'Network Strength'
                        ? setSignalStrength(true)
                        : '';
                }}
            >
                <TextInput
                    style={
                        editable && type === 'Network Strength' && networkType === 'dbm'
                            ? styles.networkSignalStrength
                            : type === 'Key Generator'
                            ? styles.keyGeneratorField
                            : editable && type != 'Network Strength'
                            ? [styles.inputField, { height: autoHeight ? Math.max(50, autoHeight) : 'auto' }]
                            : !editable && type === 'Network Strength' && networkType === 'dbm'
                            ? styles.networkSignalStrength
                            : type === 'Key Generator'
                            ? styles.nonEditableKeyGenerator
                            : type === 'Reference Code'
                            ? [styles.refrenceCodeField, { height: autoHeight ? Math.max(50, autoHeight) : 'auto' }]
                            : [styles.nonEditableField, { height: autoHeight ? Math.max(50, autoHeight) : 'auto' }]
                    }
                    multiline
                    placeholder={editable ? `Enter ${name}` : name}
                    value={typeof value === 'number' ? `${value}` : value}
                    onChangeText={(event) => onChange(event)}
                    onContentSizeChange={(event) => setAutoHeight(event?.nativeEvent?.contentSize?.height)}
                    editable={type === 'GEO Location' || type === 'Network Strength' ? false : editable}
                    onEndEditing={() => onFormattedDecimalValue()}
                    keyboardType={type === 'Number' ? 'number-pad' : 'visible-password'}
                    {...(maxLength &&
                        minLength && {
                            maxLength: maxLength ? parseInt(maxLength, 10) : 0,
                            minLength: minLength ? parseInt(minLength, 10) : 0
                        })}
                    numberOfLines={type === 'Network Strength' && type === 'Key Generator' ? 5 : type === 'GEO Location' ? 3 : 1}
                />
                {type === 'GEO Location' ? (
                    <View>
                        <Icon type="MaterialIcons" name="location-on" color={COLORS.black} size={40} extraStyles={styles.geoLocation} />
                        <View style={styles.locationFeatures}>
                            {editable !== false && (
                                <View style={styles.liveLocation}>
                                    <Text style={location ? [styles.liveLocationUnits, { width: `${location.length * 2}%` }] : ''}>
                                        {location}
                                    </Text>
                                </View>
                            )}
                            <View style={styles.visitLocation}>
                                <Button title="Visit Location" onPress={() => visitLocation()} disabled={!value ? true : false} />
                            </View>
                        </View>
                    </View>
                ) : type === 'Network Strength' ? (
                    <Icon type="MaterialIcons" name="network-cell" color={COLORS.black} size={30} extraStyles={styles.networkSignal} />
                ) : type === 'Reference Code' && refreshAllow ? (
                    <TouchableOpacity onPress={() => setValue(generateCustomCode())}>
                        <Icon type="Feather" name="refresh-ccw" color={COLORS.black} size={25} extraStyles={styles.refreshButtonView} />
                    </TouchableOpacity>
                ) : (
                    <></>
                )}
            </TouchableOpacity>
            {error ? (
                <View style={type === 'GEO Location' ? styles.error : null}>
                    <Text style={{ color: 'red', paddingLeft: 20 }}>{error}</Text>
                </View>
            ) : (
                <></>
            )}
        </View>
    );
};

export default InputField;
