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
import { getPageID, getPageAccessToken, pagePost } from './lib/facebookAPI'

var region = "us-east-1";
var identity_pool_id = "us-east-1:073b8647-2b1d-444b-99d9-30a8696b2274";
var logins;
var ReactDOM = require('react-dom');

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
    var identityIdObj = await AWSCognitoCredentials.getIdentityIDAsync();
    console.log('IDENTITY ID:', identityIdObj.identityId);
    this.setState({
      identityId: identityIdObj.identityId
    });
  }
  catch(err) {
    console.log("ERROR while getting credentials:", err);
  }
}

export default class teamB extends Component {

  constructor(props) {
    super(props);
    this.state = {
      facebookToggle: true,
      instagramToggle: true,
      twitterToggle: false,
      postTime: 'smart',
      green: '#97e1d0',
      black: '#000000',
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
      getCredAndID.call(this);
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

  toggle() {

  }

  render() {
    let profilePicture = {
      uri: 'https://scontent.ford1-1.fna.fbcdn.net/v/t34.0-12/17028649_10203143574948232_433377245_n.png?oh=3eeef03751e683e3ac1a81ee8ddb444d&oe=58BFAE51'
    }
    let logo = {
      uri: 'https://scontent.ford1-1.fna.fbcdn.net/v/t34.0-12/17141621_10203157166048001_1715642970_n.png?oh=c4e43cdcc948d5786c499f37780af7ef&oe=58BEBABB'
    }


    return(
      <View style={testStyles.container}>
        <View style={testStyles.statusBar}>
        </View>
        <View style={testStyles.header}>
          <Image source={logo} style={testStyles.logo}/>
        </View>
        <View style={testStyles.postView}>
          <View style={testStyles.row}>
            <Image source={profilePicture} style={testStyles.profilePicture}/>
          </View>
          <TextInput
            style={testStyles.postInput}
            placeholder={this.state.identityId}
            multiline={true}
            onChangeText={(text) => this.setState({text})}/>
        </View>
        <View style={testStyles.timeViewSection}>
          <TouchableOpacity
              onPress={()=>{this.setState({postTime: 'now'}); console.log(this.state.postTime == 'now')}}>
            <View
                style={(this.state.postTime == 'now') ? testStyles.timeViewActive : testStyles.timeView}>
              <Text>
                Post Now
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={()=>{this.setState({postTime: 'smart'}); console.log(this.state.postTime == 'now')}}>
            <View
                style={(this.state.postTime == 'smart') ? testStyles.timeViewActive : testStyles.timeView}>
              <Text>
                Smart Post
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={()=>this.setState({postTime:'later'})}>
            <View
                style={(this.state.postTime == 'later') ? testStyles.timeViewActive : testStyles.timeView}>
              <Text>
                Post Later
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={testStyles.socialView}>
          <TouchableOpacity
              onPress={()=>{this.setState({facebookToggle: !this.state.facebookToggle});}}>
            <View 
                style={testStyles.socialMediaToggles}
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
                style={testStyles.socialMediaToggles}
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
                style={testStyles.socialMediaToggles}
                borderColor={this.state.twitterToggle ? this.state.green : this.state.black}>
              <Icon 
                  color={this.state.twitterToggle ? this.state.green : this.state.black}
                  size={ 30 }
                  name="twitter"/>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={testStyles.submitTouchable}
          onPress={this.submitPost.bind(this)}>
          <View
              style={testStyles.submitView}>
            <Text style={testStyles.submitButton}>
              Queue
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const testStyles = StyleSheet.create({
  container: {
    flex: 1
  },
  statusBar: {
    height:20,
  },
  header: {
    height: 60,
    backgroundColor: '#97e1d0',
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'center',
    borderColor: '#A6A6A6',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    padding: 5,
  },
  logo: {
    height: 50,
    width: 200,

  },
  headerText: {
    fontSize: 30,
  },
  postView: {
    backgroundColor: '#FDFDFD',
    flex: 3,
  },
  profilePicture: {
    height: 70,
    width: 70,
    margin: 20,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#97e1d0',
  },
  postInput: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 20,
    fontSize: 20
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
    borderColor: '#97e1d0',
  },
  timeViewActive: {
    borderWidth: 1,
    width: 100,
    padding: 10,
    borderRadius: 10,
    borderColor: '#97e1d0',
    backgroundColor: '#CCCCCC'
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
  submitTouchable: {
    height: 60,
    backgroundColor: '#DDDDDD',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#97e1d0'
  },
  submitView: {
    margin: 10,
    borderRadius: 1,
    borderColor: '#000000'
  },
  submitButton: {
    fontSize: 20,
    color: '#97e1d0',
    fontWeight: 'bold',
  }
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
