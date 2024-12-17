import { StyleSheet } from 'react-native';
import COLORS from '../../../constants/color';
import { fonts } from '../../../constants/themes';

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'black'
    },
    doneTextView: {
        alignItems: 'flex-end',
        right: 5,
        top: 5
    },
    doneTextStyles: {
        color: COLORS.white,
        fontSize: fonts.size.font16
    }
});

export default styles;
