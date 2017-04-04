import React, { Component } from 'react';
import Calendar from 'react-native-calendar';
import {
  StyleSheet,
  View,
} from 'react-native';

class PostImage extends Component {
  render() {
    if (this.props.postImage==null) return (
      <Button title="Add a photo" onPress={this.addImage.bind(this)}/>
    )
    else return (
      <View>
        <Image source={this.props.postImage} style={styles.postImage}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  postImage: {
    height: 180,
    width: 370,
    margin: 3,
    borderRadius: 15
  },
});

export { PostImage }