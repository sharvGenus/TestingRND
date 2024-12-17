import { StyleSheet } from 'react-native';
import COLORS from '../../constants/color';
import { fonts } from '../../constants/themes';

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: COLORS.buttonColor,
        height: 45
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    lefttCorner: {
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    rightCorner: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    backIcon: {
        top: 7
    },
    heading: {},
    headingText: {
        color: COLORS.white,
        fontSize: fonts.size.font23,
        textAlign: 'center',
        top: 5,
        fontFamily: fonts.type.publicSansSemiBold
    },
    hambergerMenu: {
        width: 40,
        top: 7
    },
    offlienUploadButton: {
        width: 40,
        top: 7
    },
    offlienDownloadButton: {
        width: 40,
        top: 6
    },
    modalContainer: {
        flex: 1,
        width: '100%',
        height: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        backgroundColor: 'rgba(0,0,0,0.5) '
    },
    subContainer: {
        minHeight: 10,
        width: '100%',
        borderRadius: 6,
        backgroundColor: COLORS.lighter,
        elevation: 3,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        zIndex: 999,
        padding: 10,
        shadowColor: '#000',
        marginTop: 5
    },
    formNames: {
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    topicContainer: {
        fontSize: fonts.size.font18,
        color: COLORS.buttonColor,
        fontFamily: fonts.type.publicSansMedium
    },
    totalFormsCount: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        fontsize: fonts.size.font14,
        padding: 4,
        marginRight: 5
    },
    totalFormsCountText: {
        color: COLORS.black,
        fontFamily: fonts.type.publicSansSemiBold,
        textAlign: 'center'
    },
    totalFormsCountSuccessText: {
        color: COLORS.green,
        fontFamily: fonts.type.publicSansSemiBold,
        textAlign: 'center'
    },
    totalFormsCountFailedText: {
        color: COLORS.darkRed,
        fontFamily: fonts.type.publicSansSemiBold,
        textAlign: 'center'
    },
    totalFormsCountDuplicateText: {
        color: COLORS.orange,
        fontFamily: fonts.type.publicSansSemiBold,
        textAlign: 'center'
    },
    text: {
        justifyContent: 'center',
        textAlign: 'center',
        marginTop: '50%',
        fontSize: 24
    },
    closeSearchModel: {
        alignSelf: 'flex-end',
        justifyContent: 'center',
        backgroundColor: 'gray'
    },
    cardNameView: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    cardCountsView: {
        width: '100%',
        flexDirection: 'row',
        marginTop: 5,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    cardCardStylesView: {
        flexDirection: 'row'
    },
    cardCountStyleView: {
        flexDirection: 'row'
    }
});

export default styles;
