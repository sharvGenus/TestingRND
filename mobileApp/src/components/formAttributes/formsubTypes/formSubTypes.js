import { Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import styles from './style';
import Icon from '../../../helpers/icon/icon';
import COLORS from '../../../constants/color';
import { Database } from '../../../helpers/database';
import { useSelector } from 'react-redux';

const FormSubTypesList = (props) => {
    const { data, navigation, isOffline, project, ticketId, categoryName, oAndMformId, oAndMresponseId } = props;
    const dbInstance = useSelector((state) => state.dbInstance?.db);

    const onNavigation = async (edit) => {
        try {
            const formType = ticketId ? 'O&M' : 'normal';
            if (data.id) {
                if (edit) {
                    navigation.navigate('FormTableView', {
                        data: data,
                        fromOfflineSection: isOffline
                    });
                } else {
                    const localDb = new Database(dbInstance);
                    const formDataInDraft = await localDb.getDraftData(data.id + ticketId || '', formType);
                    navigation.navigate('FormScreen', {
                        ticketId,
                        data: data,
                        fromOfflineSection: isOffline,
                        formDataInDraft: formDataInDraft?.form_responses,
                        searchedData: formDataInDraft?.searched_data,
                        searchedKey: formDataInDraft?.searched_key,
                        formType,
                        ...(data.id === oAndMformId && {
                            oAndMformId,
                            oAndMresponseId
                        })
                    });
                }
            }
        } catch (error) {
            console.log(`> [genus-wfm] | [${new Date().toLocaleString()}] | [formSubTypes.js] | [#19] | [error] | `, error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => onNavigation()} style={styles.subContainer}>
                <View style={styles.formNames}>
                    <View
                        onPress={() => onNavigation()}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start'
                        }}
                    >
                        <Text style={styles.topicContainer}>{data?.name}</Text>
                        <Text style={styles.projectContainer}>{data?.project?.code || project?.code || ''}</Text>
                    </View>
                </View>
                <View style={{ width: '100%', flexDirection: 'row', marginTop: 5, alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row' }}>
                        {!isOffline && (
                            <View style={styles.totalFormsCount}>
                                <Text style={styles.totalFormsCountText}>Online: </Text>
                                <Text style={[styles.totalFormsCountText, { color: COLORS.buttonColor }]}>
                                    {data.submissions?.online || 0}
                                </Text>
                            </View>
                        )}
                        <View style={styles.totalFormsCount}>
                            <Text style={styles.totalFormsCountText}>Offline: </Text>
                            <Text style={[styles.totalFormsCountText, { color: COLORS.buttonColor }]}>
                                {data.submissions?.offline || 0}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.totalFormsCount}
                            onPress={() =>
                                data.submissions?.resurvey > 0
                                    ? navigation.navigate('FormTableView', { data, formId: data.id, isResurvey: true })
                                    : true
                            }
                        >
                            <Text style={styles.totalFormsCountText}>
                                {data?.formTypeId === '080000d8-9337-4f5a-b60a-4b3ceb7cd6d5'
                                    ? 'Re-Training: '
                                    : categoryName === 'Survey' || categoryName === 'Resurvey'
                                    ? 'Resurvey:'
                                    : // : categoryName === 'Installation' || categoryName === 'Re-Visit'
                                      // ? 'Revisit:'
                                      null}
                            </Text>
                            <Text style={[styles.totalFormsCountText, { color: COLORS.buttonColor }]}>
                                {data?.formTypeId === '080000d8-9337-4f5a-b60a-4b3ceb7cd6d5' ||
                                categoryName === 'Survey' ||
                                categoryName === 'Resurvey'
                                    ? data.submissions?.resurvey || 0
                                    : null}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {isOffline && (
                        <TouchableOpacity onPress={() => onNavigation(true)}>
                            <Icon type="AntDesign" name="table" size={30} color={COLORS.buttonColor} extraStyles={styles.iconEditStyle} />
                        </TouchableOpacity>
                    )}
                </View>
                {/* <TouchableOpacity style={styles.resurveyView}>
                    <View style={styles.totalFormsCount}>
                        <Text style={styles.totalFormsCountText}>Resurvey</Text>
                        <Text style={[styles.totalCountsText, styles.resurveyColor]}>{5}</Text>
                    </View>
                    <TouchableOpacity style={styles.resurveyIconStyle}>
                        <Icon type="MaterialIcons" name="create" size={16} color={COLORS.black} />
                    </TouchableOpacity>
                </TouchableOpacity> */}
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default FormSubTypesList;
