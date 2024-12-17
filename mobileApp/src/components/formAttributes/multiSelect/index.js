import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import Icon from '../../../helpers/icon/icon';
import styles from './style';
import COLORS from '../../../constants/color';
import Required from '../required';
import { Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomSelectPicker = (props) => {
    const {
        name,
        error,
        value,
        setValue,
        itemsList,
        selectType,
        description,
        required,
        isLoading,
        isRequired,
        disabled,
        firstRender,
        discarded,
        customKeyName,
        contractor,
        supervisor,
        dropDownApiData
    } = props;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [filteredItemsList, setfilteredItemsList] = useState(itemsList);

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const isRendered = useRef(true);

    useEffect(() => {
        (async () => {
            const userData = await AsyncStorage.getItem('userData');
            const formattedData = JSON.parse(userData);
            if (formattedData) {
                if (formattedData?.user?.organization && itemsList && contractor) {
                    setfilteredItemsList([formattedData?.user?.organization]);
                } else if (formattedData?.user?.supervisor && itemsList && supervisor) {
                    setfilteredItemsList([formattedData?.user?.supervisor]);
                } else {
                    setfilteredItemsList(itemsList);
                }
            }
        })();
    }, [itemsList]);

    useEffect(() => {
        isRendered.current = true;
    }, [firstRender]);

    React.useEffect(() => {
        if (isRendered.current && filteredItemsList?.length === 1 && filteredItemsList?.[0]?.id && required) {
            setValue([filteredItemsList[0].id]);
            isRendered.current = false;
        }
    }, [filteredItemsList, discarded, value]);

    const handleItemSelected = (item) => {
        if (selectType === 'single') {
            setValue([item]);
            setIsModalVisible(false);
        } else {
            if (value?.includes(item)) {
                setValue(value.filter((i) => i !== item));
            } else {
                setValue([...value, item]);
            }
        }
    };

    const renderModalContent = () => {
        return (
            <View style={styles.modalContainer}>
                <TextInput style={styles.searchInput} placeholder="Search Items..." value={searchText} onChangeText={setSearchText} />
                <ScrollView contentContainerStyle={styles.dropdownContainer} showsVerticalScrollIndicator={false}>
                    {filteredItemsList &&
                        filteredItemsList?.map((item) => {
                            if (searchText && !item[customKeyName || 'name'].toLowerCase()?.includes(searchText.toLowerCase())) {
                                return null;
                            }
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[styles.dropdownItem, value?.includes(item.id) && styles.selectedDropdownItem]}
                                    onPress={() => handleItemSelected(item.id)}
                                >
                                    <Text style={[styles.dropdownItemText, value?.includes(item.id) && styles.selectedDropdownItemText]}>
                                        {item[customKeyName || 'name']}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                </ScrollView>
                {selectType === 'multi' && (
                    <View>
                        <Button
                            title="Confirm"
                            onPress={() => {
                                setIsModalVisible(false);
                                setSearchText('');
                            }}
                            disabled={disabled}
                            color={COLORS.buttonColor}
                        />
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.field}>
            <View style={styles.subContainer}>
                <Text style={styles.heading}>{name}</Text>
                {isRequired ? <Required /> : null}
                {/* <TouchableOpacity onPress={() => setShowModal(!showModal)}>
                    <Icon type="MaterialIcons" name="info-outline" size={15} color={COLORS.black} extraStyles={styles.infoIcon} />
                </TouchableOpacity> */}
                {showModal && description && (
                    <View style={styles.descriptionView}>
                        <TouchableOpacity style={styles.centeredDescriptionView} onPressOut={() => setShowModal(false)}>
                            <View style={styles.modalDescriptionView}>
                                <Text style={styles.descriptionText}>{description}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            {isLoading ? (
                <ActivityIndicator size="small" color={COLORS.themeColor} />
            ) : (
                <View style={disabled === true ? styles.disabledInputField : styles.inputField}>
                    {value.length === 0 ? (
                        <Text style={disabled === true ? styles.disabledDropdownText : styles.dropdownText}>
                            {description ? description : 'Pick Items'}
                        </Text>
                    ) : (
                        <View style={{ flexDirection: 'row', paddingHorizontal: 5, paddingTop: 10, flexWrap: 'wrap' }}>
                            {value?.length > 0 &&
                                value?.map((item, index) =>
                                    filteredItemsList?.find((x) => x.id === item)?.[customKeyName || 'name'] ? (
                                        <View
                                            key={filteredItemsList.find((x) => x.id === item)?.[customKeyName || 'name']}
                                            style={styles.selectedItemContainer}
                                        >
                                            <Text style={styles.selectedItemText}>
                                                {filteredItemsList.find((x) => x.id === item)?.[customKeyName || 'name']}
                                            </Text>
                                            <Icon
                                                type="AntDesign"
                                                name="closecircle"
                                                color={COLORS.grey}
                                                size={18}
                                                extraStyles={styles.minusIcon}
                                                onPress={() => {
                                                    const prev = JSON.parse(JSON.stringify(value));
                                                    required === true && filteredItemsList?.length > 1 && !disabled
                                                        ? setValue(prev.filter((x) => x !== item))
                                                        : required === false && filteredItemsList?.length >= 1 && !disabled
                                                        ? setValue(prev.filter((x) => x !== item))
                                                        : null;
                                                }}
                                            />
                                        </View>
                                    ) : (
                                        <View key={`RANDOM_KEY_${name}`} style={styles.selectedItemContainer}>
                                            <Text style={styles.selectedItemText}></Text>
                                            <Icon
                                                type="AntDesign"
                                                name="closecircle"
                                                color={COLORS.grey}
                                                size={18}
                                                extraStyles={styles.minusIcon}
                                                onPress={() => {
                                                    const prev = JSON.parse(JSON.stringify(value));
                                                    required === true && filteredItemsList?.length > 1 && !disabled
                                                        ? setValue(prev.filter((x) => x !== item))
                                                        : required === false && filteredItemsList?.length >= 1 && !disabled
                                                        ? setValue(prev.filter((x) => x !== item))
                                                        : null;
                                                }}
                                            />
                                        </View>
                                    )
                                )}
                        </View>
                    )}

                    <TouchableOpacity
                        onPress={() => (disabled === true ? setIsModalVisible(false) : setIsModalVisible(true))}
                        style={styles.iconTouchable}
                    >
                        <Icon
                            type="MaterialCommunityIcons"
                            name="form-dropdown"
                            size={25}
                            color={disabled === true ? COLORS.grey : COLORS.black}
                            extraStyles={value.length === 0 ? styles.iconStyle : styles.iconStyle2}
                        />
                    </TouchableOpacity>
                </View>
            )}
            <View>
                <Modal animationType="slide" transparent={false} visible={isModalVisible} onRequestClose={toggleModal}>
                    <View style={styles.closeIcon}>
                        <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                            <Icon
                                type="MaterialIcons"
                                name="close"
                                size={25}
                                color={COLORS.black}
                                style={styles.closeIcon}
                                onPress={() => {
                                    setIsModalVisible(false);
                                    setSearchText('');
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                    {renderModalContent()}
                </Modal>
                {error && <Text style={styles.error}>{error}</Text>}
            </View>
        </View>
    );
};

export default CustomSelectPicker;
