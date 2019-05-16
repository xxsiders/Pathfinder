import React from 'react';
import { AsyncStorage, KeyboardAvoidingView, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Input, Text, Content, Form } from 'native-base';
import styles from '../components/styles';
import Header from '../components/Header';
import * as firebase from 'firebase';

export default class Login extends React.Component {
    state = {
        email: '',
        password: ''
    }
    handlSignIn = async () => {
        const { email, password } = this.state
        firebase.auth().signInWithEmailAndPassword(email, password).then(async(user) => {
            await AsyncStorage.setItem('userToken', 'abc');
            this.props.navigation.navigate('App');
        }).catch(err => {
            this.setState({ password: '' })
            alert(err)
        })
    }
    handleRegister = () => {
        this.props.navigation.navigate('Register');
    }
    render() {
        return (
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <Header title='Login' />
                <ScrollView style={{ flex: 1 }}>
                    <Form style={{ marginTop: 150, alignItems: 'center' }}>
                        <Input style={styles.input} keyboardType='email-address' onChangeText={email => this.setState({ email })} value={this.state.email} placeholder='EMAIL' placeholderTextColor='silver' />
                        <Input style={styles.input} onChangeText={password => this.setState({ password })} value={this.state.password} placeholder='PASSWORD' secureTextEntry placeholderTextColor='silver' />
                        <TouchableOpacity style={styles.btn} onPress={this.handlSignIn}>
                            <Text style={styles.btnText}>SIGN IN</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginTop: 15 }} onPress={this.handleRegister}>
                            <Text style={{ color: '#757575', fontSize: 16 }}>Don't have account?
                                <Text style={{ textDecorationLine: 'underline', color: '#757575', fontSize: 16, fontWeight: '500' }}> register</Text>
                            </Text>
                        </TouchableOpacity>
                    </Form>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}
