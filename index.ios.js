import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { LoginButton, AccessToken } from 'react-native-fbsdk'
import { AWSCognitoCredentials } from 'aws-sdk-react-native-core'
import { AWSDynamoDB } from 'aws-sdk-react-native-dynamodb'
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-picker'
import { RNS3 } from 'react-native-aws3';
import { getPageID, getPageAccessToken, pagePost } from './lib/FacebookAPI'
import { EventCreationCalendar } from './lib/Calendar'
import { PostImage } from './lib/PostImage'

var region = "us-east-1";
var identity_pool_id = "us-east-1:073b8647-2b1d-444b-99d9-30a8696b2274";
var logins;
var dateFormat = require('dateformat');

async function getCredAndID() {
  if (logins==null) {
    console.log('Unable to retrieve credentials since no logins data is provided...');
    AWSCognitoCredentials.clearCredentials();
    this.setState({
      identityId: null
    });
    return;
  }

  try {
    var credentialsObj = await AWSCognitoCredentials.getCredentialsAsync();
    console.log(credentialsObj);
    var identityIdObj = await AWSCognitoCredentials.getIdentityIDAsync();
    console.log('IDENTITY ID:', identityIdObj.identityId);
    this.setState({
      AccessKey: credentialsObj.AccessKey,
      SecretKey: credentialsObj.SecretKey,
      identityId: identityIdObj.identityId
    });
  }
  catch(err) {
    console.log("ERROR while getting credentials:", err);
  }
}

async function uploadPhoto() {
  // if (this.state.imageData==null) {
  //   console.log('Empty image');
  //   return;
  // }
  // console.log('data:image/jpeg;base64,' + this.state.imageData.uri);

  console.log(this.state.postImage.uri);
  console.log(this.state.AccessKey);
  console.log(this.state.SecretKey);

  let file = {
    // `uri` can also be a file system path (i.e. file://)
    uri: this.state.postImage.uri,
    name: "image.jpeg",
    type: "image/jpeg"
  }

  let options = {
    bucket: "teamb-photos",
    region: "us-east-1",
    accessKey: "AKIAJQIOU7GJXFIBMVXQ",
    secretKey: "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",
    successActionStatus: 201
  }

  RNS3.put(file, options).then(response => {
    console.log(response);
    if (response.status !== 201) throw new Error("Failed to upload image to S3");
  });

}

export default class teamB extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showCalendar: false,
      facebookToggle: true,
      instagramToggle: true,
      twitterToggle: false,
      postTime: 'smart',
      green: '#97e1d0',
      black: '#000000',
      selectedDate: 'Today',
    }
    this.onLoginInvoked.bind(this);
    this.submitPost.bind(this);

    AWSCognitoCredentials.initWithOptions({"region": region, "identity_pool_id": identity_pool_id});
    AWSCognitoCredentials.clearCredentials();

    AWSDynamoDB.initWithOptions({"region": region});

    AWSCognitoCredentials.getLogins = function(){
      if (logins==null) return "";
      console.log('Logins', logins);
      return logins;
    };

    var that = this;
    AccessToken.getCurrentAccessToken()
    .then(function(fbTokenData) {
      if (fbTokenData==null) return;
      console.log('fbTokenData:', fbTokenData);
      logins = {};
      logins[AWSCognitoCredentials.RNC_FACEBOOK_PROVIDER] = fbTokenData.accessToken;
      console.log('here' +  logins[AWSCognitoCredentials.RNC_FACEBOOK_PROVIDER]);
      // AWSCognitoCredentials.setLogins(logins); //ignored for iOS
      getCredAndID.call(that);
    }, function(err) {
      console.log('Error getting token:', err);
    });
  }

  setAWSCognitoCredential(token){
    logins = {};
    logins[AWSCognitoCredentials.RNC_FACEBOOK_PROVIDER] = token;
    // AWSCognitoCredentials.setLogins(logins); //ignored for iOS
    getCredAndID.call(this);
  }

  onLoginInvoked(isLoggingIn, fbToken){
    console.log('isLoggingIn:', isLoggingIn);
    console.log('Accesstoken:', fbToken);

    if (isLoggingIn) {
      // Why can't i run "setAWSCognitoCredential(fbToken)" here?
      this.setAWSCognitoCredential(fbToken);
    }
    else {
      logins = null;
      getCredAndID.call(this);
    }
  }

  async submitPost() {
    if (logins==null || logins[AWSCognitoCredentials.RNC_FACEBOOK_PROVIDER]==null) {
      console.log('Logins not present');
      return;
    }

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
      var postText = (that.state.text!='') ? that.state.text : 'test_post';
      return pagePost(pageId, pageAccessToken, postText);
    })
    .catch(function(err) {
      console.log(err);
      that.setState({
        isLoading: false,
        message: 'Something bad happened ' + err
      });
    });
  }

  addImage() {

    var options = {
      title: 'Add a photo for your post',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // console.log('IMAGE DATA:')
        // console.log(response.data);
        let source = { uri: response.uri };

        // You can also display the image using data:
        let imageData = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          postImage: source,
          imageData: imageData
        });
      }
    });
  }

  openCalendar() {
    this.setState({
      showCalendar: true,
      postTime:'later'
    })
  }

  render() {
    let logo = {
      uri: 'https://scontent-ord1-1.xx.fbcdn.net/v/t34.0-12/17198497_10203158694926222_604100444_n.png?oh=51e9ca9e171b2b29397803c3d238c26a&oe=58C093B2'
    }

    var postPart = (() => {
      if (this.state.showCalendar) return (
        <EventCreationCalendar showCalendar={this.state.showCalendar}/>
      )
      else return (
        <View style={styles.postView}>
          {PostImage}
          <TextInput
            style={styles.postInput}
            placeholder="Your Text Here"
            multiline={true}
            onChangeText={(text) => this.setState({text})}/>
        </View>)
    })();

    return(
      <View style={styles.container}>
        <View style={styles.statusBar}>
        </View>
        <View style={styles.header}>
          <View style={styles.setWidth}></View>
          <Image source={logo} style={styles.logo}/>
          <TouchableOpacity
              onPress={this.submitPost.bind(this)}>
            <View
                style={styles.setWidth}>
              <Text
                  style={styles.postButton}>
                Post
              </Text>
            </View>
          </TouchableOpacity>
        </View>
          {postPart}
        <View
            style={styles.captionSection}>
          <Text
              style={(this.state.postTime == 'smart' || this.state.postTime == 'later') ? styles.captionTextActive : styles.captionText}>
            The best time to post is {this.state.selectedDate} at 6:13pm.
          </Text>
        </View>
        <View style={styles.timeViewSection}>
          <TouchableOpacity
              onPress={()=>{this.setState({postTime: 'now', showCalendar: false}); console.log(this.state.postTime == 'now')}}>
            <View
                style={(this.state.postTime == 'now') ? styles.timeViewActive : styles.timeView}>
              <Text
                  style={(this.state.postTime == 'now') ? styles.timeTextActive : styles.timeText}>
                Post Now
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={()=>{this.setState({postTime: 'smart', showCalendar: false, selectedDate: 'Today'}); console.log(this.state.postTime == 'now')}}>
            <View
                style={(this.state.postTime == 'smart') ? styles.timeViewActive : styles.timeView}>
              <Text
                  style={(this.state.postTime == 'smart') ? styles.timeTextActive : styles.timeText}>
                Smart Post
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={this.openCalendar.bind(this)}>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  statusBar: {
    height:20,
  },
  header: {
    height: 60,
    backgroundColor: '#97e1d0',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#A6A6A6',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    padding: 5,
  },
  logo: {
    height: 60,
    width: 200,
  },
  setWidth: {
    width: 60,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  postButton: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  postView: {
    backgroundColor: '#FDFDFD',
    flex: 3,
  },
  postInput: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 20,
  },
  headerText: {
    fontSize: 30,
  },
  captionSection: {
    alignItems: 'center',
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

AppRegistry.registerComponent('teamB', () => teamB);

// <LoginButton
//   publishPermissions={['manage_pages','publish_pages', 'publish_actions']}
//   onLoginFinished={
//     (error, result) => {
//       if (error) {
//         alert("login has error: " + result.error);
//       } else if (result.isCancelled) {
//         alert("login is cancelled.");
//       } else {
//         AccessToken.getCurrentAccessToken().then(
//           (data) => {
//             this.onLoginInvoked(true, data.accessToken.toString());
//           }
//         )
//       }
//     }
//   }
//   onLogoutFinished={() => this.onLoginInvoked(false, "")}
// />
// var fakeItem = {
//   id: { S: Date.now().toString() },
//   text: { S: this.state.text }
// };
// var params = {
//   TableName: 'testy',
//   Item: fakeItem
// };
// AWSDynamoDB.PutItem(params, function(err, data) {
//   if (err) console.log("Error:", err);
//   else console.log(data);
// });

