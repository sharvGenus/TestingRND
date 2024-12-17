import { BackHandler, Text, View } from 'react-native';
import React from 'react';
import styles from './style';
import { useNavigation } from '@react-navigation/native';

const SupportScreen = () => {
    const navigation = useNavigation();
    return (
        <View>
            <Text>Support Screen</Text>
        </View>
    );
};

export default SupportScreen;
