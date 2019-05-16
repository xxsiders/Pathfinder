import React from 'react';
import { StyleSheet, View, Linking, TouchableOpacity, Image } from 'react-native';
import { MapView, Marker } from 'expo'
import Modal from "react-native-modal";
import * as firebase from 'firebase';
import Rating from 'react-native-rating'
import { Container, Text, Item, Left, Thumbnail, Picker, Body, ListItem, Row, Col, Fab, Spinner } from 'native-base';
import mapStyle from '../components/mapStyle.json'


const images = {
  starFilled: require('../../assets/staron.png'),
  starUnfilled: require('../../assets/staroff.png')
}
export default class Map extends React.Component {
  state = {
    location: {
      latitude: this.props.navigation.getParam('coordinate').latitude,
      longitude: this.props.navigation.getParam('coordinate').longitude,
      latitudeDelta: 0.015, longitudeDelta: 0.0121,
    },
    paymentType: null,
    isVisible: false,
    isPayment: false,
    picker: false,
    isLoading: false,
    data: this.props.navigation.getParam('data'),
    providers: this.props.navigation.getParam('providers'),
    currentProvider: {},
    currentProviderId: '',
    currentProviderPrice: 0
  }
  handleServiceTitle = (item) => {
    try {
      return item.services[0].name
    } catch (error) {
      return null
    }
  }

  handleSubmit = () => {
    const { data, paymentType, currentProviderId,currentProviderPrice } = this.state
    const uid = firebase.auth().currentUser.uid
    this.setState({ isLoading: true })
    return firebase.firestore().collection('order').add({
      duration: data.duration,
      details: data.details,
      time: data.time,
      location: data.location,
      paymentMethod: paymentType,
      fees: data.duration * currentProviderPrice,
      rate: 3
    }).then(order => {
      firebase.firestore().collection('request').add({
        client: uid,
        provider: currentProviderId,
        date: new Date(),
        state: 'Waiting',
        order: order.id
      })
    }).then(() => {
      return this.props.navigation.navigate('Home')
    })
  }

  myRandoComponent = () => (
    <Rating
      max={5}
      selectedStar={images.starFilled}
      unselectedStar={images.starUnfilled}
      editable={false}
      initial={4}
      starStyle={{
        width: 24,
        height: 24,
        margin: 2.5,
      }}
    />
  )

  renderModal = () => {
    const item = this.state.currentProvider
    return <Modal
      useNativeDriver={true}
      backdropOpacity={0.5}
      animationIn='fadeIn'
      isVisible={this.state.isVisible}
      onBackdropPress={() => this.setState({ isVisible: false })}>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ height: 330, width: 300, alignSelf: 'center', backgroundColor: '#FFCDD2', borderRadius: 10, elevation: 2 }}>
          <TouchableOpacity style={{ position: 'absolute', top: 10, right: 10, zIndex: 5, elevation: 3 }}
            onPress={() => this.setState({ isVisible: false })}
          >
            <Image source={require('../../assets/icons/cancel.png')} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>
          <ListItem thumbnail style={{ marginTop: 0, paddingTop: 0 }}>
            <Left>
              <Image style={{ borderRadius: 100, width: 50, height: 50 }} source={{ uri: item.thumbnail }} />
            </Left>
            <Body style={{ borderBottomWidth: 0 }}>
              <Text style={{ fontSize: 20, fontWeight: '600' }}>{item.name}</Text>
              <Text style={{ fontSize: 16, color: '#757575' }}>{this.handleServiceTitle(item)}</Text>
            </Body>
          </ListItem >
          <Row style={{ marginLeft: 20, marginRight: 20 }}>
            <Col>
              {this.myRandoComponent()}
            </Col>
            <Col>
              <Text style={{ color: '#757575', alignSelf: 'flex-end', fontSize: 16, fontWeight: '600', marginTop: 5 }}>{this.state.currentProviderPrice}$/hr</Text>
            </Col>
          </Row>
          <Text style={{ textAlign: 'left', width: 240, alignSelf: 'center', fontSize: 15, color: '#757575' }} numberOfLines={6}>{item.bio}</Text>

          <Row style={{ marginTop: 20, alignSelf: 'flex-end', marginRight: 10 }}>
            <TouchableOpacity style={{ elevation: 2 }} onPress={() => this.handleSubmit()}>
              <Image source={require('../../assets/icons/submit.png')} style={{ width: 56, height: 56 }} />
            </TouchableOpacity>
            <TouchableOpacity style={{ elevation: 2 }} onPress={() => this.setState({ isPayment: true })}>
              <Image source={require('../../assets/icons/payment.png')} style={{ width: 56, height: 56 }} />
            </TouchableOpacity>
            <TouchableOpacity style={{ elevation: 2 }} onPress={() => this.handleCall('012544445')} >
              <Image source={require('../../assets/icons/call.png')} style={{ width: 56, height: 56 }} />
            </TouchableOpacity>
          </Row>
        </View>
        {this.renderPayment()}
      </View>
    </Modal>
  }
  renderPayment = () => {
    return <Modal isVisible={this.state.isPayment} onBackdropPress={() => this.setState({ isPayment: false })}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

        <View style={{ width: 300, height: 300, backgroundColor: '#E4E4E4', borderRadius: 10, alignSelf: 'center', justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 40 }}>

          <Text style={{ fontSize: 23, fontWeight: 'bold', color: '#757575', marginBottom: 10, marginLeft: -5 }}>Payment method:</Text>

          <TouchableOpacity style={{ width: '80%' }} onPress={() => this.handlePaymentMethod('Visa')}>
            <Text style={{ fontSize: 23, color: '#757575' }}>Visa</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ width: '80%' }} onPress={() => this.handlePaymentMethod('Cash')}>
            <Text style={{ fontSize: 23, color: '#757575' }}>Cash</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ width: '80%' }} onPress={() => this.handlePaymentMethod('Fawry')}>
            <Text style={{ fontSize: 23, color: '#757575' }}>Fawry</Text>
          </TouchableOpacity>

        </View>

      </View>

    </Modal>

  }
  handleCall(phone) {
    Linking.openURL(`tel:${phone}`)
  }
  handlePaymentMethod = (payment) => {
    return this.setState({ paymentType: payment, isPayment: false })
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
      <Container >
        <View style={{ flex: 1, width: '100%', height: '100%', position: 'absolute', zIndex: 1 }}>

          <MapView style={{ flex: 1, width: '100%', height: '100%' }}
            region={this.state.location}
            customMapStyle={mapStyle}
            >

            {this.state.providers.length != 0 ? this.state.providers.map((item, i) => {
              return <MapView.Marker key={i} coordinate={{ latitude: item.data.location._lat, longitude: item.data.location._long }} onPress={() => {
                this.setState({ isVisible: true, currentProvider: item.data, currentProviderId: item.id,currentProviderPrice:item.price })
              }
              }>
                <Image style={{ borderRadius: 100, width: 30, height: 30 }} tracksViewChanges={false} source={{ uri: item.data.thumbnail }} />

              </MapView.Marker>

            }) : null}
              <MapView.Marker coordinate={{ latitude: this.state.location.latitude, longitude: this.state.location.longitude }}/>
          </MapView>

        </View>
        {this.renderModal()}
        {this.loadModal()}
      </Container >
    );
  }
}
