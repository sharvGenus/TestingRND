import { StyleSheet } from 'react-native';
import COLORS from '../../../constants/color';
import { fonts, ratioHeight, ratioWidth } from '../../../constants/themes';

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    checkBox: {
        flexDirection: 'row',
        alignItems: 'center',
        color: COLORS.offWhite,
        flexWrap: 'wrap',
        paddingTop: 10,
        marginLeft: 20
    },
    checkBoxText: {
        fontFamily: fonts.type.publicSansSemiBold,
        fontSize: fonts.size.font11,
        color: COLORS.black
    },
    field: {
        marginTop: 10 * ratioHeight
    },
    heading: {
        fontSize: fonts.size.font14,
        fontWeight: fonts.weight.bold,
        color: COLORS.black
    },
    error: {
        color: 'red',
        paddingLeft: 20
    },
    subContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        zIndex: 9
    },
    centeredDescriptionView: {
        backgroundColor: COLORS.white,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalDescriptionView: {
        alignItems: 'center'
    },
    descriptionView: {
        position: 'absolute',
        left: 10,
        right: 10,
        top: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    infoIcon: {
        marginLeft: 5,
        top: 0
    },
    descriptionText: {
        color: COLORS.black
    }
});

export default styles;
