import { StyleSheet } from 'react-native';
import COLORS from '../../../constants/color';
import { fonts, ratioHeight } from '../../../constants/themes';

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        flex: 1
    },
    field: {
        marginTop: 10 * ratioHeight
    },
    heading: {
        fontSize: fonts.size.font14,
        fontWeight: fonts.weight.bold,
        fontFamily: fonts.type.publicSansSemiBold,
        color: COLORS.black
    },
    inputField: {
        height: 50,
        borderWidth: 0.5,
        borderRadius: 2,
        // width: "50%",
        marginVertical: 10,
        marginHorizontal: 80,
        borderColor: 'rgb(118,118,118)',
        backgroundColor: COLORS.buttonColor,
        marginTop: 20
    },
    signature: {
        flex: 1,
        borderColor: 'white',
        borderWidth: 1,
        minHeight: '80%'
    },
    buttonStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        margin: 10
    },
    text: {
        fontSize: fonts.size.font16,
        fontFamily: fonts.type.publicSansSemiBold,
        fontWeight: fonts.weight.semi,
        color: COLORS.white,
        marginTop: 8 * ratioHeight,
        textAlign: 'center'
    },
    signatureContainer: {
        marginVertical: 10,
        marginHorizontal: 20
    },
    signatureImage: {
        width: 60,
        height: 60
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        backgroundColor: 'rgba(0,0,0,0.5) '
    },
    modalView: {
        margin: 20,
        padding: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalImage: {
        width: '100%',
        aspectRatio: 0.7
    },
    iconStyle1: {
        alignItems: 'center',
        bottom: 50,
        right: 40
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
        marginLeft: 5
    },
    descriptionText: {
        color: COLORS.black
    }
});

export default styles;
