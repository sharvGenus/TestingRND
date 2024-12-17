import { Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import styles from './style';
import { useNavigation } from '@react-navigation/native';
import surveyIcon from '../../../assets/images/surveyor.png';
import installationIcon from '../../../assets/images/meter.png';
import databaseIcon from '../../../assets/images/database.png';
import operationalIcon from '../../../assets/images/o&m.png';
import defaultIcon from '../../../assets/images/defaultIcon.png';

const FormTypes = (props) => {
    const { data } = props;
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            {
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => navigation.navigate('FormSubTypes', { data: data?.id, dataName: data?.name })}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <View style={styles.iconView}>
                            <Image
                                source={
                                    data?.name === 'Survey'
                                        ? surveyIcon
                                        : data?.name === 'Operations' || data?.name === 'O&M'
                                        ? operationalIcon
                                        : data?.name === 'Masters'
                                        ? databaseIcon
                                        : data?.name === 'Installation'
                                        ? installationIcon
                                        : defaultIcon
                                }
                                style={
                                    data?.name === 'Masters'
                                        ? styles.masterCategoryWiseIcon
                                        : data?.name === 'Survey'
                                        ? styles.surveyCategoryWiseIcon
                                        : styles.categoryWiseIcon
                                }
                            />
                        </View>
                        <View style={{ width: '70%' }}>
                            <Text style={styles.title}>{data?.name}</Text>
                        </View>
                        {data?.count > 0 && (
                            <View style={styles.numberOfFormsContainer}>
                                <Text style={styles.numberOfForms}>{data?.count}</Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            }
        </SafeAreaView>
    );
};

export default FormTypes;
