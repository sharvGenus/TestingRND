import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import OtpScreen from '../screens/OtpScreen';
import CreatePin from '../screens/CreatePinScreen';
import UserLogin from '../screens/UserLoginScreen';
import DrawerStack from './Drawer';
import NotificationScreen from '../screens/Notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import MeterReadingScanner from '../components/formAttributes/ocr';
import FormScreen from '../screens/Form';

const Stack = createNativeStackNavigator();

const AppStack = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState(false);

    useEffect(() => {
        (async () => {
            const token = await AsyncStorage.getItem('token');
            setUserToken(token);
            setIsLoading(false);
        })();
    }, []);

    const appStackScreens = [
        {
            id: 1,
            name: 'Login',
            component: LoginScreen
        },
        {
            id: 2,
            name: 'Otp',
            component: OtpScreen
        },
        {
            id: 3,
            name: 'CreatePin',
            component: CreatePin
        },
        {
            id: 4,
            name: 'UserLogin',
            component: UserLogin
        },
        {
            id: 5,
            name: 'DrawerStack',
            component: DrawerStack
        },
        {
            id: 6,
            name: 'NotificationScreen',
            component: NotificationScreen
        },
        {
            id: 7,
            name: 'OcrReading',
            component: MeterReadingScanner
        },
        {
            id: 4,
            name: 'FormScreen',
            component: FormScreen
        }
    ];

    return (
        !isLoading && (
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={userToken ? 'DrawerStack' : 'Login'}>
                {appStackScreens.map((screen) => (
                    <Stack.Screen name={screen.name} component={screen.component} key={screen?.id} />
                ))}
            </Stack.Navigator>
        )
    );
};

export default AppStack;
