import { StyleSheet } from 'react-native';
import COLORS from '../../../constants/color';

const styles = StyleSheet.create({
    noInternetBlock: {
        backgroundColor: COLORS.internetBg,
        opacity: 0.7,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding: 2,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        zIndex: 9999
    },
    errorMessage: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: 'normal',
        flexWrap: 'wrap'
    }
});

export default styles;
