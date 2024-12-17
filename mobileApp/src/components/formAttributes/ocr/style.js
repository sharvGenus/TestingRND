import COLORS from '../../../constants/color';
import { fonts, ratioHeight } from '../../../constants/themes';

const { StyleSheet } = require('react-native');

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        flex: 1
    },
    field: {
        marginTop: 10 * ratioHeight
    },
    subContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        zIndex: 9
    },
    heading: {
        fontSize: fonts.size.font14,
        fontWeight: fonts.weight.bold,
        color: COLORS.black
    },
    descriptionView: {
        position: 'absolute',
        left: 10,
        right: 10,
        top: 25,
        justifyContent: 'center',
        alignItems: 'center'
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
    descriptionText: {
        color: COLORS.black
    },
    infoIcon: {
        marginLeft: 5
    },
    inputField: {
        height: 50,
        borderWidth: 0.5,
        borderRadius: 2,
        width: '90%',
        marginVertical: 10,
        marginHorizontal: 20,
        borderColor: 'rgb(118,118,118)',
        flexDirection: 'column'
    },
    text: {
        fontSize: fonts.size.font13,
        fontFamily: fonts.type.publicSansSemiBold,
        fontWeight: fonts.weight.semi,
        color: COLORS.buttonColor,
        marginTop: 8 * ratioHeight,
        marginLeft: 20
    },
    iconStyle: {
        position: 'absolute',
        width: '30%',
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        top: 0,
        right: 8,
        bottom: 10
    },
    iconStyle1: {
        position: 'absolute',
        width: '30%',
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        top: 0,
        right: 8,
        bottom: 10
    },
    loader: {
        alignSelf: 'center',
        bottom: 35
    },
    ocrLogo: {
        width: 30,
        height: 30
    }
});

export default styles;
