import { StyleSheet } from 'react-native';
import COLORS from '../../constants/color';
import { fonts } from '../../constants/themes';

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
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
        justifyContent: 'space-between',
        padding: 10
    },
    container: {
        alignItems: 'center',
        marginTop: '20%',
        paddingHorizontal: 20
    },
    screenTitle: {
        fontSize: fonts.size.font15,
        color: COLORS.black,
        fontFamily: fonts.type.publicSansRegular,
        textAlign: 'center'
    },
    inputField: {
        marginTop: '5%'
    },
    resendOtp: {
        color: COLORS.themeColor,
        fontFamily: fonts.type.publicSansMedium
    },
    roundedTextInput: {
        borderRadius: 10,
        borderWidth: 4,
        borderColor: 'blue'
    },
    onBackPress: {
        marginTop: 10,
        marginBottom: 20,
        alignSelf: 'flex-start'
    },
    buttonContainer: {
        alignSelf: 'center',
        width: '100%',
        paddingHorizontal: 20
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
    }
});

export default styles;
