import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Linking,
    Modal,
    Image,
    TextInput,
    ScrollView,
    Alert,
    Button,
    SafeAreaView,
    KeyboardAvoidingView
} from 'react-native';
import styles from './style';
import { Icon } from '@rneui/themed';
import COLORS from '../../constants/color';
import { useNavigation } from '@react-navigation/native';
import resurveyIcon from '../../assets/images/surveyor.png';
import operationalIcon from '../../assets/images/o&m.png';
import { useDispatch, useSelector } from 'react-redux';
import { getTicketInfoList } from '../../actions/action';
import Toast from '../Toast';

const NotificationCard = (props) => {
    const {
        title,
        readed,
        status,
        ticketId,
        timeline,
        formTypeId,
        ticketNumber,
        ticketPrefix,
        updatedStatus,
        notificationCategory,
        categoryName,
        ...payload
    } = props;

    const { formId, responseId } = payload;
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [value, setValue] = useState('');
    const [autoHeight, setAutoHeight] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const ticketInfo = useSelector((state) => state?.userTicketInfoList?.ticketInfoList);
    const dbInstance = useSelector((state) => state.dbInstance?.db);
    const isOffline = useSelector((state) => !!state.offlineEnabled?.enabled);

    useEffect(() => {
        if (showModal) {
            dispatch(getTicketInfoList(payload, dbInstance, isOffline, setShowModal, Toast));
        }
    }, [showModal, dbInstance, isOffline]);

    useEffect(() => {
        if (value) {
            setErrorMessage('');
        }
    }, [value]);

    const { formList, geoLocationKey, responseData, project } = useMemo(() => ticketInfo || {}, [ticketInfo]);

    const onNavigation = async (action) => {
        if (['on-hold', 'resolved', 'rejected'].includes(action) && !value) {
            setErrorMessage('Please fill the remark');
            return;
        }

        setErrorMessage('');
        if (notificationCategory === 'resurvey') {
            navigation.navigate('FormSubTypes', {
                data: formTypeId,
                dataName:
                    formTypeId === '080000d8-9337-4f5a-b60a-4b3ceb7cd6d5'
                        ? 'Re-Training'
                        : categoryName === 'New Resurvey Assigned'
                        ? 'Resurvey'
                        : null
            });
        } else {
            const updatePayload =
                action === 'rejected' || action === 'resolved'
                    ? {
                          ticketStatus: action,
                          assigneeRemarks: value,
                          assigneeId: null
                      }
                    : {
                          ticketStatus: action,
                          assigneeRemarks: value
                      };
            setShowModal(false);
            const response = await updatedStatus(updatePayload);
            if (action === 'in-progress' && response) {
                navigation.navigate('FormSubTypes', {
                    source: 'o&m',
                    formList: formList,
                    project: project,
                    ticketId,
                    dataName: 'O&M',
                    formId,
                    responseId
                });
            }
        }
    };

    const isLocation = useMemo(() => {
        if (responseData?.[geoLocationKey]) {
            const [latitude, longitude] = responseData[geoLocationKey]?.split(',') || [];
            if (latitude && longitude) {
                return { latitude, longitude };
            }
        }
        return false;
    }, [geoLocationKey]);

    const onVisitLocation = useCallback(() => {
        if (isLocation) {
            const { latitude, longitude } = isLocation;
            Linking.openURL(`https://maps.google.com?q=${latitude},${longitude}`);
        } else {
            Alert.alert('', 'Location Not Available!');
        }
    }, [geoLocationKey]);

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={[styles.scrollContent, { backgroundColor: readed > 0 ? COLORS.offWhite : COLORS.light_grey }]}>
                <TouchableOpacity
                    style={styles.container}
                    onPress={() => (notificationCategory === 'resurvey' ? onNavigation() : setShowModal(true))}
                >
                    <View style={styles.aptitudeSection}>
                        <View style={styles.iconView}>
                            <Image
                                source={notificationCategory === 'resurvey' ? resurveyIcon : operationalIcon}
                                style={styles.categoryWiseIcon}
                            />
                        </View>
                        <View>
                            <Text style={styles.title}>{title}</Text>
                            <Text ellipsizeMode="tail" style={styles.timeline}>
                                {timeline}
                            </Text>
                            {notificationCategory === 'handt' && (
                                <Text ellipsizeMode="tail" style={styles.timeline}>
                                    {status === 'on-hold'
                                        ? 'Status: On-Hold'
                                        : status === 'in-progress'
                                        ? 'Status: Work-In-Progress'
                                        : null}
                                </Text>
                            )}
                            <Modal animationType="slide" transparent={true} visible={showModal} onRequestClose={() => setShowModal(false)}>
                                {ticketInfo ? (
                                    <KeyboardAvoidingView
                                        style={styles.keyBoardAvoidingView}
                                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                        keyboardVerticalOffset={100}
                                    >
                                        <View style={styles.modalView}>
                                            <ScrollView contentContainerStyle={styles.subModalView} showsVerticalScrollIndicator={false}>
                                                <View style={styles.insideModalView}>
                                                    <Text style={styles.ticketNoShow}>{`Ticket No: #${ticketPrefix}${ticketNumber}`}</Text>
                                                    <Icon
                                                        onPress={() => setShowModal(false)}
                                                        type="MaterialIcons"
                                                        name="close"
                                                        size={18}
                                                        color={COLORS.buttonColor}
                                                        extraStyles={styles.iconEditStyle}
                                                    />
                                                </View>

                                                {responseData &&
                                                    Object.entries(responseData)?.map(([key, value]) =>
                                                        key === geoLocationKey ? null : (
                                                            <View key={key} style={styles.detailsButtonView}>
                                                                <Text style={styles.detailsKey}>{`${key}:`}</Text>
                                                                <Text ellipsizeMode="tail" style={styles.detailsValue}>
                                                                    {value}
                                                                </Text>
                                                            </View>
                                                        )
                                                    )}
                                                <TextInput
                                                    style={[
                                                        styles.remarkField,
                                                        {
                                                            height: autoHeight ? Math.max(30, autoHeight) : 'auto'
                                                        }
                                                    ]}
                                                    placeholder="Remark"
                                                    value={value}
                                                    onChangeText={(event) => setValue(event)}
                                                    onContentSizeChange={(event) => setAutoHeight(event?.nativeEvent?.contentSize?.height)}
                                                    multiline
                                                />
                                                {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
                                                {status === 'in-progress' && (
                                                    <View style={{ marginTop: 10 }}>
                                                        <Button
                                                            title={'Start Again - Work In Progress'}
                                                            onPress={() => {
                                                                onNavigation('in-progress');
                                                            }}
                                                            color={COLORS.themeColor}
                                                        />
                                                    </View>
                                                )}
                                                <View style={styles.modalActionButtons}>
                                                    {isLocation && (
                                                        <TouchableOpacity style={styles.handtButton} onPress={() => onVisitLocation()}>
                                                            <Text style={styles.locationText}>{'Location'}</Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {(status === 'assigned' || status === 'in-progress' || status === 'on-hold') && (
                                                        <>
                                                            <TouchableOpacity
                                                                onPress={() =>
                                                                    onNavigation(
                                                                        status === 'assigned'
                                                                            ? 'in-progress'
                                                                            : status === 'in-progress'
                                                                            ? 'resolved'
                                                                            : 'assigned'
                                                                    )
                                                                }
                                                                style={styles.closeModal}
                                                            >
                                                                <Text
                                                                    style={
                                                                        status === 'assigned'
                                                                            ? styles.startModalText
                                                                            : styles.finishModalText
                                                                    }
                                                                >
                                                                    {status === 'assigned'
                                                                        ? 'START'
                                                                        : status === 'in-progress'
                                                                        ? 'FINISH'
                                                                        : 'RESUME'}
                                                                </Text>
                                                            </TouchableOpacity>

                                                            {status !== 'on-hold' && (
                                                                <TouchableOpacity
                                                                    onPress={() => onNavigation('on-hold')}
                                                                    style={styles.closeModal}
                                                                >
                                                                    <Text style={styles.holdModalText}>{'HOLD'}</Text>
                                                                </TouchableOpacity>
                                                            )}

                                                            <TouchableOpacity
                                                                onPress={() => onNavigation('rejected')}
                                                                style={styles.closeModal}
                                                            >
                                                                <Text style={styles.closeModalText}>{'REJECT'}</Text>
                                                            </TouchableOpacity>
                                                        </>
                                                    )}
                                                </View>
                                            </ScrollView>
                                        </View>
                                    </KeyboardAvoidingView>
                                ) : (
                                    <></>
                                )}
                            </Modal>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default NotificationCard;
