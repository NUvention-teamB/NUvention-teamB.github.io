import React, { Component } from 'react'
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, TextInput } from 'react-native'
import { PostImage } from '../lib/PostImage'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import PostClass from '../lib/PostClass';
import { getPageID, getPageAccessToken } from '../lib/FacebookAPI'
import { getListOfPosts, getPostLikeCount, getTotalLikesCount } from '../lib/FbPostsAPI'
import { AWSCognitoCredentials } from 'aws-sdk-react-native-core'

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  componentDidMount() {
    getListOfPosts(globalPageId, globalPageAccessToken)
    .then(function(statistics) {
      console.log(statistics);

    })
    .catch(function(err) {
      console.log(err);
    })
  }

  newPost() {
    var post = new PostClass();
    Actions.createPost({post: post});
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
