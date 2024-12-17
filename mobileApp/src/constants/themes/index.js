import fonts from './fonts';
import metrics from './metrics';

var heightRef = 627;
var widthRef = 360;

const ratioHeight = metrics.screenHeight / heightRef;
const ratioWidth = metrics.screenWidth / widthRef;

export { metrics, fonts, heightRef, widthRef, ratioHeight, ratioWidth };
