import { StyleSheet } from 'react-native';
import COLORS from '../../constants/color';
import { fonts, ratioHeight, ratioWidth } from '../../constants/themes';

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        color: COLORS.white,
        backgroundColor: COLORS.backgroundColor,
        marginBottom: 20
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
        paddingVertical: 30
    },
    title: {
        fontFamily: fonts.type.publicSansSemiBold,
        fontSize: fonts.size.font20,
        color: COLORS.black
    },
    container: {
        flex: 1
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
    checkBox: {
        flexDirection: 'row',
        alignItems: 'center',
        color: COLORS.offWhite,
        flexWrap: 'wrap',
        paddingTop: 75
    },
    checkBoxText: {
        fontFamily: fonts.type.publicSansSemiBold,
        fontSize: fonts.size.font11,
        color: COLORS.black
    },
    checkBoxLine: {
        color: COLORS.black,
        fontSize: fonts.size.font11,
        fontFamily: fonts.type.publicSansThin,
        paddingLeft: 8 * ratioWidth,
        width: '100%'
    },
    otpButton: {
        position: 'absolute',
        width: '100%',
        bottom: 20
    },
    otpText: {
        color: COLORS.white,
        fontSize: fonts.size.font12,
        fontFamily: fonts.type.publicSansRegular,
        textAlign: 'center',
        top: 10
    },
    button: {
        height: 39,
        backgroundColor: COLORS.themeColor
    }
});

export default styles;
