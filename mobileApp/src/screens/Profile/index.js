import { SafeAreaView, Text, Image, View, TouchableOpacity, TextInput } from 'react-native';
import React from 'react';
import styles from './style';
import { useNavigation } from '@react-navigation/native';
import userLogo from '../../assets/images/user-solid.png';
import COLORS from '../../constants/color';
import Icon from '../../helpers/icon/icon';

const ProfileScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.imageContainer}>
                <Image source={userLogo} style={styles.userLogo} />
            </TouchableOpacity>
            <View style={styles.uploadIcon}>
                <Icon type="Ionicons" name="add-circle" size={35} color={COLORS.themeColor} />
            </View>
            <View>
                <Text style={styles.heading}>{'Your Name'}</Text>
                <TextInput style={styles.inputField} placeholder={'Enter Your Name'} />
            </View>
            <View>
                <Text style={styles.heading}>{'Your Email Address'}</Text>
                <TextInput style={styles.inputField} placeholder={'Enter Your Email Address'} />
            </View>
            <View>
                <Text style={styles.heading}>{'Your Phone Number'}</Text>
                <TextInput style={styles.inputField} placeholder={'Enter Your Phone Number'} keyboardType="number-pad" />
            </View>
        </SafeAreaView>
    );
};

export default ProfileScreen;
