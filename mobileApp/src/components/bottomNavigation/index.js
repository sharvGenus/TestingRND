import React, { useEffect } from 'react';
import { View, Text, ToastAndroid, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from '../../helpers/icon/icon';
import COLORS from '../../constants/color';
import HomeTab from '../../navigation/homeTab';
import NotificationScreen from '../../screens/Notification';
import { getNotificationsList } from '../../actions/action';
import { useDispatch, useSelector } from 'react-redux';

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
    const dbInstance = useSelector((state) => state.dbInstance?.db);
    const isOffline = useSelector((state) => !!state.offlineEnabled?.enabled);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!dbInstance) return () => false;
        dispatch(getNotificationsList(dbInstance, isOffline));
    }, [dispatch, dbInstance, isOffline]);

    const notifications = useSelector((state) => state.userNotificationList.notificationLists);

    const handleNotificationsPress = (e, navigate) => {
        // if (isOffline) {
        //     e.preventDefault();
        //     ToastAndroid.show('You are in offline mode', ToastAndroid.SHORT);
        // } else {
        // }
        navigate();
    };

    const items = [
        {
            id: 1,
            name: 'Home',
            label: 'Home',
            iconType: 'Feather',
            iconName: 'home'
        },
        {
            id: 2,
            name: 'Notifications',
            label: 'Notifications',
            iconType: 'Ionicons',
            iconName: 'notifications'
        }
    ];

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarHideOnKeyboard: true
            }}
        >
            {items.map((tabs) => (
                <Tab.Screen
                    key={tabs.id}
                    name={tabs.name}
                    component={tabs.name === 'Home' ? HomeTab : NotificationScreen}
                    options={{
                        tabBarLabel: ({ focused }) => (
                            <Text
                                style={{
                                    color: focused ? COLORS.themeColor : COLORS.light
                                }}
                            >
                                {tabs.label}
                            </Text>
                        ),
                        tabBarIcon: ({ focused }) => (
                            <View>
                                {/* {tabs.name === 'Notifications' && isOffline ? (
                                    <Icon
                                        type="Ionicons"
                                        name="notifications-off"
                                        size={24}
                                        color={focused ? COLORS.black : COLORS.light}
                                    />
                                ) : ( */}
                                <Icon type={tabs.iconType} name={tabs.iconName} size={24} color={focused ? COLORS.black : COLORS.light} />
                                {/* )} */}
                            </View>
                        ),
                        unmountOnBlur: false,
                        tabBarBadge:
                            tabs.name === 'Notifications' && notifications?.notificationList?.unreadCount > 0
                                ? notifications?.notificationList?.unreadCount
                                : null,
                        tabBarButton: (props) => (
                            <TouchableOpacity
                                {...props}
                                onPress={(e) => {
                                    if (tabs.name === 'Notifications') {
                                        handleNotificationsPress(e, props.onPress);
                                    } else {
                                        props.onPress(e);
                                    }
                                }}
                            />
                        )
                    }}
                />
            ))}
        </Tab.Navigator>
    );
};

export default BottomNavigation;
