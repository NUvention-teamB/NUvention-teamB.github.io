import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity, Image, ScrollView, Clipboard, DatePickerIOS } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import { AWSCognitoCredentials } from 'aws-sdk-react-native-core';
import { getPageID, getPageAccessToken, pagePost } from '../lib/FacebookAPI';
import { EventCreationCalendar } from '../lib/Calendar';
import Calendar from 'react-native-calendar';
import Colors from '../data/Colors';
import Hr from 'react-native-hr';
import { uploadPhoto } from '../lib/PostHelper'


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
    }
    this.postNow = this.postNow.bind(this);
    this.smartPost = this.smartPost.bind(this);
    this.openCalendar = this.openCalendar.bind(this);
    this.paste = this.paste.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
  }

  goToNext() {
    Actions.home();
  }

  async submitPost() {

    var pageId, pageAccessToken;

    var that = this;
    console.log('Submitting post');
    var fbLoginToken = logins[AWSCognitoCredentials.RNC_FACEBOOK_PROVIDER];
    var link = null;
    uploadPhoto(this.props.postImage).then(function(name){
      link = name
      return getPageID(fbLoginToken);
    })
    .then(function(mPageid) {
      pageId = mPageid;
      console.log('2pageId' + pageId);
      return getPageAccessToken(pageId, fbLoginToken);
    })
    .then(function(mPageAccessToken) {
      // var json = JSON.parse(response);
      pageAccessToken = mPageAccessToken;
      console.log('pageAccessToken:',pageAccessToken);
      var postText = that.state.text;
      console.log('POST TEXT:', postText);
      if (that.props.postTime == 'now') {
        return pagePost(pageId, pageAccessToken, postText, link);
      } else {
        return pagePost(pageId, pageAccessToken, postText, link, that.props.dateTime);
      }
    })
    .then(function() {
      Actions.home({type:'reset'});
    })
    .catch(function(err) {
      console.log(err);
      that.setState({
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
    var postImage = (() => {
      if (this.props.postImage!=null) return (
        <Image source={this.props.postImage} style={styles.postImage}/>
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
            />
            {postImage}
            {datePicker}
            
          </ScrollView>
        </View>
        <View
            style={styles.captionSection}>
          <Text
              style={(this.state.postTime == 'smart' || this.state.postTime == 'later') ? styles.captionTextActive : styles.captionText}>
            The best time to post is {this.state.date.getMonth()}/{this.state.date.getDate()} at {this.state.date.getHours()}:{this.state.date.getMinutes()}.
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
                style={styles.socialMediaToggles}
                borderColor={this.state.facebookToggle ? this.state.active : this.state.dormant}>
              <Icon
                  color={this.state.facebookToggle ? this.state.active : this.state.dormant}
                  size={ 30 }
                  name="facebook"/>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={()=>{this.setState({instagramToggle: !this.state.instagramToggle});}}>
            <View
                style={styles.socialMediaToggles}
                borderColor={this.state.instagramToggle ? this.state.active : this.state.dormant}>
              <Icon
                  color={this.state.instagramToggle ? this.state.active : this.state.dormant}
                  size={ 30 }
                  name="instagram"/>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={()=>{this.setState({twitterToggle: !this.state.twitterToggle});}}>
            <View
                style={styles.socialMediaToggles}
                borderColor={this.state.twitterToggle ? this.state.active : this.state.dormant}>
              <Icon
                  color={this.state.twitterToggle ? this.state.active : this.state.dormant}
                  size={ 30 }
                  name="twitter"/>
            </View>
          </TouchableOpacity>
        </View>

        <Button
          title="Queue  "
          onPress={this.submitPost.bind(this)}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    flex: 1,
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
    backgroundColor: '#EEEEEE'
  },
  postImage: {
    height: 180,
    width: '100%',
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
    padding: 10
  },
  timeViewActive: {
    padding: 10,
    backgroundColor: Colors.lightBlue
  },
  timeTextActive: {
    color: 'white',
  },
  socialView: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  socialMediaToggles: {
    padding: 10,
    width: 50,
    margin: 10,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: 'center',
  },
});
