import React, { Component } from 'react'
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, TextInput, Animated, TouchableHighlight, ActivityIndicator, ScrollView } from 'react-native'
import { Actions } from 'react-native-router-flux';
import PostClass from '../../lib/PostClass';
import Colors from '../../data/Colors'

export default class HomeNavBar extends Component {
  constructor(props) {
    super(props);
  }

  newPost() {
    var post = new PostClass();
    Actions.createPost({post: post});
  }

  render() {

    var analyticsStyle = (this.props.screen=='weekStatistics') ? styles.navBarItemActive : styles.navBarItem;
    var postsStyle = (this.props.screen=='postStatistics') ? styles.navBarItemActive : styles.navBarItem;

    var text = (() => {
      if (this.props.screen=='weekStatistics') return ('Your Statistics for '+globalPage.name);
      else return ('Post History');
    })();

    return (
      <View style={styles.container}>
        <TouchableOpacity style={analyticsStyle} onPress={()=>this.props.switchScreens('weekStatistics')}>
          <Image
            style={styles.navBarIconAnalytics}
            source={require('../../Icons/analyticsicon2.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={postsStyle} onPress={()=>this.props.switchScreens('postStatistics')}>
          <Image
            style={styles.navBarIconPosts}
            source={require('../../Icons/posticon2.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBarItem} onPress={this.newPost}>
          <Image
            style={styles.navBarIconNewPost}
            source={require('../../Icons/newPostIcon.png')}
          />
        </TouchableOpacity>
        <View style={styles.textBar}>
          <Text style={styles.textBarText}>{text}</Text>
        </View>

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
  },
  navBarItem: {
    width: '33%',
  },
  navBarItemActive: {
    width: '33%',
    backgroundColor: Colors.lightBlue
  },
  navBarIconAnalytics: {
    width: 38,
    height: 30,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 15,
    marginBottom: 15,
  },
  navBarIconPosts: {
    width: 25,
    height: 30,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 15,
    marginBottom: 15,
  },
  navBarIconNewPost: {
    width: 75,
    height: 35,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 15,
    marginBottom: 15,
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
  }
});
