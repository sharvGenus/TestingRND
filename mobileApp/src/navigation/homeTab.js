import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home';
import FormSubTypes from '../screens/FormSubTypes';
import FormTableView from '../screens/FormTableView';

const Stack = createNativeStackNavigator();

const HomeTab = () => {
    const homeStack = [
        {
            id: 1,
            name: 'HomeScreen',
            component: HomeScreen
        },
        {
            id: 2,
            name: 'FormSubTypes',
            component: FormSubTypes
        },
        {
            id: 3,
            name: 'FormTableView',
            component: FormTableView
        }
    ];

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                tabBarHideOnKeyboard: true
            }}
            initialRouteName="HomeScreen"
        >
            {homeStack.map((screen) => (
                <Stack.Screen key={screen.id} name={screen.name} component={screen.component} options={{ headerShown: false }} />
            ))}
        </Stack.Navigator>
    );
};

export default HomeTab;
