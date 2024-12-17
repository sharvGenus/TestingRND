import { StyleSheet } from 'react-native';
import { fonts, ratioHeight } from '../../../constants/themes';
import COLORS from '../../../constants/color';

const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777'
    },
    textBold: {
        fontWeight: '500',
        color: '#000'
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
        padding: 16
    },
    container: {
        backgroundColor: COLORS.white,
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
    iconStyle: {
        width: '15%',
        alignSelf: 'flex-end',
        bottom: 40
    },
    iconStyleGenerator: {
        alignItems: 'flex-end',
        bottom: 20,
        right: 10
    },
    inputField: {
        height: 50,
        borderWidth: 0.5,
        borderRadius: 2,
        width: '90%',
        marginVertical: 10,
        marginHorizontal: 20,
        borderColor: 'rgb(118,118,118)'
    },
    text: {
        fontSize: fonts.size.font13,
        fontFamily: fonts.type.publicSansSemiBold,
        fontWeight: fonts.weight.semi,
        color: COLORS.buttonColor,
        marginTop: 8 * ratioHeight,
        marginLeft: 20
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        backgroundColor: 'rgba(0,0,0,0.5) '
    },
    modalView: {
        margin: 20,
        padding: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    qrGenerator: {
        marginHorizontal: 20
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.light_transparent
    },
    modalContent: {
        backgroundColor: COLORS.white,
        padding: 20,
        borderRadius: 10,
        width: '80%'
    },
    modalHeadingText: {
        fontSize: fonts.size.font16,
        marginBottom: 10,
        color: COLORS.black,
        marginBottom: 10
    },
    modalText: {
        fontSize: fonts.size.font14,
        marginBottom: 10,
        color: COLORS.themeColor,
        marginLeft: 5
    },
    valueItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.grey
    }
});

export default styles;
