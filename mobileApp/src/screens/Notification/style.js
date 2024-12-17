import { StyleSheet } from 'react-native';
import COLORS from '../../constants/color';
import { fonts } from '../../constants/themes';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.offWhite
    },
    notification: {
        justifyContent: 'center',
        textAlign: 'center',
        marginTop: '50%',
        fontSize: fonts.size.font23
    },
    text: {
        justifyContent: 'center',
        textAlign: 'center',
        marginTop: '50%',
        fontSize: 24
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: COLORS.tabBackgroundColor
    },
    tab: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent'
    },
    activeTab: {
        borderBottomColor: COLORS.tabColors
    },
    tabText: {
        color: COLORS.tabColors,
        fontWeight: fonts.weight.bold
    }
});

export default styles;
