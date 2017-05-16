import React, { Component } from 'react'
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, TextInput, Animated, TouchableHighlight, ActivityIndicator, ScrollView } from 'react-native'
import { Actions } from 'react-native-router-flux';
import PostClass from '../../lib/PostClass';
import Colors from '../../data/Colors'

export default class HomeNavBar extends Component {
  constructor(props) {
    super(props);
  }

  goToPages() {
    Actions.pages({type:'reset'});
  }



  render() {

    var analyticsStyle = (this.props.screen=='weekStatistics') ? styles.navBarItemActive : styles.navBarItem;
    var postsStyle = (this.props.screen=='postStatistics') ? styles.navBarItemActive : styles.navBarItem;
    var userStyle = (this.props.screen=='userSettings') ? styles.navBarItemActive : styles.navBarItem;

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.navBarItem} onPress={()=>this.goToPages()}>
          <Image
            style={styles.navBarIconHome}
            source={require('../../Icons/homeicon1.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={analyticsStyle} onPress={()=>this.props.switchScreens('weekStatistics')}>
          <Image
            style={styles.navBarIconAnalytics}
            source={require('../../Icons/analyticicon1.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={postsStyle} onPress={()=>this.props.switchScreens('postStatistics')}>
          <Image
            style={styles.navBarIconPosts}
            source={require('../../Icons/posticon1.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={userStyle} onPress={()=>this.props.switchScreens('userSettings')}>
          <Image
            style={styles.navBarIconUser}
            source={require('../../Icons/usericon1.png')}
          />
        </TouchableOpacity>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 110,
    backgroundColor: 'white',
    flexDirection: 'row',
    flexWrap: 'wrap',
    shadowOpacity: 0.3
  },
  navBarItem: {
    width: '25%',
  },
  navBarItemActive: {
    width: '25%',
    backgroundColor: Colors.lightBlue
  },
  navBarIconAnalytics: {
    width: 40,
    height: 35,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 15,
    marginBottom: 15,
  },
  navBarIconPosts: {
    width: 25,
    height: 35,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 15,
    marginBottom: 15,
  },
  navBarIconUser: {
    width: 37,
    height: 35,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 15,
    marginBottom: 15,
  },
  navBarIconHome: {
    width: 27,
    height: 35,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 15,
    marginBottom: 15,
  }
});
