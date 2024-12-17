import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, TextInput, TouchableWithoutFeedback } from 'react-native';
import styles from './style';
import COLORS from '../../../constants/color';
import Icon from '../../../helpers/icon/icon';
import { Table, Row } from 'react-native-table-component';
import { fonts } from '../../../constants/themes';
import actionStatus from '../../../actions/actionStatus';

const SearchField = (props) => {
    const {
        searchValue,
        setSearchValue,
        setOnSearchValue,
        searchingMappingValue,
        formFieldsData,
        setInputs,
        onSearchValue,
        saveDraft,
        searchResultMessage,
        searchResultStatus,
        allDepenedentColumns,
        dynamicKeys,
        disableOnSearch,
        setEditable,
        editableOriginal,
        setSearchedData,
        isDisabledSearched
    } = props;
    const [showVisible, setShowVisible] = useState(false);

    const onChange = (event) => {
        setSearchValue(event);
    };

    useEffect(() => {
        if (searchingMappingValue?.data?.length === 1 && isDisabledSearched) {
            return onSearch(0);
        }
    }, [searchingMappingValue]);

    const onSearch = (index = 0) => {
        const item = searchingMappingValue?.data[index];
        const visibleItem = searchingMappingValue?.visibleData[index];
        const selectedValues = JSON.parse(JSON.stringify(item));
        setShowVisible(false);
        formFieldsData.forEach((x) => {
            if (x?.default_attribute?.inputType && ['dropdown', 'checkbox'].includes(x.default_attribute.inputType)) {
                if (
                    x.columnName &&
                    selectedValues[x.columnName] &&
                    Object.prototype.toString.call(selectedValues[x.columnName]) === '[object String]'
                ) {
                    selectedValues[x.columnName] = [selectedValues[x.columnName]];
                }
            } else if (
                x.default_attribute.inputType &&
                x.default_attribute.inputType === 'phone' &&
                selectedValues[x.columnName] &&
                typeof selectedValues[x.columnName] === 'string'
            ) {
                selectedValues[x.columnName] = selectedValues[x.columnName].replace('+91', '');
            } else if (x.default_attribute.inputType === 'text' && visibleItem[x.columnName]) {
                selectedValues[x.columnName] = visibleItem[x.columnName]
            }
        });
        const object = {};
        const dep = [];
        Object.entries(allDepenedentColumns).map(([key, value]) => {
            if (value && Object.hasOwn(allDepenedentColumns, value)) {
                if (dep.length === 0) return dep.push([value, key]);
                const index = dep.findIndex((arr) => arr.includes(value));
                if (index > -1) return dep[index].push(key);
                dep.push([value, key]);
            }
        });

        const rowKeys = Object.keys(selectedValues);
        Object.entries(dynamicKeys).forEach(([key]) => {
            if (dep.some((x) => x.includes(key) && x.some((y) => rowKeys.includes(y)))) {
                object[key] = [];
            }
        });
        const finalEntries = Object.entries(selectedValues);
        const clonedEdit = JSON.parse(JSON.stringify(editableOriginal));
        finalEntries.forEach(([key, value]) => {
            if (
                disableOnSearch.includes(key) &&
                clonedEdit.includes(key) &&
                ((Array.isArray(value) && value.length > 0) || (value && value !== ''))
            ) {
                const index = clonedEdit.indexOf(key);
                clonedEdit[index] = null;
            }
        });
        setEditable(clonedEdit);
        setSearchedData(JSON.stringify(selectedValues));
        setInputs((pre) => {
            // const updated = { ...pre, ...object, ...selectedValues };
            const updated = { ...pre, ...selectedValues };
            saveDraft(undefined, updated);
            return updated;
        });
    };
    const textStyle = {
        fontWeight: fonts.weight.semi,
        fontSize: fonts.size.font10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 'auto',
        width: 150,
        height: 50,
        borderWidth: 2,
        paddingLeft: 10,
        paddingTop: 10,
        borderColor: '#c8e1ff',
        minHeight: 'auto'
    };
    return (
        <View style={styles.field}>
            <View style={styles.searchView}>
                <TextInput
                    style={styles.inputField}
                    placeholder={'Search Here..'}
                    value={searchValue}
                    onChangeText={(event) => onChange(event)}
                    editable={!isDisabledSearched}
                />
                <Icon
                    type="Ionicons"
                    name="search"
                    size={25}
                    color={!searchValue ? COLORS.grey : COLORS.black}
                    extraStyles={styles.iconStyle}
                    onPress={() => {
                        setShowVisible(true);
                        setOnSearchValue(true);
                    }}
                    disabled={isDisabledSearched || !searchValue ? true : false}
                />
            </View>
            {onSearchValue === true && showVisible ? (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showVisible}
                    onRequestClose={() => {
                        setShowVisible(false);
                        setOnSearchValue(false);
                    }}
                >
                    <TouchableWithoutFeedback
                        onPress={() => {
                            setShowVisible(false);
                            setOnSearchValue(false);
                        }}
                    >
                        <View style={styles.modalContainer}>
                            <ScrollView
                                horizontal={true}
                                vertical={true}
                                showsVerticalScrollIndicator={true}
                                contentContainerStyle={
                                    !Array.isArray(searchingMappingValue?.visibleData) || searchingMappingValue?.visibleData?.length === 0
                                        ? styles.mainContainerNodata
                                        : styles.mainContainer
                                }
                            >
                                <View style={styles.centeredView}>
                                    <View style={[styles.closeSearchModel, { position: 'relative' }]}>
                                        <Icon
                                            type="MaterialIcons"
                                            name="close"
                                            size={25}
                                            color={COLORS.black}
                                            onPress={() => {
                                                setShowVisible(false);
                                                setOnSearchValue(false);
                                            }}
                                        />
                                    </View>
                                    {searchingMappingValue?.visibleData?.length > 0 ? (
                                        <>
                                            <Table borderStyle={styles.tableView}>
                                                {searchingMappingValue?.visibleData?.map((item, index) => (
                                                    <>
                                                        {index === 0 && (
                                                            <Row
                                                                data={Object.keys(searchingMappingValue?.visibleData?.[0]).map((value) => value)}
                                                                textStyle={textStyle}
                                                            />
                                                        )}
                                                        <TouchableOpacity key={index} onPress={() => onSearch(index)}>
                                                            <Row key={index} data={Object.values(item)} textStyle={textStyle} />
                                                        </TouchableOpacity>
                                                    </>
                                                ))}
                                            </Table>
                                        </>
                                    ) : (
                                        <View style={styles.tableHeader}>
                                            <TouchableOpacity key={'index'} onPress={() => true} style={styles.tableRow}>
                                                {searchResultStatus === actionStatus.PENDING ? (
                                                    <Text style={styles.text}>Loading ... </Text>
                                                ) : (
                                                    <Text style={styles.text}>{searchResultMessage || 'No Data!'}</Text>
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            </ScrollView>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            ) : (
                <></>
            )}
        </View>
    );
};

export default SearchField;
