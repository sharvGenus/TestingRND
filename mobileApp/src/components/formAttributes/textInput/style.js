import { StyleSheet } from 'react-native';
import COLORS from '../../../constants/color';
import { fonts, ratioHeight } from '../../../constants/themes';

const styles = StyleSheet.create({
    container: {
        color: COLORS.black,
        flex: 1
    },
    fieldName: {
        fontSize: fonts.size.font14,
        color: COLORS.darker
    },
    inputStyle: {
        color: COLORS.black,
        fontSize: fonts.size.font15,
        paddingHorizontal: 10,
        width: '100%',
        paddingVertical: 10 * ratioHeight,
        borderRadius: 10
    },
    subContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        zIndex: 9
    },
    inputField: {
        borderWidth: 0.5,
        padding: 10,
        borderRadius: 2,
        fontFamily: fonts.type.publicSansRegular,
        width: '90%',
        marginVertical: 10,
        marginHorizontal: 20,
        borderColor: 'rgb(118,118,118)'
    },
    nonEditableField: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 2,
        fontFamily: fonts.type.publicSansRegular,
        width: '90%',
        marginVertical: 10,
        marginHorizontal: 20,
        borderColor: '#ededed'
    },
    field: {
        marginTop: 10 * ratioHeight
    },
    heading: {
        fontSize: fonts.size.font14,
        fontWeight: fonts.weight.bold,
        color: COLORS.black
    },
    geoLocation: {
        alignItems: 'flex-end',
        bottom: 50,
        right: 15
    },
    error: {
        bottom: 35
    },
    networkSignal: {
        alignItems: 'flex-end',
        bottom: 40,
        right: 25
    },
    centeredView: {
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
    modalView: {
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
    liveLocation: {
        left: 20
    },
    networkSignalStrength: {
        height: 110,
        borderWidth: 0.5,
        padding: 10,
        borderRadius: 2,
        fontFamily: fonts.type.publicSansRegular,
        width: '90%',
        marginVertical: 9,
        marginHorizontal: 18,
        borderColor: 'rgb(118,118,118)'
    },
    noteText: {
        fontFamily: fonts.type.publicSansRegular,
        fontSize: fonts.size.font10,
        color: COLORS.buttonColor,
        paddingHorizontal: 20,
        bottom: 25
    },
    settingsIcon: {
        width: '40%',
        bottom: 35,
        alignItems: 'flex-end',
        right: 20
    },
    keyGeneratorField: {
        height: 70,
        borderWidth: 0.5,
        padding: 10,
        borderRadius: 2,
        fontFamily: fonts.type.publicSansRegular,
        width: '90%',
        marginVertical: 9,
        marginHorizontal: 18,
        borderColor: 'rgb(118,118,118)',
        textAlign: 'auto'
    },
    nonEditableKeyGenerator: {
        height: 70,
        borderWidth: 1,
        padding: 10,
        borderRadius: 2,
        fontFamily: fonts.type.publicSansRegular,
        width: '90%',
        marginVertical: 10,
        marginHorizontal: 20,
        borderColor: '#ededed',
        textAlign: 'auto'
    },
    locationFeatures: {
        bottom: 45
    },
    visitLocation: {
        width: '40%',
        alignItems: 'flex-end',
        right: 15,
        top: 5
    },
    liveLocationUnits: {
        color: COLORS.buttonColor
    },
    locationCapturedView: {
        alignItems: 'flex-end',
        marginRight: 20,
        top: 10
    },
    locationCapturedText: {
        color: COLORS.black,
        fontFamily: fonts.type.publicSansSemiBold
    },
    refrenceCodeField: {
        borderWidth: 0.5,
        padding: 10,
        borderRadius: 2,
        fontFamily: fonts.type.publicSansRegular,
        width: '90%',
        marginVertical: 10,
        marginHorizontal: 20,
        borderColor: 'rgb(118,118,118)',
        color: COLORS.black
    },
    refreshButtonView: {
        alignItems: 'flex-end',
        bottom: 48,
        right: 30
    }
});

export default styles;
