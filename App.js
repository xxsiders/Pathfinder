import React from 'react';
import AuthLoading from './src/screen/AuthLoading';
import  * as firebase  from 'firebase';

var config = {/* your api here */}
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
