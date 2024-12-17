import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { Row } from 'react-native-table-component';
import Header from '../../helpers/header/header';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getFormsForEdit, getResurveyForms, setLoader } from '../../actions/action';
import Toast from '../../components/Toast';
import COLORS from '../../constants/color';
import styles from './style';

const ITEMS_PER_PAGE = 10;

const FormTableView = ({ route }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [tableData, setTableData] = useState({ head: [], rows: [] });
    const [page, setPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);
    const [isEndReached, setIsEndReached] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [hasMoreData, setHasMoreData] = useState(true);

    const dbInstance = useSelector((state) => state.dbInstance?.db);
    const editableData = useSelector((state) => state?.editableForms?.editableForms);
    const isOffline = useSelector((state) => !!state.offlineEnabled?.enabled);
    const { data, isResurvey, formId: resurveyFormId } = route.params || {};

    const statesRef = useRef({ page });

    useEffect(() => {
        if (!dbInstance) return;
        statesRef.current = { formId: data?.id, dbInstance, isOffline, isResurvey };
        dispatch(getFormsForEdit(statesRef.current, setLoaderState));
    }, [dbInstance, data, isOffline]);

    useEffect(() => {
        if (!dbInstance) return;
        const focusListener = navigation.addListener('focus', () => {
            setTotalCount(0);
            setTableData({ head: [], rows: [] });
            setPage(1);
            setIsEndReached(false);
            setIsLoadingMore(false);
            setIsLoadingInitial(true);
            setHasMoreData(true);
            if (isResurvey) {
                fetchTableData(0, ITEMS_PER_PAGE);
            } else {
                setTimeout(() => {
                    dispatch(getFormsForEdit(statesRef.current, setLoaderState));
                }, 100);
            }

            if (isOffline && tableData?.rows?.length === 0) {
                setIsLoadingInitial(false);
            }
        });
        const blurListener = navigation.addListener('blur', () => {
            setTotalCount(0);
            setTableData({ head: [], rows: [] });
            setPage(1);
            setIsEndReached(false);
            setIsLoadingMore(false);
            setIsLoadingInitial(false);
        });
        return () => {
            navigation.removeListener('blur', blurListener);
            navigation.removeListener('focus', focusListener);
        };
    }, [navigation, dbInstance]);

    useEffect(() => {
        if (!isResurvey && !editableData?.length) return;
        if (page === 1) {
            fetchTableData(0, ITEMS_PER_PAGE);
        } else {
            fetchTableData((page - 1) * ITEMS_PER_PAGE, ITEMS_PER_PAGE);
        }
    }, [editableData, isResurvey, resurveyFormId, page]);

    const setLoaderState = (value) => {
        dispatch(setLoader({ enabled: value }));
    };

    const fetchTableData = async (offset, limit) => {
        try {
            if (isLoadingMore || !hasMoreData) return;

            setIsLoadingMore(true);

            const attributes = data?.form_attributes || [];
            const columns = attributes
                .filter((attr) => !['blob', 'file', 'image'].includes(attr.default_attribute?.inputType))
                // .sort((a, b) => a.rank - b.rank)
                .map((attr) => attr.name);
            const keys = attributes
                .filter((attr) => !['blob', 'file', 'image'].includes(attr.default_attribute?.inputType))
                // .sort((a, b) => a.rank - b.rank)
                .map((attr) => attr.columnName);
            const types = attributes.reduce((acc, cur) => ({ ...acc, [cur.columnName]: cur.default_attribute.inputType }), {});
            let valuesToMap = JSON.parse(JSON.stringify(editableData));
            if (isResurvey && resurveyFormId) {
                try {
                    const resurvey = await getResurveyForms(dbInstance, false, resurveyFormId, setLoaderState, Toast, offset, limit);
                    const count = Number(resurvey?.count || 0);
                    if (!isNaN(count)) {
                        setTotalCount(count);
                    } else {
                        console.error('Total count is not a valid number:', resurvey.count);
                        setTotalCount(0);
                    }

                    valuesToMap = JSON.parse(JSON.stringify(resurvey.data));
                } catch (error) {
                    setIsLoadingMore(false);
                    return;
                }
            }

            if (valuesToMap && valuesToMap.length > 0) {
                const tableData = valuesToMap.map((item, index) => {
                    const values = Object.fromEntries(
                        Object.entries(item.data).map(([key, value]) => [
                            key,
                            ['dropdown', 'checkbox', 'image', 'file'].includes(types[key]) && !value ? [] : value
                        ])
                    );
                    const row = keys.map((key) => item.data[key] || '-');
                    return { id: item.id, sn: offset + index + 1, row, values, resurveyId: item.data.id };
                });

                setTableData((prev) => ({
                    head: prev.head.length ? prev.head : columns,
                    rows: page === 1 ? tableData : [...prev.rows, ...tableData]
                }));

                if (totalCount > 0 && (tableData.length < limit || offset + tableData.length >= totalCount)) {
                    setHasMoreData(false);
                }
            } else {
                setHasMoreData(false);
            }

            setIsLoadingMore(false);
            setIsLoadingInitial(false);
        } catch (error) {
            console.log({ error });
        }
    };

    const handleLoadMore = () => {
        if (!isEndReached && !isLoadingMore && isResurvey) {
            setPage((prev) => prev + 1);
        }
    };

    const renderFooter = () =>
        isLoadingMore && (
            <View style={styles.footer}>
                <ActivityIndicator size="large" color={COLORS.themeColor} />
                <Text style={styles.footerText}>Loading...</Text>
            </View>
        );

    const renderItem = ({ item }) => (
        <TouchableOpacity
            key={item.resurveyId}
            onPress={() =>
                navigation.navigate('FormScreen', {
                    data,
                    editValues: item.values,
                    editableId: item.id,
                    formType: 'resurvey',
                    responseId: item.resurveyId
                })
            }
        >
            <Row data={item.row} textStyle={styles.headTextStyle} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Header screenName={data?.name} enabled={route?.params?.fromOfflineSection} />
            <View style={styles.subContainer}>
                <Text style={styles.dateHeader}>
                    {'Date: '} {moment().format('DD MMM yyyy')}
                </Text>
                <View style={styles.modalContainer}>
                    {isLoadingInitial ? (
                        <ActivityIndicator size="large" color={COLORS.themeColor} />
                    ) : tableData?.rows?.length > 0 ? (
                        <ScrollView>
                            <ScrollView horizontal showsVerticalScrollIndicator contentContainerStyle={{ height: 'auto' }}>
                                <FlatList
                                    data={tableData.rows}
                                    keyExtractor={(item, index) => `${item.resurveyId}-${index}`}
                                    ListHeaderComponent={() => <Row data={tableData.head} textStyle={styles.headTextStyle} />}
                                    renderItem={renderItem}
                                    onEndReached={handleLoadMore}
                                    onEndReachedThreshold={0.5}
                                    contentContainerStyle={{ flexGrow: 1 }}
                                />
                            </ScrollView>
                        </ScrollView>
                    ) : (
                        <View>
                            <Text style={styles.text}>No Data Found!</Text>
                        </View>
                    )}
                    {!isLoadingInitial && renderFooter()}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default FormTableView;
