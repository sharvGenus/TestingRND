import React from 'react';
import { View, Image, Modal, Text } from 'react-native';
import styles from './style';
import logo from '../../assets/images/logo1.png';
import LottieView from 'lottie-react-native';
import { useSelector } from 'react-redux';

const Loader = () => {
    const { enabled, percentage, message } = useSelector((state) => state.isLoading);
    return (
        enabled && (
            <Modal visible={enabled} animationType="fade" transparent={true} onRequestClose={undefined}>
                <View style={styles.modalContainer}>
                    <View style={[styles.circleContainer]}>
                        <View style={styles.whiteSection}>
                            <View>
                                <Image style={styles.logo} source={logo} />
                            </View>
                            <View style={styles.animatedLoaderSection}>
                                <LottieView source={require('./genusLoader.json')} style={styles.lottie} autoPlay={true} loop={true} />
                            </View>
                            {!!percentage ? (
                                <Text style={styles.waitText}>
                                    {message || 'Downloading'} {percentage}%
                                </Text>
                            ) : (
                                <View style={styles.textSection}>
                                    <Text style={styles.waitText}>{'Please wait '}</Text>
                                    <Text style={styles.fetchingDetailText}>{`while we are fetching details`}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </Modal>
        )
    );
};

export default Loader;
