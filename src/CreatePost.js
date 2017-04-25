import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet, Button, Image, CameraRoll } from 'react-native'
import { Actions } from 'react-native-router-flux';
import ImagePicker from 'react-native-image-picker'
import Photo from './Photo'
import Suggestions from './Suggestions'
import Caption from './Caption'
import Post from './Post'
import Swiper from 'react-native-swiper'

export default class CreatePost extends Component {
  constructor(props) {
    super(props);

    this.updateSuggestion = this.updateSuggestion.bind(this);
    this.nextScreen = this.nextScreen.bind(this);
    this.uploadPhoto = this.uploadPhoto.bind(this);
    this.updateText = this.updateText.bind(this);
    this.state = {
      index: 0,
      postImage: null,
      suggestionData: null,
      text: '',
    }
  }

  updateSuggestion(data) {
    this.setState({suggestionData: data});
  }

  updateText(text) {
    if (text != this.state.text) {
      this.setState({text: text});
    }
  }

  nextScreen() {
    this.refs.swiper.scrollBy(1);
  }

  uploadPhoto(postImage) {
    this.setState({postImage: postImage});
  }

  render() {
    return (
      <Swiper ref='swiper' loop={false} yourNewPageIndex={this.state.index}>
        <Photo 
          nextScreen={()=>{this.nextScreen()}} 
          uploadPhoto={(postImage)=>this.uploadPhoto(postImage)}>
        </Photo>
        <Suggestions 
          nextScreen={()=>{this.nextScreen()}} 
          postImage={this.state.postImage} 
          updateSuggestion={(data)=>this.updateSuggestion(data)}>
        </Suggestions>
        <Caption 
          nextScreen={()=>{this.nextScreen()}} 
          postImage={this.state.postImage} 
          data={this.state.suggestionData} 
          updateText={(text)=>{this.updateText(text)}}>
        </Caption>
        <Post 
          postImage={this.state.postImage}
          text={this.state.text}>
        </Post>
      </Swiper>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100
  },
  postImage: {
    height: 180,
    width: 370,
    margin: 3,
    borderRadius: 15
  }
});