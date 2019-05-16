import React from 'react';
import { Image, AsyncStorage } from 'react-native';
import { Input, Text, Content, Form, Container, List, ListItem, Left, Body, Right, Spinner } from 'native-base';
import styles from '../components/styles';
import Header from '../components/Header';
import { createStackNavigator } from 'react-navigation';
import ViewHistory from './ViewHistory';
import * as firebase from 'firebase';
require('firebase/firestore')

class History extends React.Component {
    state = {
        data: [],
        loaded: false
    }

    async componentDidMount() {
        const uid = firebase.auth().currentUser.uid
        firebase.firestore().collection('request').where('client', '==', uid).onSnapshot(snap => {
            const items = []
            snap.forEach(data => {
                firebase.firestore().collection('provider').doc(data.data().provider).get().then(prov => {
                    items.push({ key: data.id, data: data.data(), provider: prov.data() })
                    this.setState({ data: items })
                })
            })
            this.setState({ loaded: true })
        })
    }

    handleView = (item) => {
        if (item.data.state == 'Finished') {
            return this.props.navigation.navigate('ViewHistory', {
                data: item
            })
        }
    }

    _signOutAsync = async () => {
        firebase.auth().signOut()
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
    }

    handleServiceTitle=(item)=>{
        try {
            return item.services[0].name
        } catch (error) {
            return null
        } 
    }

    render() {
        return (
            <Container style={{ flex: 1 }}>
                <Header title='History' />

                <Text style={{ alignSelf: 'flex-end', margin: 10, padding: 5, }} onPress={() => this._signOutAsync()}>Logout</Text>

                {this.state.loaded ? <Content style={{ paddingTop: 10, paddingBottom: 10 }} scrollEnabled>
                    {this.state.data.map(item => {
                        return <ListItem key={item.key} thumbnail style={{ marginTop: 0, paddingTop: 0 }} onPress={() => this.handleView(item)}>
                            <Left>
                                <Image style={{ borderRadius: 100, width: 45, height: 45 }} source={{ uri: item.provider.thumbnail }} />
                            </Left>
                            <Body style={{ borderBottomWidth: 0 }}>
                                <Text style={{ fontSize: 18, fontWeight: '500', textTransform: 'capitalize' }}>{item.provider.name}</Text>
                                <Text style={{ fontSize: 16, color: '#757575' }}>{this.handleServiceTitle(item.provider)}</Text>
                            </Body>
                            <Right style={{ borderBottomWidth: 0 }}>
                                <Text note>{new Date(item.data.date.seconds * 1000).toLocaleDateString()}</Text>
                                <Text note style={{ color: item.data.state == 'Finished' ? '#0A9E0A' : item.data.state == 'Refused' ? 'red' :'#FFB900', textTransform: 'capitalize' }}>{item.data.state}</Text>
                            </Right>
                        </ListItem >
                    })}
                </Content> : <Spinner color='tomato' />
                }

            </Container>
        );
    }
}
const Navigator = createStackNavigator({
    History: History,
    ViewHistory: ViewHistory
}, {
        headerMode: 'none'
    })

export default Navigator