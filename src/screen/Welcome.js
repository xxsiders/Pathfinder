import React from 'react';
import { StyleSheet, View,Image,TouchableOpacity } from 'react-native';

export default class Welcome extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={()=>this.props.navigation.navigate('SignIn')}>
            <Image source={require('../../assets/logo.png')} style={{height:250,width:250}}/>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D32F2F',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
