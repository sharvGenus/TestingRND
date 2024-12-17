import { BackHandler, FlatList, SafeAreaView, View, Text, Alert } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import styles from './style';
import Header from '../../helpers/header/header';
import FormTypes from '../../components/formAttributes/formTypes/formTypes';
import { useDispatch, useSelector } from 'react-redux';
import { SQLiteDatabaseInstance, getUserFormTypes, offlineModeEnabled, setLoader } from '../../actions/action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from '../../helpers/database';

const HomeScreen = ({ navigation }) => {
    const enabled = useSelector((state) => !!state.offlineEnabled?.enabled);

    const dispatch = useDispatch();
    const isApiCalled = useRef(false);
    const dbInstance = useSelector((state) => state.dbInstance?.db);
    const isOffline = useSelector((state) => !!state.offlineEnabled?.enabled);
    function setIsLoading(enabled) {
        dispatch(setLoader({ enabled }));
    }

    useEffect(() => {
        const backAction = () => {
            if (navigation.isFocused()) {
                // If you're on the HomeScreen
                Alert.alert(
                    '',
                    'Are you sure you want to exit app?',
                    [
                        {
                            text: 'No',
                            onPress: () => null,
                            style: 'cancel'
                        },
                        {
                            text: 'YES',
                            onPress: () => BackHandler.exitApp(),
                            style: 'destructive'
                        }
                    ],
                    { cancelable: false }
                );
                return true;
            } else {
                // If you're on other screens
                navigation.goBack();
                return true;
            }
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove();
    }, [navigation]);

    // const isOfflineChanged = useRef(false);
    // const isOfflineRef = useRef(isOffline);
    // useEffect(() => {
    //     isOfflineRef.current = isOffline;
    //     if (isOfflineChanged.current) {
    //         dispatch(getUserFormTypes(dbInstance, isOfflineRef.current, setIsLoading));
    //     }
    // }, [isOffline]);

    const statesRef = useRef({});

    useEffect(() => {
        if (!dbInstance) return;
        statesRef.current = { dbInstance, isOffline };
        dispatch(getUserFormTypes(statesRef.current.dbInstance, statesRef.current.isOffline, setIsLoading, isApiCalled));
    }, [navigation, dbInstance, isOffline]);

    useEffect(() => {
        navigation.addListener('focus', () => {
            dispatch(getUserFormTypes(statesRef.current.dbInstance, statesRef.current.isOffline, setIsLoading, isApiCalled));
        });
        return () => navigation.removeListener('focus', () => {});
    }, [navigation]);

    const formTypes = useSelector((state) => state.useFormTypes?.formsTypesList);

    useEffect(() => {
        (async () => {
            const isOffline = await AsyncStorage.getItem('isEnabled');
            dispatch(offlineModeEnabled(isOffline));
        })();
    }, []);

    const hasSqliteConnected = useRef({});
    const [isRefresh, setRefresh] = useState(false);

    useEffect(() => {
        if (hasSqliteConnected.status && hasSqliteConnected.dbInstance) {
            return dispatch(SQLiteDatabaseInstance(hasSqliteConnected.dbInstance));
        }
        dispatch(SQLiteDatabaseInstance(undefined));
        (async () => {
            try {
                const db = new Database();
                await db.connectDatabse();
                await db.createDraftFormTable();
                hasSqliteConnected.status = true;
                hasSqliteConnected.dbInstance = db.dbInstance;
                dispatch(SQLiteDatabaseInstance(db.dbInstance));
            } catch (error) {
                console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [index.js] | [#92] | [error] | `, error);
            }
        })();
        const timeout = setTimeout(() => {
            setRefresh((pre) => !pre);
        }, 2000);
        return () => timeout && clearTimeout(timeout);
    }, [isRefresh]);

    return (
        <SafeAreaView style={styles.container}>
            <Header screenName={'Home'} enabled={enabled} />
            <>
                {formTypes?.length > 0 ? (
                    <FlatList data={formTypes} renderItem={({ item }) => <FormTypes data={item} />} keyExtractor={(item) => item?.id} />
                ) : (
                    <View>
                        <Text style={styles.text}>No Data Found!</Text>
                    </View>
                )}
            </>
        </SafeAreaView>
    );
};

export default HomeScreen;
