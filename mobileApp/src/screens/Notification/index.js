import React, { useEffect, useState } from 'react';
import { ScrollView, SafeAreaView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import NotificationCard from '../../components/notificationCard';
import styles from './style';
import Header from '../../helpers/header/header';
import { useDispatch, useSelector } from 'react-redux';
import { UserTicketUpdateList, UserUpdateNotificationList } from '../../helpers/apiIntegration/userService';
import { getNotificationsList } from '../../actions/action';
import { useNavigation } from '@react-navigation/native';
import Toast from '../../components/Toast';
import COLORS from '../../constants/color';

const NotificationScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const dbInstance = useSelector((state) => state.dbInstance?.db);
    const isOffline = useSelector((state) => !!state.offlineEnabled?.enabled);
    const [activeTab, setActiveTab] = useState('Resurveys');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!dbInstance) return false;
            try {
                setLoading(true);
                await UserUpdateNotificationList(dbInstance, isOffline);
                dispatch(getNotificationsList(dbInstance, isOffline));
                setLoading(false);
            } catch (error) {
                setLoading(false);
                Toast(`${error.message}`, 0);
            }
        };

        navigation.addListener('focus', fetchData);
        navigation.addListener('blur', fetchData);

        // fetchData();

        return () => {
            navigation.removeListener('focus', fetchData);
            navigation.removeListener('blur', fetchData);
        };
    }, [navigation, dispatch, isOffline, dbInstance]);

    const updatedTicketStatus = async (...payload) => {
        try {
            await UserTicketUpdateList(dbInstance, isOffline, ...payload);
            dispatch(getNotificationsList(dbInstance, isOffline));
            return true;
        } catch (error) {
            Toast(`${error.message}`, 0);
            return false;
        }
    };

    const notifications = useSelector((state) => state.userNotificationList.notificationLists);
    const formTypes = useSelector((state) => state.useFormTypes?.formsTypesList);

    const categoryName = (value) => {
        let message = '';
        if (!formTypes) return { message, resurvey };

        if (value?.category === 'resurvey' && value?.form?.formTypeId === '080000d8-9337-4f5a-b60a-4b3ceb7cd6d5') {
            message = 'New Re-Training Assigned';
        } else {
            const matchingFormType = formTypes?.find((item) => item.id === value?.form?.formTypeId);
            if (value?.category === 'resurvey' && matchingFormType) {
                message = 'New Resurvey Assigned';
            } else if (!matchingFormType) {
                message = 'New Revisit Assigned';
            }
        }

        return { message, resurvey: value?.category === 'resurvey' };
    };
    const filteredNotifications = notifications?.notificationList?.rows?.filter((item) => {
        switch (activeTab) {
            case 'Tickets':
                return item.category === 'handt' && item?.form?.formTypeId !== '080000d8-9337-4f5a-b60a-4b3ceb7cd6d5';
            case 'Resurveys':
                return item.category === 'resurvey' && item?.form?.formTypeId !== '080000d8-9337-4f5a-b60a-4b3ceb7cd6d5';
            case 'Re-Training':
                return item?.form?.formTypeId === '080000d8-9337-4f5a-b60a-4b3ceb7cd6d5';
            default:
                return false;
        }
    });

    return (
        <SafeAreaView style={styles.container}>
            <Header screenName={'Notifications'} />
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Resurveys' && styles.activeTab]}
                    onPress={() => setActiveTab('Resurveys')}
                >
                    <Text style={styles.tabText}>Re-Survey</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Re-Training' && styles.activeTab]}
                    onPress={() => setActiveTab('Re-Training')}
                >
                    <Text style={styles.tabText}>Re-Training</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tab, activeTab === 'Tickets' && styles.activeTab]} onPress={() => setActiveTab('Tickets')}>
                    <Text style={styles.tabText}>O&M</Text>
                </TouchableOpacity>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color={COLORS.buttonColor} />
            ) : (
                <ScrollView style={styles.container}>
                    {filteredNotifications?.length > 0 ? (
                        filteredNotifications.map((item) => {
                            const { message } = categoryName(item);

                            return (
                                <NotificationCard
                                    readed={item.isRead}
                                    title={item?.category === 'resurvey' ? message : 'New Ticket Assigned'}
                                    timeline={
                                        item?.category === 'resurvey'
                                            ? item?.form?.name
                                            : `Ticket No: #${item?.ticket?.project_wise_ticket_mapping?.prefix}${item?.ticket?.ticketNumber}`
                                    }
                                    key={item.id}
                                    ticketId={item?.ticket?.id}
                                    formTypeId={item?.form?.formTypeId}
                                    notificationCategory={item?.category}
                                    formId={item?.ticket?.formId}
                                    ticketPrefix={item?.ticket?.project_wise_ticket_mapping?.prefix}
                                    ticketNumber={item?.ticket?.ticketNumber}
                                    status={item?.ticket?.ticketStatus}
                                    forms={item?.ticket?.project_wise_ticket_mapping?.forms}
                                    mobileFields={item?.ticket?.form_wise_ticket_mapping?.mobileFields}
                                    geoLocationField={item?.ticket?.form_wise_ticket_mapping?.geoLocationField}
                                    responseId={item?.ticket?.responseId}
                                    categoryName={message}
                                    updatedStatus={updatedTicketStatus.bind(null, item?.ticket?.id)}
                                />
                            );
                        })
                    ) : (
                        <View>
                            <Text style={styles.text}>No Notifications Found!</Text>
                        </View>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default NotificationScreen;
