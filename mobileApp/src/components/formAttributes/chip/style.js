import { StyleSheet } from 'react-native';
import COLORS from '../../../constants/color';
import { fonts, ratioHeight } from '../../../constants/themes';

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white
        // flex:1
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
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
        paddingRight: 15
    },
    chipSelect: {
        fontSize: fonts.size.font16,
        fontFamily: fonts.type.publicSansSemiBold,
        fontWeight: fonts.weight.semi,
        color: COLORS.white,
        backgroundColor: COLORS.blue,
        borderWidth: 2,
        marginTop: 8 * ratioHeight,
        textAlign: 'center',
        paddingHorizontal: 20,
        marginHorizontal: 5,
        borderRadius: 0,
        paddingTop: 5,
        paddingBottom: 5,
        left: 20
    },
    chipText: {
        fontSize: fonts.size.font16,
        fontFamily: fonts.type.publicSansSemiBold,
        fontWeight: fonts.weight.semi,
        color: COLORS.black,
        borderColor: COLORS.blue,
        borderWidth: 2,
        marginTop: 8 * ratioHeight,
        textAlign: 'center',
        paddingHorizontal: 20,
        marginHorizontal: 5,
        borderRadius: 0,
        paddingTop: 5,
        paddingBottom: 5,
        left: 20
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
        marginLeft: 5
    },
    descriptionText: {
        color: COLORS.black
    }
});

export default styles;
