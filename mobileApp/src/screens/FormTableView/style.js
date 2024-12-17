import COLORS from '../../constants/color';
import { fonts, ratioHeight } from '../../constants/themes';

const { StyleSheet } = require('react-native');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    subContainer: {
        flex: 1
    },
    heading: {
        minHeight: 40,
        backgroundColor: '#f1f8ff'
    },
    headTextStyle: {
        fontWeight: fonts.weight.semi,
        fontSize: fonts.size.font10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 'auto',
        width: 150,
        height: 55,
        paddingLeft: 10,
        paddingRight: 5,
        paddingTop: 10,
        borderWidth: 1,
        borderColor: '#c8e1ff'
    },
    dateHeader: {
        fontSize: fonts.size.font16,
        fontWeight: fonts.weight.bold,
        fontFamily: fonts.type.publicSansBold,
        margin: 10 * ratioHeight
    },
    valuesTextStyle: {
        margin: 6
    },
    scrollViewStyle: {
        height: '80%'
    },
    modalContainer: {
        flex: 1,
        width: '100%',
        height: 'auto',
        borderWidth: 1,
        borderColor: COLORS.black
    },
    tableView: {
        borderWidth: 1,
        borderColor: '#c8e1ff'
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: COLORS.white
    },
    footerText: {
        fontSize: fonts.size.font14,
        marginLeft: 10,
        color: COLORS.themeColor
    },
    text: {
        justifyContent: 'center',
        textAlign: 'center',
        marginTop: '50%',
        fontSize: fonts.size.font23
    }
});

export default styles;
