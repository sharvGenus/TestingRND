import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomNavigation from '../components/bottomNavigation';
import DrawerNavigation from '../components/drawerNavigation';
import COLORS from '../constants/color';
import ProfileScreen from '../screens/Profile';
import SupportScreen from '../screens/Support';
import SettingsScreen from '../screens/Settings';
import OfflineScreen from '../screens/Offline';
import DashboardScreen from '../screens/Dashboard';
import ApproverDashboardScreen from '../screens/Approver Dashboard';
import SupervisorTicketsScreen from '../screens/Supervisor Tickets';

const Drawer = createDrawerNavigator();

const DrawerStack = () => {
    const options = {
        headerShown: false
    };

    const drawerStackScreens = [
        {
            id: 1,
            key: 'BottomNavigation',
            name: 'BottomNavigation',
            component: BottomNavigation
        },
        {
            id: 2,
            key: 'Profile',
            name: 'Profile',
            component: ProfileScreen
        },
        {
            id: 3,
            key: 'Support',
            name: 'Support',
            component: SupportScreen
        },
        {
            id: 4,
            key: 'Settings',
            name: 'Settings',
            component: SettingsScreen
        },
        {
            id: 5,
            key: 'Offline',
            name: 'Offline',
            component: OfflineScreen
        },
        {
            id: 6,
            key: 'Dashboard',
            name: 'Dashboard',
            component: DashboardScreen
        },
        {
            id: 7,
            key: 'Approver Dashboard',
            name: 'Approver Dashboard',
            component: ApproverDashboardScreen
        },
        {
            id: 8,
            key: 'Supervisor Tickets',
            name: 'Supervisor Tickets',
            component: SupervisorTicketsScreen
        }
    ];

    return (
        <Drawer.Navigator
            screenOptions={{
                drawerStyle: {
                    width: '65%',
                    backgroundColor: COLORS.themeColor
                },
                unmountOnBlur: false
            }}
            initialRouteName="BottomNavigation"
            drawerContent={({ navigation }) => {
                return <DrawerNavigation navigation={navigation} />;
            }}
        >
            {drawerStackScreens.map((screens) => (
                <Drawer.Screen name={screens?.name} component={screens?.component} key={screens?.key} options={options} />
            ))}
        </Drawer.Navigator>
    );
};

export default DrawerStack;
