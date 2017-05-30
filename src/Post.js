import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity, ScrollView, Clipboard, DatePickerIOS, ActivityIndicator, Image, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import { AWSCognitoCredentials } from 'aws-sdk-react-native-core';
import { getPageID, getPageAccessToken, pagePost, scheduledPagePost } from '../lib/FacebookAPI';
import { EventCreationCalendar } from '../lib/Calendar';
import { getFullDate } from '../lib/TimeHelper';
import Calendar from 'react-native-calendar';
import Colors from '../data/Colors';
import Hr from 'react-native-hr';
import { uploadPhoto } from '../lib/PostHelper';
import CreatePostNavBar from './CreatePostNavBar';
import PostClass from '../lib/PostClass';


export default class Post extends Component {
  constructor(props) {
    super(props);
    console.log('POST in Post:', this.props.post);

    this.submitPost.bind(this);

    this.state = {
      showCalendar: false,
      facebookToggle: true,
      instagramToggle: true,
      twitterToggle: false,
      postTime: 'now',
      active: Colors.blue,
      dormant: '#000000',
      height: 0,
      date: new Date(),
      success: false,
    }
    this.postNow = this.postNow.bind(this);
    this.smartPost = this.smartPost.bind(this);
    this.openCalendar = this.openCalendar.bind(this);
    this.paste = this.paste.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.submitPost = this.submitPost.bind(this);
  }

  goToNext() {
    Actions.home();
  }

  async submitPost() {
    //
    // var pageId, pageAccessToken;
    //
    // var that = this;
    // console.log('Submitting post');
    // var fbLoginToken = logins[AWSCognitoCredentials.RNC_FACEBOOK_PROVIDER];
    // var link = null;
    // uploadPhoto(this.props.postImage).then(function(name){
    //   link = name
    //   return getPageID(fbLoginToken);
    // })
    // .then(function(mPageid) {
    //   pageId = mPageid;
    //   console.log('2pageId' + pageId);
    //   return getPageAccessToken(pageId, fbLoginToken);
    // })
    // .then(function(mPageAccessToken) {
    //   // var json = JSON.parse(response);
    //   pageAccessToken = mPageAccessToken;
    //   console.log('pageAccessToken:',pageAccessToken);
    //   var postText = that.state.text;
    //   console.log('POST TEXT:', postText);
    //   if (that.props.postTime == 'now') {
    //     return pagePost(pageId, pageAccessToken, postText, link);
    //   } else {
    //     return pagePost(pageId, pageAccessToken, postText, link, that.props.dateTime);
    //   }
    // })

    var postText = this.state.text;
    var postImage = this.props.postImage;
    var postTime = this.state.postTime;
    var date = this.state.date;

    var _this = this;
    this.setState({
      isLoading: true,
    });

    uploadPhoto(postImage)
    .then(function(link){
      if (postTime != 'now') {
        return scheduledPagePost(globalPageId, globalPageAccessToken, postText, link, date);
      }
      return pagePost(globalPageId, globalPageAccessToken, postText, link);
    })
    .then(function() {
      _this.setState({
        isLoading: false,
        success: true
      });
      Actions.success({type:'reset'});
    })
    .catch(function(err) {
      console.log(err);
      _this.setState({
        isLoading: false,
        message: 'Something bad happened ' + err
      });
    });
  }

  postNow() {
    this.setState({
      postTime: 'now',
      showCalendar: false,
    });
  }

  smartPost() {
    this.setState({
      postTime: 'smart',
      showCalendar: false,
      date: new Date()
    });
  }

  openCalendar() {
    this.setState({
      showCalendar: true,
      postTime:'later'
    })
  }

  onDateChange(date){
    this.setState({date: date});
  }

  paste = async () => {
    try {
      var content = await Clipboard.getString();
      this.setState({text: content});
    } catch (e) {
      this.setState({content:e.message});
    }
  };

  render() {
    console.log(this.state);
    if (this.state.isLoading) return (
      <View>
        <ActivityIndicator
          animating={this.state.isLoading}
          style={[styles.centering, {height: 100}]}
          size="large"
          color="darkblue"
        />
      </View>
    )

    var text = null;
    if (this.state.postTime == 'now') {
      text = 'Your post is posting on Facebook now.';
    } else {
      text = 'Your post is schedule to post on Facebook at' + getFullDate(this.state.date);
    }

    var postImage = (() => {
      if (this.props.postImage!=null) return (
        <View
          style={styles.postImageView}>
          <Image source={this.props.postImage} style={styles.postImage}/>
        </View>
      )
    })();

    var datePicker = (() => {
      if (this.state.showCalendar) {
        return(
          <DatePickerIOS
            date={this.state.date}
            mode="datetime"
            timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
            onDateChange={this.onDateChange}
          />
        )
      }
    })();

    return (
      <View style={styles.container}>
        <CreatePostNavBar></CreatePostNavBar>
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>Finalize your message</Text>
        </View>
        <TouchableOpacity
          style={styles.pasteTouch}
          onPress={this.paste}>
          <Text
            style={styles.pasteText}>
            Paste
          </Text>
        </TouchableOpacity>
        <View style={styles.scrollView}>
          <ScrollView>
            <TextInput
              multiline={true}
              onChange={(event) => {
                this.setState({
                  text: event.nativeEvent.text,
                  height: event.nativeEvent.contentSize.height,
                });
              }}
              style={[styles.textInput, {height: Math.max(105, this.state.height)}]}
              value={this.state.text}
              placeholder='Input text here'
            />
            {postImage}
            {datePicker}

          </ScrollView>
        </View>
        <View
            style={styles.captionSection}>
          <Text
              style={(this.state.postTime == 'smart' || this.state.postTime == 'later') ? styles.captionTextActive : styles.captionText}>
            Post time is {getFullDate(this.state.date)}.
          </Text>
        </View>
        <View style={styles.timeViewSection}>
          <TouchableOpacity
              onPress={this.postNow}
              style={styles.postTimeTouch}>
            <View
                style={(this.state.postTime == 'now') ? styles.timeViewActive : styles.timeView}>
              <Text
                  style={(this.state.postTime == 'now') ? styles.timeTextActive : styles.timeText}>
                Post Now
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={this.openCalendar}
              style={styles.postTimeTouch}>
            <View
                style={(this.state.postTime == 'later') ? styles.timeViewActive : styles.timeView}>
              <Text
                  style={(this.state.postTime == 'later') ? styles.timeTextActive : styles.timeText}>
                Post Later
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.socialView}>
          <TouchableOpacity
              onPress={()=>{this.setState({facebookToggle: !this.state.facebookToggle});}}>
            <View
                style={this.state.facebookToggle ? styles.socialMediaActive : styles.socialMediaDormant}>
              <Icon
                  color={this.state.facebookToggle ? 'black' : Colors.gray}
                  size={ 30 }
                  name="facebook"/>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={()=>{this.setState({instagramToggle: !this.state.instagramToggle});}}>
            <View
                style={this.state.instagramToggle ? styles.socialMediaActive : styles.socialMediaDormant}>
              <Icon
                  color={this.state.instagramToggle ? 'black' : Colors.gray}
                  size={ 30 }
                  name="instagram"/>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={()=>{this.setState({twitterToggle: !this.state.twitterToggle});}}>
            <View
                style={this.state.twitterToggle ? styles.socialMediaActive : styles.socialMediaDormant}>
              <Icon
                  color={this.state.twitterToggle ? 'black' : Colors.gray}
                  size={ 30 }
                  name="twitter"/>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableHighlight onPress={this.submitPost} underlayColor={Colors.blue}>
          <View style={styles.queueButton}>
            <Text style={styles.queueButtonText}>Queue</Text>
          </View>
        </TouchableHighlight>
        <View style={styles.progressBar}>
          <View style={styles.progress}></View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centering: {
    marginTop: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  headerRow: {
    flexDirection: 'row',
    margin: 10,
  },
  headerText: {
    fontSize: 20,
    color: Colors.blue,
  },
  pasteTouch: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  pasteText: {
    fontSize: 15,
    marginTop: 5,
    marginBottom: 5,
  },
  scrollView: {
    flex: 1,
  },
  textInput: {
    fontSize: 15,
    backgroundColor: '#EEEEEE',
    paddingLeft: 10,
    paddingRight: 10,
  },
  postImageView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  postImage: {
    height: 150,
    flex: 1,
    margin: 5,
    borderRadius: 10,
  },
  captionSection: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  captionTextActive: {
    color: '#ADADAD',
  },
  captionText: {
    color: '#FFFFFF',
  },
  timeViewSection: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.gray,
    marginTop: 10,
    marginBottom: 10,
  },
  postTimeTouch: {
    width: '50%'
  },
  timeView: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  timeViewActive: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.lightBlue,
  },
  timeTextActive: {
    color: 'black',
  },
  socialView: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialMediaActive: {
    padding: 10,
    backgroundColor: Colors.lightBlue,
    width: 50,
    margin: 10,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: 'center',
  },
  socialMediaDormant: {
    padding: 10,
    width: 50,
    margin: 10,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: 'center',
    borderColor: Colors.gray
  },
  queueButton: {
    backgroundColor: Colors.blue,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
    marginBottom: 20,
    width: 100,
    padding: 15,
    borderRadius: 20,
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowColor: 'darkblue',
    shadowOffset: {
      top: 1
    },
  },
  queueButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
  progressBar: {
    marginTop: 'auto',
    height: 5,
    flexDirection: 'row',
  },
  progress: {
    width: '100%',
    backgroundColor: Colors.blue,
  },
});
