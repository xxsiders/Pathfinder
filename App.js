import React from 'react';
import AuthLoading from './src/screen/AuthLoading';
import  * as firebase  from 'firebase';

var config = {
  apiKey: "AIzaSyAyVgyY7Djr86siqA5y8kOl86bL0bENheU",
  authDomain: "pathfinder-bd467.firebaseapp.com",
  databaseURL: "https://pathfinder-bd467.firebaseio.com",
  projectId: "pathfinder-bd467",
  storageBucket: "pathfinder-bd467.appspot.com",
  messagingSenderId: "969955699963"
};
firebase.initializeApp(config);

export default class App extends React.Component {
  state={
    main:null
  }
  componentDidMount(){
    firebase.database().ref('root/main').once('value',snap=>{
      this.setState({main:snap})
    })
  }
  render() {
    return (
      <AuthLoading />
    );
  }
}
