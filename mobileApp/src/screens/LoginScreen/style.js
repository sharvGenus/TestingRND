import { StyleSheet } from 'react-native';
import COLORS from '../../constants/color';
import { fonts } from '../../constants/themes';

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        color: COLORS.white,
        backgroundColor: COLORS.backgroundColor
    },
    topContainer: {
        paddingVertical: 35,
        borderBottomRightRadius: 20,
        paddingHorizontal: 40,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'space-between',
        padding: 10
    },
    container: {
        alignItems: 'center',
        marginTop: '20%',
        paddingHorizontal: 20
    },
    inputFieldView: {
        width: '100%',
        marginTop: '8%'
    },
    inputTitle: {
        color: COLORS.black,
        fontSize: fonts.size.font14,
        fontFamily: fonts.type.publicSansBold
    },
    disabledInputTitle: {
        color: COLORS.transparent,
        fontSize: fonts.size.font14,
        fontFamily: fonts.type.publicSansBold
    },
    inputField: {
        height: 41,
        borderWidth: 0.5,
        padding: 10,
        borderRadius: 2,
        fontFamily: fonts.type.publicSansRegular,
        borderColor: 'rgb(118,118,118)'
    },
    verifyButtonTextView: {
        alignItems: 'flex-end'
    },
    verifyButtonText: {
        fontFamily: fonts.type.publicSansSemiBold,
        fontSize: fonts.size.font15,
        color: COLORS.buttonColor,
        textDecorationLine: 'underline'
    },
    disabledVerifyButtonText: {
        fontFamily: fonts.type.publicSansSemiBold,
        fontSize: fonts.size.font15,
        color: COLORS.green,
        textDecorationLine: 'underline'
    },
    loader: {
        alignSelf: 'center',
        bottom: 35
    },
    imageLogo: {
        width: 100,
        height: 50
    },
    genusLogo: {
        width: 90,
        height: 70
    },
    imageContainer: {
        right: 45,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 5
    },
    buttonContainer: {
        alignSelf: 'center',
        width: '100%',
        paddingHorizontal: 20
    }
});

export default styles;
