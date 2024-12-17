import { StyleSheet } from 'react-native';
import { fonts, ratioHeight, ratioWidth } from '../../constants/themes';
import COLORS from '../../constants/color';

const styles = StyleSheet.create({
    container: {
        height: '100%'
    },
    drawerContainer: { flex: 1, backgroundColor: COLORS.buttonColor },
    drawerLabel: {
        color: COLORS.offWhite,
        fontSize: fonts.size.font16,
        fontFamily: fonts.type.montserratMedium,
        marginLeft: -10 * ratioWidth
    },
    subContainer: {
        marginTop: 16 * ratioHeight
    },
    wipeData: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 'auto',
        marginBottom: 10 * ratioHeight
    },
    appVersionOuter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        marginTop: 'auto'
    },
    offlineText: {
        color: COLORS.lighter,
        marginLeft: 6,
        fontSize: fonts.size.font16,
        fontFamily: fonts.type.montserratMedium
    },
    appVersionTitle: {
        color: COLORS.lighter,
        fontSize: fonts.size.font16,
        fontFamily: fonts.type.montserratMedium
    },
    appVersionLabel: {
        color: COLORS.light,
        fontSize: fonts.size.font16,
        fontFamily: fonts.type.montserratMedium
    },
    avatarContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
        borderBottomWidth: 2,
        borderColor: COLORS.grey,
        width: '100%'
    },
    avatar: {
        width: 50,
        height: 60,
        borderRadius: 50,
        marginBottom: 10
    },
    userName: {
        fontSize: fonts.size.font18,
        fontWeight: fonts.weight.bold,
        marginBottom: 5,
        color: COLORS.light_blue
    },
    mobileNumber: {
        fontSize: fonts.size.font16,
        color: COLORS.light_blue,
        marginBottom: 20
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
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.chinese_silver,
        marginVertical: 5
    },
    closeButton: {
        backgroundColor: COLORS.buttonColor,
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10
    },
    closeButtonText: {
        fontSize: fonts.size.font16,
        color: COLORS.white
    },
    logos: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40
    },
    imageLogo: {
        width: 50,
        height: 50
    },
    genusLogo: {
        width: 90,
        height: 70
    }
});

export default styles;
