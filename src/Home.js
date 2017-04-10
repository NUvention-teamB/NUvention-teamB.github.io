import React, { Component } from 'react'
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, TextInput } from 'react-native'
import { PostImage } from '../lib/PostImage'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  newPost() {
    Actions.caption();
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
