import { StyleSheet } from 'react-native';
import { fonts, ratioHeight } from '../../../constants/themes';
import COLORS from '../../../constants/color';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
        paddingTop: 15,
        paddingBottom: 15
    },
    item: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        height: '100%',
        width: '100%',
        borderRadius: 6,
        backgroundColor: COLORS.lighter,
        elevation: 3,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        zIndex: 999,
        padding: 15,
        minHeight: 100
    },
    title: {
        fontSize: fonts.size.font20,
        // margin: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#0163AF'
        // width: '50%'
    },
    numberOfFormsContainer: {
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 100,
        height: 30,
        width: 30,
        alignItems: 'center',
        borderColor: '#0163AF'
    },
    numberOfForms: {
        fontSize: fonts.size.font16,
        flexDirection: 'row',
        color: '#0163AF',
        fontWeight: 600
    },
    subContainer: {
        height: Math.min(100 * ratioHeight, 70),
        width: '95%',
        borderRadius: 6,
        backgroundColor: COLORS.lighter,
        elevation: 3,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        zIndex: 999,
        marginVertical: 10,
        marginHorizontal: 10
    },
    subContainer1: {
        minHeight: Math.min(100 * ratioHeight, 60),
        width: '95%',
        borderRadius: 6,
        backgroundColor: COLORS.lighter,
        elevation: 2,
        marginVertical: 10,
        marginHorizontal: 10
    },
    topicContainer: {
        margin: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: fonts.size.font16,
        color: '#333'
    },
    iconStyle1: {
        alignItems: 'flex-end',
        marginLeft: 'auto',
        marginRight: 5,
        justifyContent: 'center'
        // bottom: 30,
        // right: 40
    },
    iconStyle: {
        alignItems: 'flex-end',
        bottom: 45,
        right: 80
    },
    eyeIconStyle: {
        alignItems: 'flex-end',
        bottom: 75,
        right: 20
    },
    formsCount: {
        fontsize: fonts.size.font14,
        bottom: 20,
        left: 20
    },
    formsCountText: {
        color: COLORS.black,
        fontFamily: fonts.type.publicSansSemiBold
    },
    counts: {
        fontsize: fonts.size.font12,
        bottom: 38,
        left: 140,
        backgroundColor: COLORS.black,
        width: '11%',
        borderRadius: 10,
        height: '33%'
    },
    countsText: {
        color: COLORS.white,
        textAlign: 'center'
    },
    iconView: {
        marginRight: 10
    },
    categoryWiseIcon: {
        width: 35,
        height: 35
    },
    masterCategoryWiseIcon: {
        width: 30,
        height: 35
    },
    surveyCategoryWiseIcon: {
        width: 40,
        height: 40
    }
});

export default styles;
