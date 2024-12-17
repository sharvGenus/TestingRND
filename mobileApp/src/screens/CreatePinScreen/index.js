import { View, Text, SafeAreaView, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import CheckBox from '@react-native-community/checkbox';
import React, { useEffect, useState } from 'react';
import styles from './style';
import logo from '../../assets/images/logo.png';
import { useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import Button from '../../components/button';
const CreatePin = () => {
    const navigation = useNavigation();
    const [toggleCheckBox, setToggleCheckBox] = useState(false);
    const [mPin, setMpin] = useState();
    const [confirmMpin, setConfirmMpin] = useState();
    const [error, setError] = useState();
    const [imeiNumber, setImeiNumber] = useState();

    const onMpinSubmit = () => {
        if (mPin != confirmMpin) {
            setError('The mpin and confirm mpin fields must be the same.');
        } else {
            navigation.navigate('UserLogin', { toggleCheckBox: toggleCheckBox });
            setError();
        }
    };
    useEffect(() => {
        DeviceInfo.getUniqueId()
            .then((item) => {
                setImeiNumber(item);
            })
            .catch((error) => {
                console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [index.js] | [#32] | [error] | `, error);
            });
    }, []);

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.topContainer}>
                <Image source={logo} />
            </View>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={styles.keyborardContainer}>
                <View style={styles.container}>
                    <View style={styles.titleView}>
                        <Text style={styles.title}>CREATE APP PIN</Text>
                    </View>
                    <View style={styles.container1}>
                        <View>
                            <Text style={styles.screenTitle}>SET APP PIN </Text>
                        </View>
                        <View style={styles.inputField}>
                            <SmoothPinCodeInput value={mPin} cellSpacing={20} password={true} onTextChange={(event) => setMpin(event)} />
                        </View>
                    </View>
                    <View style={styles.container2}>
                        <View>
                            <Text style={styles.screenTitle}>CONFIRM APP PIN </Text>
                        </View>
                        <View style={styles.inputField}>
                            <SmoothPinCodeInput
                                value={confirmMpin}
                                cellSpacing={20}
                                password={true}
                                onTextChange={(event) => setConfirmMpin(event)}
                            />
                        </View>
                        {error && <Text style={{ color: 'red', paddingLeft: 20 }}>{error}</Text>}
                    </View>
                    <View style={styles.checkBox}>
                        <CheckBox disabled={false} onValueChange={(key) => setToggleCheckBox(key)} value={toggleCheckBox} />
                        <Text style={styles.checkBoxText}>Enable Finger Print</Text>
                        <Text style={styles.checkBoxLine}>When enabled you can use fingerprint to access your app.</Text>
                    </View>
                </View>
                <Button title="CONFIRM" onPress={onMpinSubmit} />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default CreatePin;
