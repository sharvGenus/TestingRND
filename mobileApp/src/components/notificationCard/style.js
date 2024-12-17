import { StyleSheet } from 'react-native';
import COLORS from '../../constants/color';
import { fonts } from '../../constants/themes';

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    scrollContent: {
        padding: 10
    },
    aptitudeSection: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        color: COLORS.solid_black,
        fontSize: fonts.size.font15,
        fontFamily: fonts.type.publicSansRegular,
        fontWeight: fonts.weight.bold,
        marginBottom: 3
    },
    timeline: {
        color: COLORS.dark_grey,
        fontSize: fonts.size.font12,
        fontFamily: fonts.type.publicSansRegular,
        fontWeight: fonts.weight.bold
    },
    container: {
        borderColor: COLORS.light_grey,
        borderWidth: 1,
        paddingVertical: 20,
        paddingHorizontal: 10
    },
    handtButton: {
        borderWidth: 1,
        borderColor: COLORS.themeColor,
        marginRight: 5
    },
    locationText: {
        color: COLORS.themeColor,
        padding: 9,
        fontWeight: fonts.weight.bold
    },
    startButtonView: {
        alignItems: 'flex-end',
        paddingHorizontal: 5
    },
    infoIconTitleView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    modalView: {
        width: '80%'
    },
    subModalView: {
        borderRadius: 10,
        backgroundColor: COLORS.white,
        padding: 20
    },
    keyValueContainer: {
        marginVertical: 10
    },
    ticketNoShow: {
        fontWeight: fonts.weight.bold,
        fontSize: fonts.size.font15,
        marginBottom: 8,
        color: COLORS.themeColor
    },
    closeModal: {
        alignItems: 'center',
        marginRight: 5
    },
    closeModalText: {
        backgroundColor: COLORS.red,
        fontWeight: fonts.weight.semi,
        padding: 10,
        color: COLORS.white
    },
    startModalText: {
        backgroundColor: COLORS.blue,
        fontWeight: fonts.weight.semi,
        padding: 10,
        color: COLORS.white,
        textTransform: 'uppercase'
    },
    finishModalText: {
        backgroundColor: COLORS.green,
        fontWeight: fonts.weight.semi,
        padding: 10,
        color: COLORS.white
    },
    holdModalText: {
        backgroundColor: COLORS.purplishGrey,
        fontWeight: fonts.weight.semi,
        padding: 10,
        color: COLORS.white
    },
    infoIconView: {
        marginLeft: 5
    },
    categoryWiseIcon: {
        width: 35,
        height: 35
    },
    modalActionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginTop: 15
    },
    iconView: {
        marginRight: 5
    },
    insideModalView: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    remarkField: {
        borderWidth: 0.5,
        marginTop: 10,
        paddingLeft: 10,
        borderColor: COLORS.grey
    },
    keyBoardAvoidingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.light_transparent
    },
    detailsButtonView: {
        display: 'flex',
        flexDirection: 'row',
        marginVertical: 5
    },
    detailsKey: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: fonts.size.font14
    },
    detailsValue: {
        flex: 1,
        fontSize: fonts.size.font14
    },
    error: {
        color: COLORS.red,
        marginTop: 5
    }
});

export default styles;
