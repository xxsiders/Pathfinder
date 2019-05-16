import React from 'react';
import { View, Image } from 'react-native';
import { Container, List, ListItem, Left, Body, Right, Text, Content, Spinner } from 'native-base';
import Header from '../components/Header';
import Rating from 'react-native-rating'
import * as firebase from 'firebase';
require('firebase/firestore')

const images = {
  starFilled: require('../../assets/staron.png'),
  starUnfilled: require('../../assets/staroff.png')
}

export default class ViewHistory extends React.Component {

  state = {
    data: this.props.navigation.getParam('data'),
    info: {},
    loaded: false
  }

  componentDidMount() {
    return firebase.firestore().collection('order').doc(this.state.data.data.order).get().then(snap => {
      this.setState({ info: snap.data(), loaded: true })
    })
  }

  handleServiceTitle = (item) => {
    try {
      return item.services[0].name
    } catch (error) {
      return null
    }
  }

  handleRate=(rate)=>{
    return firebase.firestore().collection('order').doc(this.state.data.data.order).update({
      rate:rate
    })
  }
  render() {
    return (
      <Container>
        <Header title='History' />
        <ListItem thumbnail style={{ marginTop: 0, paddingTop: 30 }} >
          <Left>
            <Image style={{ borderRadius: 100, width: 45, height: 45 }} source={{ uri: this.state.data.provider.thumbnail }} />
          </Left>
          <Body style={{ borderBottomWidth: 0 }}>
            <Text style={{ fontSize: 18, fontWeight: '500' }}>{this.state.data.provider.name}</Text>
            <Text style={{ fontSize: 16, color: '#757575' }}>{this.handleServiceTitle(this.state.data.provider)}</Text>
          </Body>
          <Right style={{ borderBottomWidth: 0 }}>
            <Text note>{new Date(this.state.data.data.date.seconds * 1000).toLocaleDateString()}</Text>
            <Text note style={{ color: '#0A9E0A' }}>Finished</Text>
          </Right>
        </ListItem >
        {this.state.loaded ? <Content style={{ marginLeft: 20, marginRight: 20, marginTop: 5 }}>
          <Rating
            max={5}
            selectedStar={images.starFilled}
            unselectedStar={images.starUnfilled}
            onChange={rating => this.handleRate(rating)}
            initial={3}
            starStyle={{
              width: 24,
              height: 24,
              margin: 2.5,
            }}
          />
          <Text style={{ fontSize: 20, fontWeight: '500', color: '#9E9E9E', marginTop: 10 }}>Duration: <Text style={{ fontSize: 18, fontWeight: '400', color: '#9E9E9E', }}>{this.state.info.duration} hrs</Text></Text>
          <Text style={{ fontSize: 20, fontWeight: '500', color: '#9E9E9E', marginTop: 10 }}>Details: <Text style={{ fontSize: 18, fontWeight: '400', color: '#9E9E9E', }}>{this.state.info.details}</Text></Text>
          <Text style={{ fontSize: 20, fontWeight: '500', color: '#9E9E9E', marginTop: 10 }}>Payment method: <Text style={{ fontSize: 18, fontWeight: '400', color: '#9E9E9E', }}>{this.state.info.paymentMethod}</Text></Text>
          <Text style={{ fontSize: 20, fontWeight: '500', color: '#9E9E9E', marginTop: 10 }}>Location: <Text style={{ fontSize: 18, fontWeight: '400', color: '#9E9E9E', }}>{this.state.info.location}</Text></Text>
          <Text style={{ fontSize: 20, fontWeight: '500', color: '#9E9E9E', marginTop: 10 }}>Fees: <Text style={{ fontSize: 18, fontWeight: '400', color: '#9E9E9E', }}>{this.state.info.fees}$</Text></Text>
        </Content> : <Spinner color='tomato' />
        }
      </Container>
    )
  }
}