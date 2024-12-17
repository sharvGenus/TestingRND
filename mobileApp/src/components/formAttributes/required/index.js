import { Text, View } from 'react-native';
import React from 'react';
import styles from './style';
import Icon from '../../../helpers/icon/icon';
import COLORS from '../../../constants/color';

const Required = () => {
    return (
        <View style={styles.container}>
            <Icon type="MaterialCommunityIcons" name="asterisk" size={10} color={COLORS.red} extraStyles={styles.requiredIcon} />
        </View>
    );
};

export default Required;
