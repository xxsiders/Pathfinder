import React from 'react';
import { View, KeyboardAvoidingView, TouchableOpacity, ScrollView } from 'react-native';
import { Input, Text, Content, Form, Picker, Item, DatePicker, Spinner } from 'native-base';
import styles from '../components/styles';
import Header from '../components/Header';
import History from './History'
import Ionicons from '@expo/vector-icons/Ionicons'
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation'
import Map from './Map';
import { GeoFire } from 'geofire';
import * as firebase from 'firebase'
import Modal from "react-native-modal";

class Home extends React.Component {
    state = {
        duration: '',
        details: '',
        time: '',
        location: '',
        nearby: [],
        providers: [],
        isLoading: false,
        coordinate: {}
    }
    async componentDidMount() {
        await navigator.geolocation.getCurrentPosition(pos => {
            this.setState({ coordinate: { latitude: pos.coords.latitude, longitude: pos.coords.longitude } })
        })
    }

    handleNearby = () => {
        this.setState({ isLoading: true })
        var coordinate = this.state.coordinate
        var firebaseRef = firebase.database().ref('provider');
        var geoFire = new GeoFire(firebaseRef);
        var geoQuery = geoFire.query({
            center: [coordinate.latitude, coordinate.longitude],
            radius: 100
        })
        let nearby = []
        geoQuery.on("key_entered", (key, location, distance) => {
            nearby.push({ key: key, distance: (distance * 1000).toFixed(1), location: location })
        })
        geoQuery.on('ready', () => {
            if (nearby.length != 0) {

                this.requestData(nearby)
            } else {

                alert('No nearby providers!...')
                this.setState({ isLoading: false })
            }
        })
    }

    requestData = async (providers) => {
        const db = firebase.firestore().collection('provider')
        let refs = []
        providers.map(item => {
            refs.push(db.doc(item.key).get())
        })
        let data = Promise.all(refs)
        data.then(res => {
            let data = []
            res.map(snap => {
                let result = snap.data().services.filter(o => o.name.includes(this.state.details.length==0?'empty':this.state.details));
                if (result.length != 0) {
                    data.push({ data: snap.data(), id: snap.id,price:result[0].ph })
                } else {
                    alert('no provider found')
                }
            }
            )
            this._handleFind(data)
        })
    }

    _handleFind = async (providers) => {
        const { duration, details, time, location,coordinate } = this.state
        const data = {
            duration: duration,
            details: details,
            time: time,
            location: location
        }
        this.setState({
            duration: '',
            details: '',
            time: '',
            location: '',
            isLoading: false
        })
        this.props.navigation.navigate('Map', {
            data: data,
            providers: providers,
            coordinate:coordinate
        });
    }

    loadModal = () => {
        return <Modal isVisible={this.state.isLoading}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Spinner color='tomato' />
            </View>
        </Modal>
    }

    render() {
        return (
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <Header title='Home' />
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <Form style={{ marginTop: 50, alignItems: 'center' }}>
                        <Input style={styles.input} value={this.state.details} onChangeText={details => this.setState({ details })} placeholder='Details' placeholderTextColor='silver' />
                        <Input style={styles.input} value={this.state.duration} onChangeText={duration => this.setState({ duration })} placeholder='Duaration' placeholderTextColor='silver' />
                        <View style={[styles.input, { paddingLeft: 10 }]}>
                            <DatePicker
                                defaultDate={new Date(2018, 4, 4)}
                                minimumDate={new Date(2018, 1, 1)}
                                maximumDate={new Date(2018, 12, 31)}
                                locale={"en"}
                                timeZoneOffsetInMinutes={undefined}
                                modalTransparent={false}
                                animationType={"fade"}
                                androidMode={"default"}
                                placeHolderText="Select date"
                                textStyle={{ color: '#707070', fontSize: 20, fontWeight: '500' }}
                                placeHolderTextStyle={{ color: "silver", fontSize: 20, fontWeight: '500' }}
                                onDateChange={date => this.setState({ time: date })}
                                disabled={false}
                            />
                        </View>
                        <Input style={styles.input} value={this.state.location} onChangeText={location => this.setState({ location })} placeholder='Location' placeholderTextColor='silver' />
                        <TouchableOpacity style={styles.btn} onPress={this.handleNearby}>
                            <Text style={styles.btnText}>FIND</Text>
                        </TouchableOpacity>
                    </Form>
                </ScrollView>
                {this.loadModal()}
            </KeyboardAvoidingView>
        );
    }
}

const Tabs = createBottomTabNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            tabBarIcon: ({ focused, tintColor }) => {
                const iconName = `ios-search`;
                return <Ionicons name={iconName} size={25} color={tintColor} />;
            },
        },
    },
    History: {
        screen: History,
        navigationOptions: {
            tabBarIcon: ({ focused, tintColor }) => {
                const iconName = `ios-timer`;
                return <Ionicons name={iconName} size={22} color={tintColor} />;
            },
        },
    }
}, {
        tabBarOptions: {
            activeTintColor: 'tomato',
            style: {
                height: 60,
                paddingBottom: 10,
                paddingTop: 10,
                borderTopWidth: 0,
                elevation: 10,
            },
            labelStyle: {
                fontSize: 14,
                fontWeight: '600'
            }
        }
    })

const StackNav = createStackNavigator({
    Tabs: Tabs,
    Map: Map
}, {
        initialRouteName: 'Tabs',
        headerMode: 'none'
    })
export default StackNav