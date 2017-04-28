import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet, Button, Image, CameraRoll } from 'react-native'
import { Actions } from 'react-native-router-flux';
import ImagePicker from 'react-native-image-picker'
import Photo from './Photo'
import Suggestions from './Suggestions'
import Caption from './Caption'
import Post from './Post'
import Swiper from 'react-native-swiper'
import listData from '../data/SuggestionsText';

export default class CreatePost extends Component {
  constructor(props) {
    super(props);

    this.updateSuggestion = this.updateSuggestion.bind(this);
    this.nextScreen = this.nextScreen.bind(this);
    this.uploadPhoto = this.uploadPhoto.bind(this);
    this.updateText = this.updateText.bind(this);
    this.updateListData = this.updateListData.bind(this);
    this.state = {
      index: 0,
      postImage: null,
      suggestionData: null,
      text: '',
      listData: listData,
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

  updateListData() {
    output = data.caption;
    console.log('output' + output);
    for (i = data.tags.length - 1 ; i >= 0 ; i--) {
      position = data.tags[i].position;
      console.log(i + data.tags[i].replacement);
      if (data.tags[i].replacement != undefined) {
        output = [output.slice(0, position), data.tags[i].replacement, output.slice(position)].join('');
      } else {
        output = [output.slice(0, position), '[' + data.tags[i].name + ']', output.slice(position)].join('');
      }
    }
    data.captionWithTags = output;
    temp = this.state.listData;
    for (i = 0 ; i < temp.length ; i++) {
      if (temp[i].id == data.id) {
        temp[i] = data;
        this.updateState(listData);
        return;
      }
    }
    if (data.id == null) {
      temp.concat(data);
      this.updateState(listData)
    }
  }

  render() {
    return (
      <Swiper ref='swiper' loop={false} showsPagination={false}>
        <Photo 
          nextScreen={()=>{this.nextScreen()}} 
          postImage={this.state.postImage} 
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