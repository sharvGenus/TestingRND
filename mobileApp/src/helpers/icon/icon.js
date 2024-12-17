import React from 'react';
import { View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import COLORS from '../../constants/color';
import styles from './style';

const Icon = (props) => {
    const { type, name, size, color, extraStyles, onPress, disabled } = props;
    return (
        <View style={[styles.iconStyle, extraStyles]}>
            {type === 'MaterialCommunityIcons' ? (
                <MaterialCommunityIcons
                    onPress={onPress}
                    name={name}
                    size={size}
                    color={color ? color : COLORS.white}
                    disabled={disabled}
                />
            ) : type === 'MaterialIcons' ? (
                <MaterialIcons name={name} onPress={onPress} size={size} color={color ? color : COLORS.white} disabled={disabled} />
            ) : type === 'Feather' ? (
                <Feather name={name} onPress={onPress} size={size} color={color ? color : COLORS.white} disabled={disabled} />
            ) : type === 'FontAwesome5' ? (
                <FontAwesome5 name={name} onPress={onPress} size={size} color={color ? color : COLORS.white} disabled={disabled} />
            ) : type === 'FontAwesome' ? (
                <FontAwesome name={name} onPress={onPress} size={size} color={color ? color : COLORS.white} />
            ) : type === 'Entypo' ? (
                <Entypo name={name} onPress={onPress} size={size} color={color ? color : COLORS.white} disabled={disabled} />
            ) : type === 'AntDesign' ? (
                <AntDesign name={name} onPress={onPress} size={size} color={color ? color : COLORS.white} disabled={disabled} />
            ) : type === 'Ionicons' ? (
                <Ionicons name={name} onPress={onPress} size={size} color={color ? color : COLORS.white} disabled={disabled} />
            ) : type === 'EvilIcons' ? (
                <EvilIcons name={name} onPress={onPress} size={size} color={color ? color : COLORS.white} disabled={disabled} />
            ) : type === 'Fontisto' ? (
                <Fontisto name={name} onPress={onPress} size={size} color={color ? color : COLORS.white} disabled={disabled} />
            ) : (
                <Octicons name={name} onPress={onPress} size={size} color={color ? color : COLORS.white} disabled={disabled} />
            )}
        </View>
    );
};

export default Icon;
