import { Text, View, Image, ScrollView } from 'react-native';
import React from 'react';
import MultiSeriesBarChart from './BarChart';
import styles from './style';

const data = [
    { title: '01/05', total: 50, rejected: 6 },
    { title: '02/05', total: 60, rejected: 7 },
    { title: '03/05', total: 56, rejected: 6 },
    { title: '04/05', total: 76, rejected: 9 },
    { title: '05/05', total: 56, rejected: 5 },
    { title: '06/05', total: 76, rejected: 5 },
    { title: '07/05', total: 87, rejected: 5 }
];
const DashboardScreen = () => {
    return (
        <>
            <View style={styles.container}>
                <ScrollView>
                    <View>
                        <Text style={styles.dashboardText}>DashBoard</Text>
                    </View>
                    <View style={styles.flexDirectionRow}>
                        <View style={styles.grayBorder}></View>
                        <Text style={styles.productivity}>Today's Productivity</Text>
                    </View>
                    <View style={styles.imageContext}>
                        <View style={styles.lovelace}>
                            <Image
                                src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                                style={styles.image}
                            />
                            <Text style={[styles.valueText, styles.paddingSet]}>Ada Lovelace</Text>
                        </View>
                        <Text style={styles.valueText}>10</Text>
                    </View>
                    <View style={styles.imageContext}>
                        <View style={styles.lovelace}>
                            <Image
                                src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                                style={styles.image}
                            />
                            <Text style={[styles.valueText, styles.paddingSet]}>Mark Hopper</Text>
                        </View>
                        <Text style={styles.valueText}>12</Text>
                    </View>
                    <View style={styles.imageContext}>
                        <View style={styles.lovelace}>
                            <Image
                                src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                                style={styles.image}
                            />
                            <Text style={[styles.valueText, styles.paddingSet]}>Margaret Hamilton</Text>
                        </View>
                        <Text style={styles.valueText}>15</Text>
                    </View>

                    <View style={styles.flexDirectionRow}>
                        <View style={styles.grayBorder}></View>
                        <Text style={[styles.productivity, { color: '#fff', height: 1 }]}>Productivity </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', marginTop: 10 }}>
                        <Text style={styles.addTeamText}>Add Team </Text>
                    </View>

                    <View style={styles.imageContext}></View>
                    <View style={styles.flexDirectionRow}>
                        <View style={styles.grayBorder}></View>
                        <Text style={styles.productivity}>Productivity </Text>
                    </View>

                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 20 }}>
                            <Text style={styles.currentWeek}>Current Week</Text>
                            <Text style={styles.valueText}>Last Week</Text>
                        </View>
                        <MultiSeriesBarChart data={data} />
                    </View>
                    <View style={styles.flexRow}>
                        <View style={styles.grayBorder}></View>
                        <Text style={[styles.productivity, { color: '#fff', height: 1 }]}>Productivity </Text>
                    </View>
                </ScrollView>
            </View>
        </>
    );
};

export default DashboardScreen;
