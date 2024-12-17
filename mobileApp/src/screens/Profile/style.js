import { StyleSheet, Dimensions } from 'react-native';
import { fonts, ratioHeight } from '../../constants/themes';
import COLORS from '../../constants/color';

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    imageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 1,
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: '30%'
    },
    userLogo: {
        width: 50,
        height: 60,
        alignSelf: 'center'
    },
    uploadIcon: {
        alignItems: 'center',
        bottom: 25,
        left: 35
    },
    inputField: {
        height: 50,
        padding: 10,
        fontFamily: fonts.type.publicSansRegular,
        width: '90%',
        marginVertical: 10,
        marginHorizontal: 20,
        borderColor: 'rgb(118,118,118)',
        borderBottomWidth: 1
    },
    heading: {
        fontSize: fonts.size.font14,
        fontWeight: fonts.weight.bold,
        color: COLORS.black,
        marginTop: 10 * ratioHeight,
        marginLeft: 20
    }
});

export default styles;
