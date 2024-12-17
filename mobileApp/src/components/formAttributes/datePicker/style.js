import { StyleSheet } from 'react-native';
import { fonts, ratioHeight } from '../../../constants/themes';
import COLORS from '../../../constants/color';

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    field: {
        marginTop: 10 * ratioHeight
    },
    heading: {
        fontSize: fonts.size.font14,
        fontWeight: fonts.weight.bold,
        color: COLORS.black
    },
    datePickerStyle: {
        width: 200,
        marginTop: 20
    },
    dateField: {
        height: 41,
        borderWidth: 0.5,
        borderRadius: 2,
        width: '35%',
        marginVertical: 10,
        marginHorizontal: 20,
        borderColor: COLORS.enabledFieldColor,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    timeField: {
        height: 41,
        borderWidth: 0.5,
        borderRadius: 2,
        width: '33%',
        marginVertical: 10,
        marginHorizontal: 20,
        borderColor: COLORS.enabledFieldColor,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    nonEditableDateField: {
        height: 41,
        borderWidth: 1,
        borderRadius: 2,
        width: '35%',
        marginVertical: 10,
        marginHorizontal: 20,
        borderColor: COLORS.disabledFieldColor,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    nonEditableTimeField: {
        height: 41,
        borderWidth: 1,
        borderRadius: 2,
        width: '33%',
        marginVertical: 10,
        marginHorizontal: 20,
        borderColor: COLORS.disabledFieldColor,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    iconStyle: {
        alignItems: 'flex-end',
        marginRight: 8,
        top: 6
    },
    text: {
        fontSize: fonts.size.font13,
        fontFamily: fonts.type.publicSansSemiBold,
        fontWeight: fonts.weight.semi,
        color: COLORS.buttonColor,
        marginTop: 8 * ratioHeight,
        marginLeft: 15
    },
    error: {
        color: 'red',
        paddingLeft: 20
    },
    subContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        zIndex: 9
    },
    centeredDescriptionView: {
        backgroundColor: COLORS.white,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalDescriptionView: {
        alignItems: 'center'
    },
    descriptionView: {
        position: 'absolute',
        left: 10,
        right: 10,
        top: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    infoIcon: {
        marginLeft: 5
    },
    descriptionText: {
        color: COLORS.black
    },
    monthYearField: {
        height: 42,
        borderWidth: 0.5,
        borderRadius: 2,
        width: 'auto',
        marginVertical: 10,
        marginHorizontal: 20,
        borderColor: COLORS.enabledFieldColor,
        flexDirection: 'row',
        paddingRight: 10
    },
    nonEditableMonthField: {
        height: 42,
        borderWidth: 0.5,
        borderRadius: 2,
        width: 'auto',
        marginVertical: 10,
        marginHorizontal: 20,
        borderColor: COLORS.disabledFieldColor,
        flexDirection: 'row',
        paddingRight: 10
    },
    monthIconStyle: {
        alignItems: 'flex-end',
        left: 5
    }
});

export default styles;
