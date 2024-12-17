import { Modal, Text, TouchableOpacity, View, FlatList } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './style';
import Icon from '../../helpers/icon/icon';
import COLORS from '../../constants/color';
import { useNavigation } from '@react-navigation/native';
import { Database } from '../database';
import { useDispatch, useSelector } from 'react-redux';
import { UserTicketUpdateList, UserformSubmit } from '../apiIntegration/userService';
import Toast from '../../components/Toast';
import apiMethod from '../apiIntegration/apiMethod';
import { setLoader } from '../../actions/action';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Header = (route) => {
    const navigation = useNavigation();
    const apiCalled = useRef({});
    const [formCategoryCountsArray, setFormcategoryCountsArray] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [host, setHost] = useState(null);
    const [isOffline, setIsOffline] = useState(null);
    const [hasTicketSynced, setTicketSynced] = useState(false);

    const dispatch = useDispatch();
    function setIsLoading(value) {
        dispatch(setLoader({ enabled: value }));
    }
    function setState(value) {
        dispatch(setLoader(value));
    }

    useEffect(() => {
        (async () => {
            const host = await AsyncStorage.getItem('HOST');
            setHost(host);
            const offlineEnabled = await AsyncStorage.getItem('offlineModeEnabled');
            setIsOffline(offlineEnabled?.toLowerCase());
        })();
    }, []);

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
                    Toast(
                        `Can not download new data as you have (${count}) form${
                            count > 1 ? 's' : ''
                        } in local database, please do sync them first!`,
                        0
                    );
                    return false;
                }
            }
            await Promise.allSettled(tables.map((x) => localDb.executeQuery(`DROP TABLE IF EXISTS ${x.name}`, [])));
        }
        await localDb.createDraftFormTable();
        return true;
    };

    /**
     * Selector to access db instance starts here
     * Get db instance from store
     */
    const dbInstance = useSelector((state) => state.dbInstance?.db);

    const createdTablesAndInsertData = useCallback(() => {
        if (apiCalled.current.createdTablesAndInsertData) return false;
        apiCalled.current.createdTablesAndInsertData = true;
        setIsLoading(true);
        let packetReceived = 0;
        let packetCount = 0;
        const localDb = new Database(dbInstance);
        (async () => {
            if (dbInstance) {
                // Create a WebSocket instance
                const wssId = Date.now();
                const socket = new WebSocket(`${host}/${wssId}`);

                // Event handler for when the connection is established
                socket.addEventListener('open', (event) => {
                    console.log(
                        '> [genus-wfm] | [' + new Date().toLocaleString() + '] | [header.js] | [#53] | [WebSocket connection opened] | ',
                        event
                    );
                });

                // Event handler for receiving messages
                socket.addEventListener('message', async (event) => {
                    let { data } = event;
                    try {
                        data = JSON.parse(data);
                        if (data && Array.isArray(data)) {
                            packetReceived += 1;
                            const [{ querytoexecute, valuestoinsert }] = data;
                            try {
                                if (querytoexecute) {
                                    await localDb.executeQuery(`${querytoexecute} ${valuestoinsert}`, []);
                                }
                            } catch (error) {
                                console.log(
                                    `> [genus-wfm] | [${new Date().toLocaleString()}] | [header.js] | [#102] | [querytoexecute, valuestoinsert] | `,
                                    querytoexecute,
                                    valuestoinsert
                                );
                                console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [header.js] | [#150] | [error] | `, error);
                            } finally {
                                setState({
                                    enabled: true,
                                    message: 'Downloading',
                                    percentage: packetCount > 0 ? ((packetReceived / packetCount) * 100).toFixed() : 0
                                });
                            }
                        } else if (
                            data &&
                            Object.prototype.toString.call(data) === '[object Object]' &&
                            Object.prototype.hasOwnProperty.call(data, 'packetCount')
                        ) {
                            console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [header.js] | [#109] | [data] | `, data);
                            packetCount = data.packetCount;
                        }
                        // close socket connections once all packet got received by client
                        if (packetReceived === packetCount) {
                            setState({ enabled: false });
                            socket.close();
                        }
                    } catch (error) {
                        apiCalled.current.createdTablesAndInsertData = false;
                        console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [header.js] | [#118] | [error] | `, error);
                    }
                });

                // Event handler for errors
                socket.addEventListener('error', (error) => {
                    apiCalled.current.createdTablesAndInsertData = false;
                    console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [header.js] | [#124] | [error] | `, error);
                    socket.close();
                });

                // Event handler for when the connection is closed
                socket.addEventListener('close', (event) => {
                    apiCalled.current.createdTablesAndInsertData = false;
                    if (apiCalled.current.deleteData) {
                        Toast('Form Data Saved Successsfully!', 1);
                    }
                    setIsLoading(false);
                });
                try {
                    const deleteData = await eraseAllDataFromDB();
                    apiCalled.current.deleteData = deleteData;
                    if (deleteData) {
                        const [{ data }] = await apiMethod.get('/form/get-table-data');
                        let i = 0;
                        while (i < data.length) {
                            const rows = data[i];
                            await localDb.executeQuery(rows, []);
                            i += 1;
                        }

                        await apiMethod.get(`/form/offline-data?id=${wssId}`);
                    } else {
                        apiCalled.current.createdTablesAndInsertData = false;
                        socket.close();
                        Toast('You have some forms which were not synced, please sync previously submitted forms first!', 0);
                        setIsLoading(false);
                    }
                } catch (error) {
                    socket.close();
                    setIsLoading(false);
                    apiCalled.current.createdTablesAndInsertData = false;
                    Toast(error.message || 'Something Went wrong!', 0);
                    console.error('> genus-wfm | [index.js] | #80 | error : ', error);
                }
            } else {
                apiCalled.current.createdTablesAndInsertData = false;
                // Toast('You have already saved this form data!', 0);
                setIsLoading(false);
            }
        })();
    }, [dbInstance]);
    /**
     * code for db instance selector ends here
     */

    const uploadFormdsData = async () => {
        if (apiCalled.current.uploadFormdsData) return false;
        apiCalled.current.uploadFormdsData = true;
        setIsLoading(true);

        const localDb = new Database(dbInstance);
        const isExistTable = await localDb.checkIfExists('local_form_submissions');

        if (!isExistTable) {
            setIsLoading(false);
            apiCalled.current.uploadFormdsData = false;
            return Toast('No Data Available to Sync', 0);
        }

        const [allForms, formList, formCategoriesTypes, tickets] = await Promise.all([
            localDb.getAllFormsToSync(),
            localDb.getFormList(),
            localDb.getFormSubtypes(),
            localDb.getAllTicketsToSync()
        ]);

        if ((!allForms || allForms.length === 0) && !tickets?.length) {
            setIsLoading(false);
            apiCalled.current.uploadFormdsData = false;
            return Toast('No Data Available to Sync', 0);
        }

        const response = await Promise.allSettled(
            allForms.map(async (item) => {
                const formData = new FormData();
                if (item.form_responses) {
                    const response = JSON.parse(item.form_responses);
                    response.forEach(([key, value]) => {
                        formData.append(key, value);
                    });
                }
                let data;
                try {
                    data = await UserformSubmit(formData, item.form_id, item.resurvey_id);
                    if (data?.[1] && [200, 409].includes(data[1])) {
                        await localDb.deleteSubmittedForm(['id', item.id]);
                    }
                    return Promise.resolve({ data, form_id: item?.form_id, resurvey_id: item?.resurvey_id });
                } catch (error) {
                    return Promise.reject({ form_id: item?.form_id, resurvey_id: item?.resurvey_id, error });
                }
            })
        );

        const ticketsResp = tickets?.rows
            ? await Promise.allSettled(
                  tickets?.rows?.map(async (item) => {
                      await UserTicketUpdateList(undefined, undefined, item.ticketId, item.payload);
                      await localDb.deleteTicketData(item.ticketId, item.created_at);
                  })
              )
            : [];
        if (ticketsResp.some((x) => x.status === 'fulfilled')) {
            setTicketSynced(true);
        } else {
            setTicketSynced(false);
        }

        const formIdCounts = response.reduce((counts, result) => {
            if (result.status === 'fulfilled') {
                const formId = result.value.form_id;
                if (result.value.data[1] === 200) {
                    // Successful uploads
                    if (counts[formId] === undefined) {
                        counts[formId] = { success: 1, failed: 0, duplicate: 0 };
                    } else {
                        counts[formId].success++;
                    }
                } else if (result.value.data[1] === 409) {
                    // Duplicate uploads
                    if (counts[formId] === undefined) {
                        counts[formId] = { success: 0, failed: 0, duplicate: 1 };
                    } else {
                        counts[formId].duplicate++;
                    }
                }
            } else {
                // When the result is rejected (failed), increment the failed count
                const formId = result?.reason?.form_id;
                if (counts[formId] === undefined) {
                    counts[formId] = { success: 0, failed: 1, duplicate: 0 };
                } else {
                    counts[formId].failed++;
                }
            }
            return counts;
        }, {});

        setIsLoading(false);

        const formFilledArray = allForms
            ?.map((x) => {
                const matchingForm = formList?.rows?.find((y) => x?.form_id === y?.id);
                if (matchingForm) {
                    return {
                        form_id: x.form_id,
                        formTypeId: matchingForm.formTypeId,
                        formName: matchingForm.name
                    };
                }
                return null;
            })
            .filter((x) => x !== null);

        const groupedForms = {};

        formFilledArray.forEach((x) => {
            const matchingCategory = formCategoriesTypes.find((category) => category.id === x.formTypeId);

            if (matchingCategory) {
                const uniqueKey = `${matchingCategory.name}-${x.formName}-${x.form_id}`;

                if (!groupedForms[uniqueKey]) {
                    groupedForms[uniqueKey] = {
                        formcategory: matchingCategory.name,
                        formName: x.formName,
                        form_id: x.form_id,
                        formFillLength: 0,
                        successfullyUploaded: 0,
                        duplicateUploaded: 0,
                        failedCount: 0
                    };
                }

                groupedForms[uniqueKey].formFillLength += 1;

                if (JSON.stringify(formIdCounts[x.form_id]) !== undefined) {
                    groupedForms[uniqueKey].successfullyUploaded = JSON.stringify(formIdCounts[x.form_id].success);
                    groupedForms[uniqueKey].duplicateUploaded = JSON.stringify(formIdCounts[x.form_id].duplicate);
                    groupedForms[uniqueKey].failedCount = JSON.stringify(formIdCounts[x.form_id].failed);
                }
            }
        });

        const formCategoryCountsArray = Object.values(groupedForms).map((group) => {
            return {
                formcategory: group.formcategory,
                formName: group.formName,
                form_id: group.form_id,
                formFillLength: group.formFillLength,
                successfullyUploaded: group.successfullyUploaded,
                duplicateUploaded: group.duplicateUploaded,
                failedCount: group.failedCount
            };
        });

        setFormcategoryCountsArray(formCategoryCountsArray);
        if (ticketsResp?.length || response?.length) {
            setIsModalVisible(true);
        }
        apiCalled.current.uploadFormdsData = false;
        return;
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.header}>
                <View
                    style={[
                        styles.lefttCorner,
                        {
                            ...(route?.screenName != 'Home' &&
                                route?.screenName != 'Offline Mode' && {
                                    width: route?.screenName === 'Home' && route?.enabled === false ? '20%' : '10%'
                                })
                        }
                    ]}
                >
                    {route?.screenName != 'Home' &&
                    route?.screenName != 'Offline Mode' &&
                    route?.screenName != 'Notifications' &&
                    route?.screenName != 'Tickets' ? (
                        <View style={[styles.backIcon, { marginLeft: 10 }]}>
                            <Icon type="Ionicons" name="arrow-back" size={30} color={COLORS.white} onPress={() => navigation.goBack()} />
                        </View>
                    ) : (
                        <></>
                    )}
                    {(isOffline === 'true' || !isOffline) && route?.screenName === 'Home' && route?.enabled === false ? (
                        <>
                            <TouchableOpacity style={styles.offlienDownloadButton} onPress={createdTablesAndInsertData}>
                                <Icon type="Ionicons" name="download-outline" size={30} color={COLORS.white} />
                            </TouchableOpacity>
                        </>
                    ) : (
                        <></>
                    )}
                </View>
                <View style={[styles.heading, { width: '80%' }]}>
                    {route?.screenName?.length >= 22 ? (
                        <Text ellipsizeMode="tail" numberOfLines={1} style={[styles.headingText, { width: '100%' }]}>
                            {route?.screenName === 'Home' ? 'WFM' : route?.screenName}
                        </Text>
                    ) : (
                        <Text style={styles.headingText}>{route?.screenName === 'Home' ? 'WFM' : route?.screenName}</Text>
                    )}
                </View>
                <View style={[styles.rightCorner, { width: '10%' }]}>
                    {(isOffline === 'true' || !isOffline) && route?.screenName === 'Home' && route?.enabled === false ? (
                        <>
                            <TouchableOpacity style={styles.offlienUploadButton} onPress={() => uploadFormdsData()}>
                                <Icon type="Ionicons" name="sync" size={30} color={COLORS.white} />
                            </TouchableOpacity>
                        </>
                    ) : (
                        <></>
                    )}
                    {route?.screenName !== 'FormTableView' && route?.drawerView !== false ? (
                        <TouchableOpacity style={styles.hambergerMenu}>
                            <Icon type="Entypo" name="menu" size={30} color={COLORS.white} onPress={() => navigation.openDrawer()} />
                        </TouchableOpacity>
                    ) : (
                        <></>
                    )}
                </View>
            </View>
            {isModalVisible === true ? (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={() => {
                        setIsModalVisible(false);
                        setTicketSynced(false);
                    }}
                >
                    <View style={styles.modalContainer}>
                        <View style={[styles.closeSearchModel]}>
                            <Icon
                                type="MaterialIcons"
                                name="close"
                                size={25}
                                color={COLORS.black}
                                onPress={() => {
                                    setIsModalVisible(false);
                                    setTicketSynced(false);
                                }}
                            />
                        </View>
                        {hasTicketSynced && (
                            <View style={styles.subContainer}>
                                <View style={styles.formNames}>
                                    <View style={styles.cardNameView}>
                                        <Text style={styles.topicContainer}>Tickets Have Been Synced Successsfully</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                        <FlatList
                            data={formCategoryCountsArray}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <View style={styles.subContainer} key={index}>
                                    <View style={styles.formNames}>
                                        <View style={styles.cardNameView}>
                                            <Text style={styles.topicContainer}>{item?.formName}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.cardCountsView}>
                                        <View style={styles.cardCountStyleView}>
                                            <View style={styles.totalFormsCount}>
                                                <Text style={styles.totalFormsCountText}>Total: </Text>
                                                <Text style={[styles.totalFormsCountText, { color: COLORS.buttonColor }]}>
                                                    {item?.formFillLength}
                                                </Text>
                                            </View>
                                            <View style={styles.totalFormsCount}>
                                                <Text style={styles.totalFormsCountSuccessText}>Success: </Text>
                                                <Text style={[styles.totalFormsCountText, { color: COLORS.buttonColor }]}>
                                                    {item?.successfullyUploaded}
                                                </Text>
                                            </View>
                                            <View style={styles.totalFormsCount}>
                                                <Text style={styles.totalFormsCountFailedText}>Failed: </Text>
                                                <Text style={[styles.totalFormsCountText, { color: COLORS.buttonColor }]}>
                                                    {item?.failedCount}
                                                </Text>
                                            </View>
                                            <View style={styles.totalFormsCount}>
                                                <Text style={styles.totalFormsCountDuplicateText}>Duplicate: </Text>
                                                <Text style={[styles.totalFormsCountText, { color: COLORS.buttonColor }]}>
                                                    {item?.duplicateUploaded}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}
                        />
                    </View>
                </Modal>
            ) : (
                <View>
                    <Text style={styles.text}>No Data Found!</Text>
                </View>
            )}
        </View>
    );
};

export default Header;
