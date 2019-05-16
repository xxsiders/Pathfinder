import React from 'react';
import { View, StatusBar } from 'react-native';
import { Text } from 'native-base';
import styles from './styles';
let statusheight = StatusBar.currentHeight
export default class Header extends React.Component {
    render() {
        return (
            <View style={styles.header}>
                <Text style={styles.headerText}>{this.props.title}</Text>
            </View>
        );
    }
}


