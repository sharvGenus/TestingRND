import { StyleSheet } from 'react-native';
import { fonts, ratioHeight } from '../../constants/themes';
import COLORS from '../../constants/color';

const styles = StyleSheet.create({
    notification: {
        width: 20,
        height: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    notificationNumber: {
        color: COLORS.white
    }
});

export default styles;
