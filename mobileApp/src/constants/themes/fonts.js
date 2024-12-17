import Metrics from './metrics';

const size = {
    font6: Metrics.screenWidth * (6 / 365),
    font8: Metrics.screenWidth * (8 / 365),
    font9: Metrics.screenWidth * (9 / 365),
    font10: Math.min(Metrics.screenWidth * (10 / 365), 20),
    font11: Math.min(Metrics.screenWidth * 0.029, 22),
    font12: Math.min(Metrics.screenWidth * (12 / 365), 24),
    font13: Math.min(Metrics.screenWidth * (13 / 365), 26),
    font14: Math.min(Metrics.screenWidth * (14 / 365), 28),
    font15: Math.min(Metrics.screenWidth * 0.04, 30),
    font16: Metrics.screenWidth * (16 / 365),
    font17: Metrics.screenWidth * 0.045,
    font18: Math.min(Metrics.screenWidth * (18 / 365), 36),
    font19: Metrics.screenWidth * 0.05,
    font20: Math.min(Metrics.screenWidth * (20 / 365), 40),
    font21: Metrics.screenWidth * 0.056,
    font23: Metrics.screenWidth * 0.061,
    font25: Math.min(Metrics.screenWidth * 0.053, 50),
    font27: Metrics.screenWidth * 0.072,
    font28: Metrics.screenWidth * (28 / 365),
    font30: Metrics.screenWidth * (30 / 365),
    font32: Metrics.screenWidth * 0.085,
    font42: Metrics.screenWidth * 0.112
};

const weight = {
    full: '900',
    semi: '600',
    low: '400',
    bold: 'bold',
    normal: 'normal'
};

const type = {
    publicSansBold: 'PublicSans-Bold',
    publicSansRegular: 'PublicSans-Regular',
    publicSansSemiBold: 'PublicSans-SemiBold',
    publicSansMedium: 'PublicSans-Medium',
    publicSansThin: 'PublicSans-Thin'
};

function getSize(size) {
    return Metrics.screenWidth * (size / 365);
}

export default {
    size,
    weight,
    type,
    getSize
};
