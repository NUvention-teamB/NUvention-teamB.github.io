import React, { Component } from 'react'
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, TextInput } from 'react-native'
import { PostImage } from '../lib/PostImage'
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  render() {
    let logo = {
      uri: 'https://scontent-ord1-1.xx.fbcdn.net/v/t34.0-12/17198497_10203158694926222_604100444_n.png?oh=51e9ca9e171b2b29397803c3d238c26a&oe=58C093B2'
    }

    var postPart = (() => {
      if (this.state.showCalendar) return (
        <EventCreationCalendar showCalendar={this.state.showCalendar}/>
      )
      else return (
        <View style={styles.postView}>
          {PostImage}
          <TextInput
            style={styles.postInput}
            placeholder="Your Text Here"
            multiline={true}
            onChangeText={(text) => this.setState({text})}/>
        </View>)
    })();

    return (
      <View style={styles.container}>
        <View style={styles.statusBar}>
        </View>
        <View style={styles.header}>
          <View style={styles.setWidth}></View>
          <Image source={logo} style={styles.logo}/>
          <TouchableOpacity
              onPress={this.submitPost.bind(this)}>
            <View
                style={styles.setWidth}>
              <Text
                  style={styles.postButton}>
                Post
              </Text>
            </View>
          </TouchableOpacity>
        </View>
          {postPart}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  statusBar: {
    height:20,
  },
  header: {
    height: 60,
    backgroundColor: '#97e1d0',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#A6A6A6',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    padding: 5,
  },
  logo: {
    height: 60,
    width: 200,
  },
  setWidth: {
    width: 60,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  postButton: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  postView: {
    backgroundColor: '#FDFDFD',
    flex: 3,
  },
  headerText: {
    fontSize: 30,
  },
  captionSection: {
    alignItems: 'center',
  },
  captionTextActive: {
    color: '#ADADAD',
  },
  captionText: {
    color: '#FFFFFF',
  },
});
