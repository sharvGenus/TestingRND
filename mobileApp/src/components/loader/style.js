import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import COLORS from '../../constants/color';

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: COLORS.transparent,
        flex: 1,
        alignItems: 'center'
    },
    whiteSection: {
        backgroundColor: 'white',
        padding: hp('1.5%'),
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    circleContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    lottie: {
        width: hp('22%'),
        height: hp('10%')
    },
    logo: {
        height: hp('7.3%'),
        width: hp('20%')
    },
    animatedLoaderSection: {},
    textSection: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    waitText: {
        fontSize: hp('1.8%'),
        color: COLORS.buttonColor
    },
    fetchingDetailText: {
        fontSize: hp('1.6%'),
        color: COLORS.buttonColor
    }
});
export default styles;
