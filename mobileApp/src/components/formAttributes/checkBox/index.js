import { Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import styles from './style';
import CheckBox from '@react-native-community/checkbox';
import Icon from '../../../helpers/icon/icon';
import COLORS from '../../../constants/color';
import Required from '../required';

const CheckBoxTypes = (props) => {
    const {
        name,
        values,
        selectType,
        error,
        setError,
        validationsChecked,
        setToggleCheckBox,
        toggleCheckBox = [],
        description,
        required
    } = props;

    const [showModal, setShowModal] = useState(false);

    const isChecked = useCallback(
        (value) => {
            return toggleCheckBox?.includes(value);
        },
        [toggleCheckBox]
    );

    const handleCheckboxChange = (value) => {
        let _prev = [...toggleCheckBox];
        if (selectType === 'multi') {
            if (_prev.includes(value)) {
                _prev = _prev.filter((item) => item !== value);
            } else {
                _prev.push(value);
            }
        } else if (selectType === 'single') {
            _prev.length = 0;
            if (!_prev.includes(value)) {
                _prev[0] = value;
            }
        }
        setToggleCheckBox(_prev);
        if (validationsChecked) {
            validationsChecked(_prev);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.field}>
                <View style={styles.subContainer}>
                    <Text style={styles.heading}>{name}</Text>
                    {required === true ? <Required /> : <></>}
                    {/* <TouchableOpacity onPress={() => setShowModal(!showModal)}>
                        <Icon type="MaterialIcons" name="info-outline" size={15} color={COLORS.black} extraStyles={styles.infoIcon} />
                    </TouchableOpacity> */}
                    {showModal && description && (
                        <View style={styles.descriptionView}>
                            <TouchableOpacity style={styles.centeredDescriptionView} onPressOut={() => setShowModal(false)}>
                                <View style={styles.modalDescriptionView}>
                                    <Text style={styles.descriptionText}>{description}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                <View style={styles.checkBox}>
                    {values?.split(',').map((value) => (
                        <React.Fragment key={value}>
                            <CheckBox disabled={false} onValueChange={() => handleCheckboxChange(value)} value={isChecked(value)} />
                            <Text style={styles.checkBoxText}>{value.trim()}</Text>
                        </React.Fragment>
                    ))}
                    {error ? <Text style={styles.error}>{error}</Text> : <></>}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default CheckBoxTypes;
