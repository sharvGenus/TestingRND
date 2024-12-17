import { StyleSheet } from 'react-native';
import { fonts, ratioHeight } from '../../../constants/themes';
import COLORS from '../../../constants/color';

const styles = StyleSheet.create({
    field: {
        marginTop: 10
    },
    searchView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputField: {
        height: 50,
        borderBottomWidth: 0.5,
        padding: 10,
        borderRadius: 2,
        fontFamily: 'publicSansRegular',
        width: '90%',
        marginVertical: 10,
        marginHorizontal: 20,
        borderColor: 'rgb(118, 118, 118)'
    },
    iconStyle: {
        alignItems: 'flex-end',
        right: 60
    },
    centeredView: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        flex: 1
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f0f0f0',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: '100%'
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: '100%'
    },
    snoText: {
        fontWeight: fonts.weight.bold,
        textAlign: 'center'
    },
    valueText: {
        flex: 1,
        textAlign: 'center'
    },
    text: {
        width: '100%',
        textAlign: 'center',
        fontSize: 24
    },
    mainContainer: {
        height: 'auto',
        alignItems: 'center',
        justifyContent: 'center'
    },
    closeSearchModel: {
        alignSelf: 'flex-end',
        justifyContent: 'center',
        backgroundColor: 'gray'
    },
    mainContainerNodata: {
        width: '100%',
        height: 'auto',
        alignItems: 'center',
        justifyContent: 'center'
    },
    tableView: {
        borderWidth: 2,
        borderColor: '#c8e1ff'
    },
    modalContainer: {
        flex: 1,
        // padding: 5,
        width: '100%',
        height: 'auto'
    }
});
export default styles;
