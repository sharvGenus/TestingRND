import { StyleSheet } from 'react-native';
import COLORS from '../../constants/color';
import { fonts } from '../../constants/themes';

const styles = StyleSheet.create({
    modalView: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        zIndex: 9999999999,
        backgroundColor: COLORS.blur,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    modalContainer: {
        backgroundColor: COLORS.white,
        padding: 40,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center'
    },
    modalTitle: {
        color: COLORS.black,
        fontSize: fonts.size.font18,
        paddingBottom: 28,
        textAlign: 'center',
        width: '100%',
        fontWeight: fonts.weight.bold
    },
    modalContent: {
        color: COLORS.black,
        fontSize: 14,
        paddingBottom: 28,
        textAlign: 'center',
        width: '100%',
        lineHeight: 24
    },
    modalUpdate: {
        borderRadius: 4,
        marginBottom: 12,
        backgroundColor: COLORS.buttonColor,
        paddingVertical: 10,
        paddingHorizontal: 40
    },
    buttonOne: {
        fontSize: fonts.size.font14,
        color: COLORS.white,
        letterSpacing: 0.56
    },
    buttonSecond: {
        fontSize: fonts.size.font14,
        color: COLORS.buttonColor,
        letterSpacing: 0.56
    }
});

export default styles;
