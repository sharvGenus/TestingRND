import { StyleSheet } from 'react-native';
import { fonts } from '../../constants/themes';

const styles = StyleSheet.create({
    container: {
        marginLeft: 10,
        marginRight: 10,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        flex: 1,
        marginTop: 20
    },
    addTeamText: {
        fontFamily: fonts.type.publicSansSemiBold,
        fontSize: 16,
        color: '#000'
    },
    paddingSet: {
        paddingLeft: 20,
        paddingRight: 50
    },
    currentWeek: {
        fontFamily: fonts.type.publicSansMedium,
        fontSize: 14,
        color: '#000'
    },
    valueText: {
        fontFamily: fonts.type.publicSansMedium,
        fontSize: 14
    },
    flexRow: {
        flexDirection: 'row'
    },
    lovelace: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    grayBorder: {
        borderBottomWidth: 1,
        borderColor: 'gray',
        flex: 1
    },
    flexDirectionRow: {
        flexDirection: 'row',
        marginTop: 30
    },
    dashboardText: {
        color: 'black',
        fontSize: 20,
        marginTop: 10,
        marginBottom: 10,
        fontFamily: fonts.type.publicSansSemiBold
    },
    productivity: {
        textAlign: 'right',
        fontFamily: fonts.type.publicSansSemiBold,
        color: '#000',
        borderBottomWidth: 3,
        paddingLeft: 5,
        fontSize: 16
    },
    image: {
        width: 40, // Adjust the width of the image
        height: 40, // Adjust the height of the image
        borderRadius: 100,
        marginLeft: 10
    },
    imageContext: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 15,
        marginRight: 50
    }
});

export default styles;
