import React, { useEffect, useRef, useState, useCallback } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView, View, Text, Platform, TouchableOpacity, Modal } from 'react-native';
import styles from './style';
import Icon from '../../../helpers/icon/icon';
import COLORS from '../../../constants/color';
import moment from 'moment';
import Required from '../required';
import MonthPicker, { ACTION_DATE_SET, ACTION_DISMISSED, ACTION_NEUTRAL } from 'react-native-month-year-picker';

const DatePickerComponent = (props) => {
    const {
        name,
        captureCurrentDate,
        maxDate,
        minDate,
        editable,
        date,
        setDate,
        inputs,
        error,
        validationsChecked,
        pickerType,
        timeFormat,
        description,
        required,
        dateRefObject,
        columnName,
        searchedData,
        editValues
    } = props;
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [time, setTime] = useState('');
    const isRendered = useRef(false);
    const [showModal, setShowModal] = useState(false);
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [isDate, setIsDate] = useState(dateRefObject.current.isDateCurrent);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        if (validationsChecked) {
            validationsChecked(selectedDate);
        }
        let tempDate = new Date(currentDate);
        let fTime = tempDate.getHours() + ':' + tempDate.getMinutes();
        setShow(Platform.OS === 'ios');
        setTime(fTime);
    if(event?.type === 'set'){
        setDate(currentDate);
        setIsDate(true);
    }
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showPicker = useCallback((value) => setShowMonthPicker(value), []);

    useEffect(() => {
        if ((searchedData && searchedData.length > 0) || editValues) {
            try {
                const parseData = searchedData ? JSON.parse(searchedData) : null;
                const parseDataKeys = parseData ? Object.keys(parseData) : [];
                const editValuesKeys = editValues ? Object.keys(editValues) : [];
                if (parseDataKeys.includes(columnName) || editValuesKeys.includes(columnName)) {
                    dateRefObject.current.isNotCurrentDate = true;
                }
            } catch (error) {
                console.error('Error parsing searchedData:', error);
            }
        }
    }, [searchedData, editValues, columnName]);

    useEffect(() => {
        if (Object.keys(inputs).length === 0) {
            setIsDate(false);
            isRendered.current = false;
        }
        if (!isRendered.current && captureCurrentDate === true) {
            if (timeFormat === '24hour') {
                setTime(moment(date, ['HH:mm']).format('HH:mm A'));
            } else if (timeFormat === '24hour' && pickerType === 'monthYearBoth') {
                setDate(moment(new Date(date)).format('MMMM, YYYY'));
            } else if (timeFormat === '12hour' && pickerType === 'monthYearBoth') {
                setDate(moment(new Date(date)).format('MMMM, YYYY'));
            } else {
                setTime(moment(date, ['HH:mm']).format('h:mm A'));
            }
            setDate(new Date(date), true);
            isRendered.current = true;
        }
    }, [captureCurrentDate, date, inputs]);

    const onValueChange = (event, newDate) => {
        showPicker(false);
        switch (event) {
            case ACTION_DATE_SET:
                setDate(newDate);
                setIsDate(true);
                showPicker(false);
                break;
            case ACTION_NEUTRAL:
                showPicker(false);
                break;
            case ACTION_DISMISSED:
                showPicker(false);
                break;
            default:
                showPicker(false);
        }
    };
    const getFormattedDate = (dateString) => {
        if (!dateString) return null;
        const [year, month] = dateString.split('-');
        return { year, month: parseInt(month, 10) };
    };

    const minDateObj = minDate && getFormattedDate(minDate);
    const maxDateObj = maxDate && getFormattedDate(maxDate);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.field}>
                <View style={styles.subContainer}>
                    <Text style={styles.heading}>{name}</Text>
                    {required === true ? <Required /> : <></>}
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
                {pickerType === 'dateTimeBoth' ? (
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={editable === true ? styles.dateField : styles.nonEditableDateField}
                            onPress={() => (editable === true ? showMode('date') : '')}
                        >
                            <Text style={styles.text}>
                                {captureCurrentDate === true
                                    ? moment(date).format('DD/MM/YYYY')
                                    : isDate
                                    ? moment(date).format('DD/MM/YYYY')
                                    : dateRefObject.current.isNotCurrentDate === true
                                    ? moment(date).format('DD/MM/YYYY')
                                    : 'Select Date'}
                            </Text>
                            <View>
                                <Icon
                                    type="Ionicons"
                                    name="calendar-outline"
                                    size={25}
                                    color={COLORS.black}
                                    extraStyles={styles.iconStyle}
                                    onPress={() => (editable === true ? showMode('date') : '')}
                                />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={editable === true ? styles.timeField : styles.nonEditableTimeField}
                            onPress={() => (editable === true ? showMode('time') : '')}
                        >
                            <Text style={styles.text}>
                                {captureCurrentDate === true && timeFormat === '24hour'
                                    ? moment(new Date(date), ['HH:mm']).format('HH:mm A')
                                    : captureCurrentDate === true && timeFormat === '12hour'
                                    ? moment(new Date(date), ['HH:mm']).format('h:mm A')
                                    : isDate && timeFormat === '24hour'
                                    ? moment(new Date(date), ['HH:mm']).format('HH:mm A')
                                    : dateRefObject.current.isNotCurrentDate === true && timeFormat === '24hour'
                                    ? moment(new Date(date), ['HH:mm']).format('HH:mm A')
                                    : isDate && timeFormat === '12hour'
                                    ? moment(new Date(date), ['HH:mm']).format('h:mm A')
                                    : dateRefObject.current.isNotCurrentDate === true && timeFormat === '12hour'
                                    ? moment(new Date(date), ['HH:mm']).format('h:mm A')
                                    : 'Select Time'}
                            </Text>
                            <View>
                                <Icon
                                    type="AntDesign"
                                    name="clockcircleo"
                                    size={25}
                                    color={COLORS.black}
                                    extraStyles={styles.iconStyle}
                                    onPress={() => (editable === true ? showMode('time') : '')}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : pickerType === 'dateOnly' || !pickerType ? (
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={editable === true ? styles.dateField : styles.nonEditableDateField}
                            onPress={() => (editable === true ? showMode('date') : '')}
                        >
                            <Text style={styles.text}>
                                {captureCurrentDate === true
                                    ? moment(date).format('DD/MM/YYYY')
                                    : isDate
                                    ? moment(date).format('DD/MM/YYYY')
                                    : dateRefObject.current.isNotCurrentDate === true
                                    ? moment(date).format('DD/MM/YYYY')
                                    : 'Select Date'}
                            </Text>
                            <View>
                                <Icon
                                    type="Ionicons"
                                    name="calendar-outline"
                                    size={25}
                                    color={COLORS.black}
                                    extraStyles={styles.iconStyle}
                                    onPress={() => (editable === true ? showMode('date') : '')}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : pickerType === 'timeOnly' ? (
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={editable === true ? styles.timeField : styles.nonEditableTimeField}
                            onPress={() => (editable === true ? showMode('time') : '')}
                        >
                            <Text style={styles.text}>
                                {captureCurrentDate === true && timeFormat === '24hour'
                                    ? moment(new Date(date), ['HH:mm']).format('HH:mm A')
                                    : captureCurrentDate === true && timeFormat === '12hour'
                                    ? moment(new Date(date), ['HH:mm']).format('h:mm A')
                                    : isDate && timeFormat === '24hour'
                                    ? moment(new Date(date), ['HH:mm']).format('HH:mm A')
                                    : dateRefObject.current.isNotCurrentDate === true
                                    ? moment(new Date(date), ['HH:mm']).format('HH:mm A')
                                    : isDate && timeFormat === '12hour'
                                    ? moment(new Date(date), ['HH:mm']).format('h:mm A')
                                    : dateRefObject.current.isNotCurrentDate === true
                                    ? moment(new Date(date), ['HH:mm']).format('h:mm A')
                                    : 'Select Time'}
                            </Text>
                            <View>
                                <Icon
                                    type="AntDesign"
                                    name="clockcircleo"
                                    size={25}
                                    color={COLORS.black}
                                    extraStyles={styles.iconStyle}
                                    onPress={() => (editable === true ? showMode('time') : '')}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : pickerType === 'monthYearBoth' ? (
                    <View>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                style={editable === true ? styles.monthYearField : styles.nonEditableMonthField}
                                onPress={() => (editable === true ? setShowMonthPicker(true) : '')}
                            >
                                <Text style={styles.text}>
                                    {captureCurrentDate === true
                                        ? moment(new Date(date)).format('MMMM, YYYY')
                                        : isDate
                                        ? moment(new Date(date)).format('MMMM, YYYY')
                                        : dateRefObject.current.isNotCurrentDate === true
                                        ? moment(new Date(date)).format('MMMM, YYYY')
                                        : 'Select Month/Year'}
                                </Text>
                                <Icon
                                    type="Ionicons"
                                    name="calendar-outline"
                                    size={25}
                                    color={COLORS.black}
                                    extraStyles={styles.monthIconStyle}
                                    onPress={() => (editable === true ? setShowMonthPicker(true) : '')}
                                />
                            </TouchableOpacity>
                        </View>
                        {showMonthPicker && (
                            <MonthPicker
                                value={new Date(date)}
                                onChange={onValueChange}
                                locale="en"
                                {...(minDateObj && { minimumDate: new Date(minDateObj?.year, minDateObj?.month) })}
                                {...(maxDateObj && { maximumDate: new Date(maxDateObj?.year, maxDateObj?.month) })}
                            />
                        )}
                    </View>
                ) : (
                    <></>
                )}

                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={new Date(date)}
                        mode={mode}
                        is24Hour={timeFormat === '12hour' ? false : true}
                        display="default"
                        onChange={onChange}
                        {...(minDate && { minimumDate: new Date(minDate) })}
                        {...(maxDate && { maximumDate: new Date(maxDate) })}
                    />
                )}
                {error && date ? <Text style={styles.error}>{error}</Text> : <></>}
            </View>
        </SafeAreaView>
    );
};

export default DatePickerComponent;
