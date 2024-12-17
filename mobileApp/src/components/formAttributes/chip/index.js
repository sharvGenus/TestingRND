import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import styles from './style';
import Icon from '../../../helpers/icon/icon';
import COLORS from '../../../constants/color';
import Required from '../required';

const Chip = (props) => {
    const { name, values, chipValue, setChipValue, error, setError, validationsChecked, description, required } = props;
    const [showModal, setShowModal] = useState(false);
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
                <View style={styles.chipContainer}>
                    {values?.map((list, index) => (
                        <Text
                            key={index}
                            onPress={() => {
                                setChipValue(list);
                                if (validationsChecked) {
                                    validationsChecked(list);
                                }
                            }}
                            style={chipValue === list ? styles.chipSelect : styles.chipText}
                        >
                            {list}
                        </Text>
                    ))}
                    {error ? <Text style={styles.error}>{error}</Text> : <></>}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Chip;
