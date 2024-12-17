import { FlatList, SafeAreaView, View, Text } from 'react-native';
import React, { useEffect, useMemo, useRef } from 'react';
import styles from './style';
import FormSubTypesList from '../../components/formAttributes/formsubTypes/formSubTypes';
import Header from '../../helpers/header/header';
import { useNavigation } from '@react-navigation/native';
import { getUserFormSubTypesList, setLoader } from '../../actions/action';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FormSubTypes = ({ route }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const dbInstance = useSelector((state) => state.dbInstance?.db);
    const isOffline = useSelector((state) => !!state.offlineEnabled?.enabled);
    const ticketId = route?.params?.ticketId;
    const formId = route?.params?.data;
    const source = route?.params?.source;
    const project = route?.params?.project;
    const formSubTypesSelector = useSelector((state) => state?.userFormSubTypes?.formsSubTypesList);
    const formList = route?.params?.formList;
    const formSubTypes = useMemo(() => {
        if (!formSubTypesSelector) return { rows: [] };
        if (source === 'o&m' && formSubTypesSelector.rows) {
            if (formList?.length < 1) {
                return { rows: [] };
            }
            const formIds = formList.map((x) => x.id);
            const clone = {};
            clone.rows = formSubTypesSelector.rows.filter((x) => {
                return formIds.includes(x.id);
            });
            clone.count = clone.rows.length;
            return clone;
        } else if (formSubTypesSelector?.rows) {
            const rows = formSubTypesSelector?.rows?.filter((item) => item?.formTypeId === formId);
            return { rows, count: rows.length };
        }
        return { rows: [] };
    }, [formSubTypesSelector]);

    function setIsLoading(enabled) {
        dispatch(setLoader({ enabled }));
    }

    const statesRef = useRef({});

    useEffect(() => {
        if (!dbInstance) return;
        statesRef.current = { source, isOffline, dbInstance };
        dispatch(
            getUserFormSubTypesList(
                statesRef.current.dbInstance,
                statesRef.current.isOffline,
                setIsLoading,
                statesRef.current.source === 'o&m'
            )
        );
        storageValues();
    }, [dbInstance, source, isOffline, source]);

    useEffect(() => {
        navigation.addListener('focus', () => {
            setIsLoading(true);
            dispatch(
                getUserFormSubTypesList(
                    statesRef.current.dbInstance,
                    statesRef.current.isOffline,
                    setIsLoading,
                    statesRef.current.source === 'o&m'
                )
            );
        });
        return () => navigation.removeListener('focus', () => {});
    }, [navigation]);

    // useEffect(() => {
    //     setIsLoading(true);
    //     dispatch(getUserFormSubTypesList(dbInstance, isOffline, setIsLoading, source === 'o&m'));
    // }, [isOffline, source]);

    const storageValues = async () => {
        if (formId) await AsyncStorage.setItem('formID', formId);
        if (route?.params?.dataName) await AsyncStorage.setItem('headerValues', route?.params?.dataName);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header screenName={route?.params?.dataName} enabled={isOffline} />
            {formSubTypes?.rows?.length > 0 ? (
                <FlatList
                    data={formSubTypes?.rows}
                    renderItem={({ item }) => (
                        <FormSubTypesList
                            data={item}
                            navigation={navigation}
                            isOffline={isOffline}
                            project={project}
                            ticketId={ticketId}
                            categoryName={route?.params?.dataName}
                            oAndMformId={route?.params?.formId}
                            oAndMresponseId={route?.params?.responseId}
                        />
                    )}
                    keyExtractor={(item) => item?.id}
                />
            ) : (
                <View>
                    <Text style={styles.text}>No Data Found!</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

export default FormSubTypes;
