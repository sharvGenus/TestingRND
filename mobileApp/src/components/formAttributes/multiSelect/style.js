import { StyleSheet } from 'react-native';
import { fonts, ratioHeight } from '../../../constants/themes';
import COLORS from '../../../constants/color';

const styles = StyleSheet.create({
    field: {
        marginTop: 10 * ratioHeight,
        flex: 1
    },
    heading: {
        fontSize: fonts.size.font14,
        fontWeight: fonts.weight.bold,
        color: COLORS.black
    },
    error: {
        color: 'red',
        paddingLeft: 20
    },
    inputField: {
        height: 'auto',
        borderWidth: 0.5,
        borderRadius: 2,
        width: '90%',
        marginVertical: 10,
        marginHorizontal: 20,
        borderColor: 'rgb(118,118,118)'
    },
    styleItemsContainer: {
        borderColor: COLORS.purplishGrey,
        borderWidth: 1,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    styleInputGroup: {
        borderWidth: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    text: {
        left: 10,
        fontFamily: fonts.type.publicSansMedium
    },
    tagContainerStyle: {
        borderColor: COLORS.purplishGrey,
        borderWidth: 1,
        left: 15
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
    iconStyle: {
        bottom: 20,
        right: 8
    },
    iconStyle2: {
        bottom: 30,
        right: 8
    },
    dropdownText: {
        fontSize: fonts.size.font13,
        fontFamily: fonts.type.publicSansSemiBold,
        fontWeight: fonts.weight.semi,
        color: COLORS.grey,
        marginTop: 15 * ratioHeight,
        marginLeft: 20
    },
    minusIcon: {
        alignItems: 'flex-start',
        marginLeft: 5
    },
    closeIcon: {
        alignItems: 'flex-end',
        marginRight: 20
    },
    selectedItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: 'black',
        borderRadius: 30,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderWidth: 1,
        justifyContent: 'center',
        marginRight: 5,
        marginBottom: 5
    },
    dropdownContainer: {
        paddingBottom: 50
    },
    modalContainer: {
        flex: 1,
        padding: 20
    },
    dropdownItem: {
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        paddingBottom: 8,
        paddingTop: 8,
        fontSize: fonts.size.font20
    },
    selectedDropdownItemText: {
        color: COLORS.buttonColor,
        fontSize: fonts.size.font16
    },
    dropdownItemText: {
        fontSize: fonts.size.font16
    },
    disabledInputField: {
        height: 'auto',
        borderWidth: 0.2,
        borderRadius: 2,
        width: '90%',
        marginVertical: 10,
        marginHorizontal: 20,
        borderColor: COLORS.grey
    },
    disabledDropdownText: {
        fontSize: fonts.size.font13,
        fontFamily: fonts.type.publicSansSemiBold,
        fontWeight: fonts.weight.semi,
        color: COLORS.grey,
        marginTop: 8 * ratioHeight,
        marginLeft: 20
    },
    iconTouchable: {
        width: '10%',
        alignSelf: 'flex-end'
    }
});

export default styles;
