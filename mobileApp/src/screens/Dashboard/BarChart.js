import React from 'react';
import { View } from 'react-native';
import { VictoryBar, VictoryChart, VictoryGroup, VictoryLegend } from 'victory-native';
const MultiSeriesBarChart = ({ data }) => {
    return (
        <View>
            <VictoryChart>
                <VictoryLegend
                    x={10}
                    y={10}
                    orientation="horizontal"
                    gutter={20}
                    data={[
                        { name: 'Total', symbol: { fill: '#cccccc', type: 'square' } },
                        { name: 'Rejected', symbol: { fill: '#f1e2cc', type: 'square' } }
                    ]}
                />
                <VictoryGroup offset={15}>
                    <VictoryBar data={data} barWidth={15} x="title" y="total" style={{ data: { fill: '#cccccc' } }} />
                    <VictoryBar data={data} barWidth={15} x="title" y="rejected" style={{ data: { fill: '#f1e2cc' } }} />
                </VictoryGroup>
            </VictoryChart>
        </View>
    );
};

export default MultiSeriesBarChart;
