import { StyleSheet } from 'react-native';
import COLORS from '../../../constants/color';
import { fonts, ratioHeight } from '../../../constants/themes';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    title: {
        fontSize: fonts.size.font20,
        margin: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#0163AF',
        width: '50%'
    },
    subContainer: {
        minHeight: 100,
        width: '100%',
        borderRadius: 6,
        backgroundColor: COLORS.lighter,
        elevation: 3,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        zIndex: 999,
        padding: 10
    },
    topicContainer: {
        fontSize: fonts.size.font18,
        color: COLORS.buttonColor,
        fontFamily: fonts.type.publicSansMedium
    },
    projectContainer: {
        paddingTop: 5,
        paddingBottom: 5,
        fontSize: fonts.size.font14,
        color: COLORS.formName,
        fontFamily: fonts.type.publicSansMedium
    },
    iconStyle1: {
        alignItems: 'flex-end'
    },
    iconStyle: {
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'row'
    },
    totalFormsCount: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        fontsize: fonts.size.font14,
        padding: 4,
        marginRight: 20
    },
    totalFormsCountText: {
        color: COLORS.black,
        fontFamily: fonts.type.publicSansSemiBold,
        textAlign: 'center'
    },
    totalCounts: {
        fontsize: fonts.size.font12,
        alignItems: 'flex-start'
    },
    totalCountsText: {
        color: COLORS.blue,
        textAlign: 'center',
        fontFamily: fonts.type.publicSansSemiBold,
        fontSize: fonts.size.font12
    },
    downloadIconStyle: {
        alignItems: 'flex-end',
        right: 8,
        bottom: 10,
        position: 'absolute',
        zIndex: 9
    },
    resurveyView: {
        flexDirection: 'row'
    },
    resurveyIconStyle: {
        alignItems: 'flex-end'
    },
    formNames: {
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    completedColor: {
        color: COLORS.green
    },
    resurveyColor: {
        color: COLORS.red
    },
    iconEditStyle: {
        right: 5
    },
    iconCreateStyle: {
        right: 15
    }
});

export default styles;
