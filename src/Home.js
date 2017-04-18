import React, { Component } from 'react'
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, TextInput } from 'react-native'
import { PostImage } from '../lib/PostImage'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import PostClass from '../lib/PostClass';
import ImmutableListView from 'react-native-immutable-list-view';
import { getPageID, getPageAccessToken } from '../lib/FacebookAPI'
import { getListOfPosts } from '../lib/FbPostsAPI'
import { AWSCognitoCredentials } from 'aws-sdk-react-native-core'


export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  componentDidMount() {
    getListOfPosts(globalPageId, globalPageAccessToken)
    .then(function(json) {
      console.log(json);
    })
    .catch(function(err) {
      console.error(err);
    })
  }

  newPost() {
    var post = new PostClass();
    Actions.photo({post: post});
  }

  render() {

    return (
      <View style={styles.container}>
        <Text>This is a placeholder</Text>
        <Button
          title="Create a new post>"
          onPress={this.newPost}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100
  },
});
