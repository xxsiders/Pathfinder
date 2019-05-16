import React from 'react';
import {
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  ActivityIndicator
} from 'react-native';

import {createStackNavigator,createSwitchNavigator} from 'react-navigation'
import Login from './Login';
import Home from './Home';
import Register from './Register';
import Welcome from './Welcome';

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="default" />
        <ActivityIndicator size={1} color='tomato' />
      </View>
    );
  }
}

// Implementation of HomeScreen, OtherScreen, SignInScreen, AuthLoadingScreen
// goes here.
const AppStack = createStackNavigator({ Home:Home },{headerMode:'none'});
const AuthStack = createStackNavigator({ Welcome:Welcome,SignIn: Login,Register:Register },{headerMode:'none'});


export default createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  