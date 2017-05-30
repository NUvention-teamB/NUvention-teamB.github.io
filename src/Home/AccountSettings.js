import React, { Component } from 'react'
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, TextInput, Animated, TouchableHighlight, ActivityIndicator, ScrollView, Switch} from 'react-native'
import Colors from '../../data/Colors'

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notifications: true,
    }
  }

  expand(type) {
    console.log(type);
    var updateObj = {}
    updateObj[type] = !this.state[type];
    this.setState(updateObj);
  }


  render() {
    var inviteFriends = (this.state.inviteFriends) ? (<Text style={styles.comingSoon}>Coming Soon...</Text>) : null;
    var aboutUs = (this.state.aboutUs) ? (<Text style={styles.comingSoon}>Coming Soon...</Text>) : null;
    var contactUs = (this.state.contactUs) ? (<Text style={styles.comingSoon}>Coming Soon...</Text>) : null;

    return (
      <View style={styles.container}>
        <View style={styles.textBar}>
          <Text style={styles.textBarText}>Account Settings</Text>
        </View>
        <View style={styles.iconRow}>
        <Text>
          <Image
            style={styles.fb}
            source={require('../../Icons/facebookicon.png')} />
            {'        '}
          <Image
            style={styles.instagram}
            source={require('../../Icons/instagramicon.png')} />
            {'        '}
          <Image
            style={styles.twitter}
            source={require('../../Icons/twittericon.png')} />
            {'        '}
        </Text>
        <View style={styles.lineOptions}>

        <View style={styles.lineItem} >
          <Text style={styles.lineItemText}>
            {'Notifications                    '}
            <Switch
            onValueChange={(value) => this.setState({notifications: value})}
            style={styles.switch}
            onTintColor={Colors.blue}
            value={this.state.notifications} />
          </Text>
        </View>

        <View style={styles.lineItem} >
          <Text onPress={()=>this.expand('inviteFriends')} style={styles.lineItemText}>
            {'Invite Friends                           '}
            <Text style={styles.expandButton}>{'>'}</Text>
          </Text>
          {inviteFriends}
        </View>
        <View style={styles.lineItem} >
          <Text onPress={()=>this.expand('aboutUs')} style={styles.lineItemText}>
            {'About Us                                    '}
            <Text style={styles.expandButton}>{'>'}</Text>
          </Text>
          {aboutUs}
        </View>
        <View style={styles.lineItem} >
          <Text onPress={()=>this.expand('contactUs')} style={styles.lineItemText}>
            {'Contact Us                                '}
            <Text style={styles.expandButton}>{'>'}</Text>
          </Text>
          {contactUs}
        </View>

        </View>

        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {

  },
  comingSoon: {
    textAlign: 'center',
    fontSize: 18,
    color: Colors.middleGray,
    paddingTop: 15,
    paddingBottom: 5,
  },
  lineOptions: {
    marginTop: 20,
    width: '100%',
  },
  lineItem: {
    width: '100%',
    borderTopWidth: 1,
    borderColor: Colors.middleGray,
    paddingTop: 15,
    paddingBottom: 15,
  },
  lineItemText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.blue,
    textAlign: 'center',
  },
  switch: {
    marginTop: 5,
  },
  expandButton: {
    fontWeight: '900',
  },
  textBar: {
    width: '100%',
    padding: 15,
    backgroundColor: Colors.lighterBlue
  },
  textBarText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
  },
  iconRow: {
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30,
  },
  fb: {
    width: 54,
    height: 51,
  },
  instagram: {
    width: 54,
    height: 51,
  },
  twitter: {
    width: 54,
    height: 51,
  },
});
