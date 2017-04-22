import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet, Button, Image, CameraRoll } from 'react-native'
import { Actions } from 'react-native-router-flux';
import ImagePicker from 'react-native-image-picker'
import Photo from './Photo'
import Suggestions from './Suggestions'
import Caption from './Caption'
import Swiper from 'react-native-swiper'

export default class CreatePost extends Component {
  constructor(props) {
    super(props);

    this.updateSuggestion = this.updateSuggestion.bind(this);
    this.nextScreen = this.nextScreen.bind(this);
    this.state = {
      index:0
    }
  }

  updateSuggestion(data) {
    this.setState({suggestionData: data});
  }

  nextScreen() {
    this.refs.swiper.scrollBy(1);
  }

  render() {
    return (
      <Swiper ref='swiper' loop={false} yourNewPageIndex={this.state.index}>
        <Photo nextScreen={()=>{this.nextScreen()}}></Photo>
        <Suggestions></Suggestions>
        <Caption data={this.state.suggestionData}></Caption>
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