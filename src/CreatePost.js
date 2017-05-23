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
import { getIdIndex, generateSuggestionData } from '../lib/SuggestionsHelper'

export default class CreatePost extends Component {
  constructor(props) {
    super(props);

    this.updateSuggestion = this.updateSuggestion.bind(this);
    this.nextScreen = this.nextScreen.bind(this);
    this.skipTwo = this.skipTwo.bind(this);
    this.uploadPhoto = this.uploadPhoto.bind(this);
    this.updateText = this.updateText.bind(this);
    this.updateListData = this.updateListData.bind(this);
    this.updateTagSuggestion = this.updateTagSuggestion.bind(this);
    this.state = {
      index: 0,
      postImage: null,
      suggestionData: null,
      text: '',
      listData: listData,
      currentData: null,
    }
  }

  updateSuggestion(data) {
    // this.setState({suggestionData: data});
    this.updateListData(data);
  }

  updateText(text) {
    if (text != this.state.text) {
      this.setState({text: text});
    }
  }

  nextScreen() {
    this.refs.swiper.scrollBy(1);
  }

  skipTwo() {
    this.refs.swiper.scrollBy(2);
  }

  uploadPhoto(postImage) {
    this.setState({postImage: postImage});
  }

  updateImage(postImage) {
    this.setState({postImage: postImage});
  }

  updateListData(data) {
    if (data == null) {
      this.setState({suggestionData: null});
      return;
    }

    data.captionWithTags = generateSuggestionData(data);

    temp = this.state.listData;

    index = getIdIndex(this.state.listData, data.id);
    console.log(data.captionWithTags, index);
    if (index == null) {
      temp.concat(data);
      this.setState({listData:listData,suggestionData:data});
    } else {
      this.state.listData[index] = data;
      this.setState({listData:listData,suggestionData:data});
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.id != null) {
      this.updateTagSuggestion(newProps.id, newProps.tagIndex, newProps.option);
      newProps.id = null;
      newProps.tagIndex = null;
      newProps.option = null;
    }
  }

  updateTagSuggestion(id, tagIndex, suggestion) {
    index = getIdIndex(this.state.listData, id);
    this.state.listData[index].tags[tagIndex].suggestion = suggestion;
    this.updateListData(this.state.listData[index]);
    console.log(this.state.listData[index]);
    console.log(this.state.suggestionData);
  }

  render() {
    return (
      <View>
        <Swiper ref='swiper' loop={false} showPagination={false}>
          <Photo
            nextScreen={()=>{this.nextScreen()}}
            postImage={this.state.postImage}
            // uploadPhoto={(postImage)=>this.uploadPhoto(postImage)}>
            updateImage={(postImage)=>this.updateImage(postImage)}>
          </Photo>
          <Suggestions
            nextScreen={()=>{this.nextScreen()}}
            skipTwo={()=>{this.skipTwo()}}
            postImage={this.state.postImage}
            updateSuggestion={(data)=>this.updateSuggestion(data)}>
          </Suggestions>
          <Caption
            nextScreen={()=>{this.nextScreen()}}
            postImage={this.state.postImage}
            data={this.state.suggestionData}
            updateText={(text)=>{this.updateText(text)}}
            updateTagSuggestion={this.updateTagSuggestion}>
          </Caption>
          <Post
            postImage={this.state.postImage}
            data={this.state.suggestionData}
            text={this.state.text}>
          </Post>
        </Swiper>
      </View>
    )
  }
}
