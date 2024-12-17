import { StyleSheet } from 'react-native';
import COLORS from '../../constants/color';
import { fonts, ratioHeight, ratioWidth } from '../../constants/themes';

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        color: COLORS.white,
        backgroundColor: COLORS.backgroundColor
    },
    topContainer: {
        backgroundColor: '#024477',
        paddingVertical: 35,
        borderBottomRightRadius: 20,
        paddingHorizontal: 40
    },
    keyborardContainer: {
        flex: 1,
        padding: 20
    },
    logo: {
        alignItems: 'center'
    },
    titleView: {
        alignItems: 'center',
        paddingVertical: 40
    },
    title: {
        fontFamily: fonts.type.publicSansSemiBold,
        fontSize: fonts.size.font20,
        color: COLORS.black
    },
    container: {
        flex: 1,
        paddingTop: 64
    },
    container1: {
        marginTop: 10
    },
    container2: {
        marginTop: 20
    },
    screenTitle: {
        fontSize: fonts.size.font11,
        color: COLORS.black,
        fontFamily: fonts.type.publicSansRegular
    },
    inputField: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        paddingVertical: 40,
        backgroundColor: COLORS.offWhite,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#FCFCFC'
    },
    text: {
        fontSize: fonts.size.font11,
        color: COLORS.themeColor,
        textAlign: 'center',
        paddingTop: 16
    },
    biometricText: {
        fontSize: fonts.size.font11,
        fontFamily: fonts.type.publicSansRegular,
        color: COLORS.black,
        textAlign: 'center',
        paddingTop: 20
    },
    biometricIcon: {
        paddingTop: 20,
        alignItems: 'center'
    },
    biometricLabel: {
        paddingTop: 16,
        color: '#A0A0A0',
        textAlign: 'center'
    },
    forgotView: {
        paddingTop: 20
    },
    forgotText: {
        textAlign: 'center',
        color: COLORS.themeColor
    },
    otpButton: {
        backgroundColor: COLORS.themeColor,
        position: 'absolute',
        width: '100%',
        bottom: 20,
        height: 39
    },
    otpText: {
        color: COLORS.white,
        fontSize: fonts.size.font12,
        fontFamily: fonts.type.publicSansRegular,
        textAlign: 'center',
        top: 10
    }
});

export default styles;
