import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Switch, Image, NativeModules, TouchableOpacity, Modal } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import styles from './style';
import COLORS from '../../constants/color';
import Icon from '../../helpers/icon/icon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { offlineModeEnabled } from '../../actions/action';
import { Database } from '../../helpers/database';
import Toast from '../Toast';
import apiMethod from '../../helpers/apiIntegration/apiMethod';
import userLogo from '../../assets/images/user-solid.png';

const VersionNameModule = NativeModules.VersionNameModule;

const DrawerNavigation = ({ navigation }) => {
    const [id, setId] = useState();
    const dispatch = useDispatch();
    const isEnabled = useSelector((state) => !!state.offlineEnabled?.enabled);
    const dbInstance = useSelector((state) => state.dbInstance?.db);
    const [isSupervisor, setIsSupervisor] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [isOffline, setIsOffline] = useState(null);
    const [version, setVersion] = useState(null);

    useEffect(() => {
        VersionNameModule.getVersionName()
            .then((versionName) => setVersion(versionName))
            .catch((error) => console.error('Error getting versionName:', error));
    }, []);

    const [areaAllocatedValues, setAreaAllocatedValues] = useState(null);
    const [showAreaAllocatedModal, setShowAreaAllocatedModal] = useState(false);

    const items = [
        // {
        //     id: 1,
        //     name: 'Profile',
        //     iconType: 'FontAwesome5',
        //     iconName: 'user-tie',
        //     route: 'Profile'
        // },
        {
            id: 3,
            name: 'Area Allocated',
            iconType: 'MaterialCommunityIcons',
            iconName: 'transmission-tower',
            route: 'Area Allocated'
        },
        {
            id: 4,
            name: 'Approver Dashboard',
            iconType: 'MaterialCommunityIcons',
            iconName: 'view-dashboard',
            route: 'Approver Dashboard'
        },
        isSupervisor
            ? {
                  id: 5,
                  name: 'My-Tickets',
                  iconType: 'Entypo',
                  iconName: 'ticket',
                  route: 'Supervisor Tickets'
              }
            : null,
        {
            id: 6,
            name: 'Logout',
            iconType: 'FontAwesome5',
            iconName: 'power-off',
            route: 'Logout'
        }
    ].filter((item) => item !== null);

    useEffect(() => {
        (async () => {
            navigation.navigate('Home', {
                screen: 'HomeScreen'
            });
            if (isEnabled === true) {
                let formID = await AsyncStorage.getItem('formID');
                AsyncStorage.setItem('isEnabled', JSON.stringify(isEnabled));
                setId(formID);
                // navigation.navigate('FormSubTypes', { data: formID, dataName: 'Offline Mode' });
                navigation.closeDrawer();
            } else {
                AsyncStorage.removeItem('isEnabled');
            }
        })();
    }, [isEnabled]);

    useEffect(() => {
        (async () => {
            const userData = await AsyncStorage.getItem('userData');
            const offlineEnabled = await AsyncStorage.getItem('offlineModeEnabled');
            const areaAllocated = await AsyncStorage.getItem('areaAllocated');
            setAreaAllocatedValues(JSON.parse(areaAllocated));
            const userDataFormatted = JSON.parse(userData);
            if (userDataFormatted) setUserDetails(userDataFormatted?.user);
            if (userDataFormatted?.user?.supervisor_assignments?.length > 0) setIsSupervisor(true);
            if (offlineEnabled) setIsOffline(offlineEnabled);
        })();
    }, []);

    const doLogout = () =>
        Promise.all([
            AsyncStorage.getItem('formID'),
            AsyncStorage.getItem('headerValues'),
            AsyncStorage.removeItem('isEnabled'),
            AsyncStorage.removeItem('token'),
            AsyncStorage.removeItem('offlineModeEnabled'),
            AsyncStorage.removeItem('areaAllocated'),
            navigation.replace('Login'),
            dispatch(offlineModeEnabled(false))
        ]);

    const onLogOut = async () => {
        Alert.alert('', 'Do you want to Logout?', [
            { text: 'Cancel' },
            {
                text: 'Yes',
                onPress: () => {
                    apiMethod.post('/auth/logout').then(doLogout).catch(doLogout);
                }
            }
        ]);
    };

    const eraseAllDataFromDB = async () => {
        // commented wipe data functionality
        const localDb = new Database(dbInstance);
        const {
            rows: { raw, length }
        } = await localDb.executeQuery(
            `SELECT name FROM sqlite_master WHERE type='table' AND name <> 'android_metadata' AND name <> 'sqlite_sequence';`,
            []
        );
        if (length > 0) {
            const tables = raw();
            if (tables.some((x) => x.name === 'local_form_submissions')) {
                const {
                    rows: { raw: responseRaw }
                } = await localDb.executeQuery('SELECT count(*) as count from local_form_submissions', []);
                const [{ count }] = responseRaw();
                if (count > 0) {
                    return Toast(
                        `Can not delete data as you have (${count}) form${
                            count > 1 ? 's' : ''
                        } in local database, please do sync them first!`,
                        0
                    );
                }
            }
            await Promise.allSettled(tables.map((x) => localDb.executeQuery(`DROP TABLE ${x.name}`, [])));
        }
        await localDb.createDraftFormTable();
        Toast('Data deleted successfully', 1);
    };
    const onNavigate = (route, data) => {
        if (route === 'Area Allocated') {
            if (Object.keys(areaAllocatedValues || {})?.length > 0) {
                setShowAreaAllocatedModal(true);
            } else {
                Toast('No Area Allocated to this User.', 0);
            }
        } else if (route === 'Logout') {
            onLogOut();
        } else {
            navigation.navigate(`${route}`, data);
        }
    };

    const toggleSwitch = async (isOffline) => {
        const localDb = new Database(dbInstance);
        if (isOffline) {
            const [isResponseTableExists, isFormsTables] = await Promise.all([
                localDb.checkIfExists('local_form_submissions'),
                localDb.checkIfExists('forms')
            ]);
            if (!isResponseTableExists || !isFormsTables) {
                return Toast('Please Download any form before switch into offline mode', 0);
            }
            const {
                rows: { raw: responseRaw }
            } = await localDb.executeQuery('SELECT count(*) as count from forms', []);
            const [{ count }] = responseRaw();
            if (!count) {
                return Toast('Please Download any form before switch into offline mode', 0);
            }
        }
        dispatch(offlineModeEnabled(!isEnabled));
    };

    const closeAreaAllocatedModal = () => {
        setShowAreaAllocatedModal(false);
    };

    useEffect(() => {
        (async () => {
            const userData = await AsyncStorage.getItem('userData');
            const offlineEnabled = await AsyncStorage.getItem('offlineModeEnabled');
            const userDataFormatted = JSON.parse(userData);
            if (userDataFormatted) setUserDetails(userDataFormatted?.user);
            if (userDataFormatted?.user?.supervisor_assignments?.length > 0) setIsSupervisor(true);
            if (offlineEnabled) setIsOffline(offlineEnabled?.toLowerCase());
        })();
    }, []);

    const AreaAllocatedModal = () => {
        return (
            areaAllocatedValues && (
                <Modal animationType="slide" transparent={true} visible={showAreaAllocatedModal} onRequestClose={closeAreaAllocatedModal}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View>
                                <Text style={styles.modalHeadingText}>
                                    Area Level: <Text style={styles.modalText}>{areaAllocatedValues?.level?.toUpperCase()}</Text>
                                </Text>
                                <Text style={styles.modalHeadingText}>
                                    Area Assigned:
                                    {areaAllocatedValues?.entry?.map((item, index) => (
                                        <React.Fragment key={index}>
                                            {index > 0 && ', '} {index === 0 && ''}
                                            <Text style={styles.modalText}>{item?.toUpperCase()}</Text>
                                        </React.Fragment>
                                    ))}
                                </Text>
                            </View>
                            <TouchableOpacity style={styles.closeButton} onPress={closeAreaAllocatedModal}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )
        );
    };

    return (
        <View style={styles.container}>
            <DrawerContentScrollView contentContainerStyle={styles.drawerContainer}>
                <View style={styles.avatarContainer}>
                    <Image source={userLogo} style={styles.avatar} />
                    <Text style={styles.userName}>{userDetails?.name}</Text>
                    <Text style={styles.mobileNumber}>{userDetails?.mobileNumber}</Text>
                </View>
                <View style={styles.subContainer}>
                    {items.map((drawer) => (
                        <DrawerItem
                            key={drawer.id}
                            icon={() => <Icon type={drawer.iconType} name={drawer.iconName} size={22} color={COLORS.offWhite} />}
                            label={() => <Text style={styles.drawerLabel}>{drawer.name}</Text>}
                            onPress={() => onNavigate(drawer.route, drawer.data)}
                        />
                    ))}
                </View>
                {isOffline === 'true' || !isOffline ? (
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            flexDirection: 'row',
                            padding: 16,
                            paddingLeft: 8
                        }}
                    >
                        <Switch
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                            thumbColor={isEnabled ? COLORS.blue : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch.bind(this, !isEnabled)}
                            value={isEnabled}
                        />
                        <Text style={styles.offlineText}>{isEnabled ? 'Disable' : 'Enable'} Offline Mode</Text>
                    </View>
                ) : (
                    <></>
                )}
                {/* <View style={styles.wipeData}>
                    <Button style={styles.appVersionTitle} title="Wipe Data" onPress={eraseAllDataFromDB} disabled={isEnabled} />
                </View> */}

                <View style={styles.appVersionOuter}>
                    <Text style={styles.appVersionTitle}>Version: </Text>
                    <Text style={styles.appVersionLabel}>{version}</Text>
                </View>
                <AreaAllocatedModal />
            </DrawerContentScrollView>
        </View>
    );
};

export default DrawerNavigation;
