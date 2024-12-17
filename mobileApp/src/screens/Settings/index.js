import { BackHandler, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import styles from './style';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
    const navigation = useNavigation();
    return (
        <View>
            <Text>Settings Screen</Text>
        </View>
    );
};

export default SettingsScreen;
