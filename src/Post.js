import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import { AWSCognitoCredentials } from 'aws-sdk-react-native-core';
import { getPageID, getPageAccessToken, pagePost } from '../lib/FacebookAPI';
import { EventCreationCalendar } from '../lib/Calendar';
import Calendar from 'react-native-calendar';
import Colors from '../data/Colors';
import Hr from 'react-native-hr';


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
      postTime: 'smart',
      green: '#97e1d0',
      black: '#000000',
      selectedDate: 'Today',
      height: 0,
    }
    this.postNow = this.postNow.bind(this);
    this.smartPost = this.smartPost.bind(this);
    this.openCalendar = this.openCalendar.bind(this);
    this.updateSelectedDate = this.updateSelectedDate.bind(this);
  }

  goToNext() {
    Actions.home();
  }

  async submitPost() {

    var pageId, pageAccessToken;

    var that = this;
    console.log('Submitting post');
    var fbLoginToken = logins[AWSCognitoCredentials.RNC_FACEBOOK_PROVIDER];
    getPageID(fbLoginToken)
    .then(function(mPageid) {
      pageId = mPageid;
      console.log('2pageId' + pageId);
      return getPageAccessToken(pageId, fbLoginToken);
    })
    .then(function(mPageAccessToken) {
      // var json = JSON.parse(response);
      pageAccessToken = mPageAccessToken;
      console.log('pageAccessToken:',pageAccessToken);
      var postText = (that.props.post.caption!=null) ? that.props.post.caption : 'test_post';
      console.log('POST TEXT:', postText);
      if (that.props.postTime == 'now') {
        return pagePost(pageId, pageAccessToken, postText);
      } else {
        return pagePost(pageId, pageAccessToken, postText, that.props.dateTime);
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
    Actions.pop();
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
      selectedDate: 'Today'
    });
  }

  openCalendar() {
    this.setState({
      showCalendar: true,
      postTime:'later'
    })
  }

  updateSelectedDate(date) {
    this.setState({
      selectedDate: date,
      showCalendar: false,
    });
    console.log('date' + date);
  }

  render() {
    var text = (() => {
      if (this.props.data != null) return (
        this.props.data.captionWithTags)
    })();

    var postImage = (() => {
      if (this.props.postImage!=null) return (
        <Image source={this.props.postImage} style={styles.postImage}/>
      )
    })();

    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>Finalize your message</Text>
        </View>
        <Hr lineColor={Colors.gray} />
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
              defaultValue={text}
              value={this.state.text}
            />
            {postImage}
            <EventCreationCalendar 
              showCalendar={this.state.showCalendar}
              updatedSelectedDate={(date) => {this.updateSelectedDate(date)}} />
          </ScrollView>
        </View>
        <View
            style={styles.captionSection}>
          <Text
              style={(this.state.postTime == 'smart' || this.state.postTime == 'later') ? styles.captionTextActive : styles.captionText}>
            The best time to post is {this.state.selectedDate} at 6:13pm.
          </Text>
        </View>
        <View style={styles.timeViewSection}>
          <TouchableOpacity
              onPress={this.postNow}>
            <View
                style={(this.state.postTime == 'now') ? styles.timeViewActive : styles.timeView}>
              <Text
                  style={(this.state.postTime == 'now') ? styles.timeTextActive : styles.timeText}>
                Post Now
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={this.smartPost}>
            <View
                style={(this.state.postTime == 'smart') ? styles.timeViewActive : styles.timeView}>
              <Text
                  style={(this.state.postTime == 'smart') ? styles.timeTextActive : styles.timeText}>
                Smart Post
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={this.openCalendar}>
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
                borderColor={this.state.facebookToggle ? this.state.green : this.state.black}>
              <Icon
                  color={this.state.facebookToggle ? this.state.green : this.state.black}
                  size={ 30 }
                  name="facebook"/>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={()=>{this.setState({instagramToggle: !this.state.instagramToggle});}}>
            <View
                style={styles.socialMediaToggles}
                borderColor={this.state.instagramToggle ? this.state.green : this.state.black}>
              <Icon
                  color={this.state.instagramToggle ? this.state.green : this.state.black}
                  size={ 30 }
                  name="instagram"/>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={()=>{this.setState({twitterToggle: !this.state.twitterToggle});}}>
            <View
                style={styles.socialMediaToggles}
                borderColor={this.state.twitterToggle ? this.state.green : this.state.black}>
              <Icon
                  color={this.state.twitterToggle ? this.state.green : this.state.black}
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
    color: Colors.darkGreen,
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
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  timeView: {
    borderWidth: 1,
    width: 100,
    padding: 10,
    borderRadius: 10,
  },
  timeViewActive: {
    borderWidth: 1,
    width: 100,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#97e1d0'
  },
  timeTextActive: {
    color: '#FFFFFF'
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
