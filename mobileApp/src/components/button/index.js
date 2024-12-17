import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { fonts } from '../../constants/themes';
import COLORS from '../../constants/color';

const index = ({ onPress, title, disabled }) => {
    return (
        <TouchableOpacity style={disabled ? styles.disabledButton : styles.button} onPress={onPress} disabled={disabled}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
};

export default index;

const styles = StyleSheet.create({
    button: {
        backgroundColor: COLORS.buttonColor,
        borderRadius: 6,
        padding: 15
    },
    disabledButton: {
        backgroundColor: COLORS.transparent,
        borderRadius: 6,
        padding: 15
    },
    text: {
        color: COLORS.white,
        fontSize: fonts.size.font12,
        fontFamily: fonts.type.publicSansRegular,
        textAlign: 'center'
    }
});
