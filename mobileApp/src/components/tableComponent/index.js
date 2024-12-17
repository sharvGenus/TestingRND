import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';

export default function TableComponent(props) {
    const [state, setState] = useState({
        tableHead: ['Head', 'Head2', 'Head3', 'Head4'],
        tableData: [
            ['1', '2', '3', '4'],
            ['a', 'b', 'c', 'd'],
            ['1', '2', '3', '456\n789'],
            ['a', 'b', 'c', 'd']
        ]
    });

    return (
        <View style={styles.container}>
            <Table borderStyle={{ borderWidth: 2, borderColor: '#0163AF' }}>
                <Row data={state.tableHead} style={styles.head} textStyle={{ margin: 6 }} />
                <Rows data={state.tableData} textStyle={{ margin: 6 }} />
            </Table>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: { minHeight: 40, margin: 'auto', backgroundColor: '#0F6FAF', color: 'fff', fontWeight: '500' },
    text: { margin: 6 }
});
