import { Platform } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import COLORS from '../../constants/color';

export default (message, type) => {
    return showMessage({
        position: 'top',
        message: message,
        titleStyle: { fontFamily: 'Lato-Regular' },
        icon: type === 1 ? 'success' : 'danger',
        autoHide: 2000,
        duration: 2000,
        style:
            Platform.OS === 'ios'
                ? {
                      marginTop: hp('10%'),
                      borderRadius: 10,
                      marginHorizontal: hp('2%'),
                      paddingTop: hp('-3%'),
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                  }
                : { marginTop: hp('5%'), borderRadius: 10, marginHorizontal: hp('2%') },
        textStyle: { fontFamily: 'Lato-Regular' },
        type: type === 1 ? 'success' : type === 2 ? 'warning' : 'danger',
        backgroundColor: type === 1 ? COLORS.light_green : type === 2 ? COLORS.orange : COLORS['dark-red'],
        color: '#ffffff'
    });
};
