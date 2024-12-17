import { StyleSheet } from 'react-native';
import { fonts, ratioHeight, ratioWidth } from '../../constants/themes';
import COLORS from '../../constants/color';

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        flex: 1
    },
    submitButton: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    submitButtonForEdit: {
        width: '100%'
    },
    submitButtonExit: {
        width: '48%'
    },
    text: {
        justifyContent: 'center',
        textAlign: 'center',
        marginTop: '50%',
        fontSize: 24
    },
    separator: {
        borderBottomWidth: 2,
        borderColor: COLORS.grey,
        marginTop: 15,
        width: '90%',
        marginVertical: 10,
        marginHorizontal: 20
    },
    separatorText: {
        color: COLORS.buttonColor,
        fontFamily: fonts.type.publicSansBold,
        fontSize: fonts.size.font18
    },
    buttonStyle: {
        paddingVertical: 20
    }
});

export default styles;
