import { StyleSheet } from 'react-native';
import { fonts, ratioHeight } from '../../../constants/themes';
import COLORS from '../../../constants/color';

const styles = StyleSheet.create({
    field: {
        marginTop: 10 * ratioHeight
    },
    phoneContainer: {
        borderColor: 'rgb(118,118,118)',
        borderWidth: 0.5,
        borderRadius: 2,
        height: 48,
        width: '90%',
        marginVertical: 10,
        marginHorizontal: 20
    },
    nonEditableField: {
        borderWidth: 0.5,
        borderRadius: 2,
        height: 48,
        width: '90%',
        marginVertical: 15,
        marginHorizontal: 20,
        borderColor: '#ededed'
    },
    phoneInput: {
        height: 40,
        fontSize: fonts.size.font15
    },
    heading: {
        fontSize: fonts.size.font14,
        fontWeight: fonts.weight.bold,
        color: COLORS.black
    },
    codeText: {
        height: 22
    },
    textContainer: {
        height: 1,
        marginTop: 6,
        backgroundColor: COLORS.white
    },
    error: {
        color: COLORS.red,
        paddingLeft: 20
    },
    subContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        zIndex: 9
    },
    centeredView: {
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
    modalView: {
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
    descriptionText: {
        color: COLORS.black
    },
    verifyButton: {
        color: COLORS.themeColor,
        fontSize: fonts.size.font14,
        fontFamily: fonts.type.publicSansSemiBold,
        fontWeight: fonts.weight.semi,
        alignSelf: 'flex-end',
        paddingRight: 25
    },

    otpText: {
        color: COLORS.white,
        fontSize: fonts.size.font12,
        fontFamily: fonts.type.publicSansRegular,
        textAlign: 'center',
        top: 10
    },
    roundedTextInput: {
        borderRadius: 10,
        borderWidth: 4,
        borderColor: 'blue'
    },
    inputField: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 10,
        paddingLeft: 35,
        paddingRight: 85
    },
    refusedStatusText: {
        color: COLORS.orange,
        fontSize: fonts.size.font14,
        fontFamily: fonts.type.publicSansSemiBold,
        position: 'absolute',
        bottom: 24,
        right: 36,
        fontWeight: fonts.weight.semi,
        alignSelf: 'flex-end'
    },
    verifiedStatusText: {
        color: COLORS.green,
        fontSize: fonts.size.font14,
        fontFamily: fonts.type.publicSansSemiBold,
        fontWeight: fonts.weight.semi,
        position: 'absolute',
        bottom: 24,
        right: 36,
        alignSelf: 'flex-end'
    },
    refusedIcon: {
        color: COLORS.white,
        fontSize: fonts.size.font12,
        fontFamily: fonts.type.publicSansSemiBold,
        fontWeight: fonts.weight.semi
    },
    errorButtonView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'flex-start'
    },
    errorView: {
        flex: 2,
        alignItems: 'flex-start'
    },
    buttonView: {
        flex: 1,
        alignItems: 'flex-end'
    },
    refuseButtonView: {
        backgroundColor: COLORS.orange,
        width: '22%',
        height: 35,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default styles;
