import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from './style';
import PhoneInput from 'react-native-phone-input';
import COLORS from '../../../constants/color';
import Icon from '../../../helpers/icon/icon';
import Required from '../required';

const PhoneNumber = (props) => {
    const {
        name,
        value = null,
        setValue,
        error,
        setError,
        setCountyCode,
        columnName,
        validationsChecked,
        editable,
        description,
        required
    } = props;
    const [showModal, setShowModal] = useState(false);
    const phoneInputRef = useRef();

    useEffect(() => {
        if (!value && phoneInputRef.current) {
            phoneInputRef.current.selectCountry('IN'); // Set the default country code
            phoneInputRef.current.setValue(''); // Clear the input value
        }
    }, [value]);

    const handlePhoneChange = (number, countryCode) => {
        setValue(number);
        if (validationsChecked) {
            validationsChecked(number);
        }
        setCountyCode((prev) => ({ ...prev, [columnName]: countryCode }));
    };

    return (
        <View style={styles.field}>
            <View style={styles.subContainer}>
                <Text style={styles.heading}>{name}</Text>
                {required === true ? <Required /> : <></>}
                {/* <TouchableOpacity onPress={() => setShowModal(!showModal)}>
                    <Icon type="MaterialIcons" name="info-outline" size={15} color={COLORS.black} extraStyles={styles.infoIcon} />
                </TouchableOpacity> */}
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
            <PhoneInput
                ref={phoneInputRef}
                initialValue={value}
                initialCountry=""
                onSelectCountry={(countryCode) => setCountyCode((prev) => ({ ...prev, [columnName]: countryCode }))}
                onChangePhoneNumber={(number, countryCode) => handlePhoneChange(number, countryCode)}
                textStyle={styles.phoneInput}
                style={styles.phoneContainer}
                disabled={editable === false ? true : false}
                textProps={{ placeholder: 'Enter Phone Number Here..', placeholderTextColor: 'red' }}
                offset={20}
            />
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
};

export default PhoneNumber;
