import { StyleSheet } from 'react-native';
import COLORS from '../../../constants/color';
import { fonts, ratioHeight, ratioWidth } from '../../../constants/themes';

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
        color: COLORS.black
    },
    iconStyle: {
        alignItems: 'flex-end',
        bottom: 20,
        right: 8
    },
    imageIcon: {
        flexDirection: 'row',
        bottom: 50,
        alignItems: 'flex-end',
        left: 50
    },
    image: {
        width: 60,
        height: 60
    },
    imageContainer: {
        marginVertical: 10,
        marginHorizontal: 20
    },

    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        marginHorizontal: 10,
        marginVertical: 10
    },
    overlayText: {
        color: 'white',
        fontSize: 16,
        marginBottom: 5
    },
    inputField: {
        height: 50,
        borderWidth: 0.5,
        borderRadius: 2,
        width: '90%',
        marginVertical: 10,
        marginHorizontal: 20,
        borderColor: 'rgb(118,118,118)'
    },
    text: {
        fontSize: fonts.size.font13,
        fontFamily: fonts.type.publicSansSemiBold,
        fontWeight: fonts.weight.semi,
        color: COLORS.buttonColor,
        marginTop: 8 * ratioHeight,
        marginLeft: 20
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5) '
    },
    modalView: {
        width: '90%',
        padding: 20,
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
        height: '100%'
    },
    iconStyle1: {
        alignItems: 'flex-start',
        bottom: 85,
        left: 70
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
    },
    cameraView: {
        flex: 1
    },
    buttonContainer: {
        backgroundColor: COLORS.transparent,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        bottom: 0,
        padding: 20
    },
    camButton: {
        height: 80,
        width: 80,
        borderRadius: 40,
        backgroundColor: COLORS.red,
        alignSelf: 'center',
        borderWidth: 4,
        borderColor: COLORS.white
    },
    backIcon: {
        alignItems: 'flex-start',
        paddingTop: 10,
        paddingLeft: 10
    }
});

export default styles;
