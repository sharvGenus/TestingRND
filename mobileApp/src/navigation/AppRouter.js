import 'react-native-gesture-handler';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppStack from './AppStack';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './navigationHelper';

const Stack = createNativeStackNavigator();

const AppStackNavigation = () => {
    return <AppStack />;
};

const AppRouter = () => {
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator>
                <Stack.Screen name="AppStack" component={AppStackNavigation} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppRouter;
