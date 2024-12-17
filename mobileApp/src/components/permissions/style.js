import { StyleSheet } from 'react-native';
import COLORS from '../../constants/color';
import { fonts } from '../../constants/themes';

const styles = StyleSheet.create({
    mainModalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    modalView: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 0,
        height: '100%',
        width: '100%'
    },
    permissionsView: {
        padding: 10
    },
    termsHeadingView: {
        backgroundColor: COLORS.red,
        padding: 10,
        marginTop: 10
    },
    termsTextView: {
        color: COLORS.black,
        fontWeight: fonts.weight.bold
    },
    permissionsHeadingView: {
        paddingBottom: 40,
        paddingTop: 80
    },
    permissionsHeadingViewTwo: {
        paddingBottom: 40
    },
    permissionsdescription: {
        color: COLORS.black,
        fontWeight: fonts.weight.bold
    },
    agreeButtonView: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        marginRight: 30,
        marginLeft: 30
    },
    agreeButtonText: {
        color: COLORS.white,
        textAlign: 'center',
        backgroundColor: COLORS.buttonColor,
        padding: 10,
        borderRadius: 5,
        marginBottom: 10
    }
});

export default styles;
