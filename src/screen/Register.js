import React from 'react';
import { View, KeyboardAvoidingView, TouchableOpacity, ScrollView, AsyncStorage } from 'react-native';
import { Input, Text, Content, Form } from 'native-base';
import styles from '../components/styles';
import Header from '../components/Header';
import * as firebase from 'firebase';

export default class Register extends React.Component {
    state = {
        name: '',
        email: '',
        password: '',
        phone: ''
    }

    handleRegister = async() => {
        const {email,password,name,phone} = this.state
        return firebase.auth().createUserWithEmailAndPassword(email,password).then(user=>{
            this.handleUserData(user.user.uid,email,name,phone)
        }).catch(err=>{
            alert(err)
        })
    }

    handleUserData=(uid,email,name,phone)=>{
        return firebase.firestore().collection('client').doc(uid).set({
            createDate:new Date(),
            email:email,
            name:name,
            phone:phone
        }).then(async()=>{
            await AsyncStorage.setItem('userToken', 'abc');
            this.props.navigation.navigate('App');    
        }).catch(err=>{
            alert(err)
        })
    }
    
    render() {
        return (
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <Header title='Register' />
                <ScrollView style={{ flex: 1 }}>
                    <Form style={{ marginTop: 75, alignItems: 'center' }}>
                        <Input style={styles.input} onChangeText={name => this.setState({ name })} value={this.state.name} placeholder='NAME' placeholderTextColor='silver' />
                        <Input style={styles.input} onChangeText={email => this.setState({ email })} value={this.state.email} placeholder='EMAIL' placeholderTextColor='silver' />
                        <Input style={styles.input} onChangeText={password => this.setState({ password })} value={this.state.password} placeholder='PASSWORD' secureTextEntry placeholderTextColor='silver' />
                        <Input style={styles.input} onChangeText={phone => this.setState({ phone })} value={this.state.phone} placeholder='PHONE' placeholderTextColor='silver' keyboardType='phone-pad' />
                        <TouchableOpacity style={styles.btn} onPress={this.handleRegister}>
                            <Text style={styles.btnText}>SIGN IN</Text>
                        </TouchableOpacity>
                    </Form>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}
