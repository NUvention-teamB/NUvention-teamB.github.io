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
import { getPageID, getPageAccessToken, pagePost } from './lib/facebookAPI'
import ImagePicker from 'react-native-image-picker'
import { RNS3 } from 'react-native-aws3';

var region = "us-east-1";
var identity_pool_id = "us-east-1:073b8647-2b1d-444b-99d9-30a8696b2274";
var logins;

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
    this.state = {}
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

  render() {

    var postImage = (() => {
      if (this.state.postImage==null) return (
        <Button title="Add a photo" onPress={this.addImage.bind(this)}/>
      )
      else return (
        <View style={testStyles.row}>
          <Image source={this.state.postImage} style={testStyles.postImage}/>
        </View>
      )
    })();


    return(
      <View style={containerStyles}>
        <View style={testStyles.statusBar}>
        </View>
        <View style={testStyles.header}>
          <Text style={testStyles.headerText}>
            Posting
          </Text>
        </View>
        <View style={testStyles.postView}>
          {postImage}
          <TextInput
            style={testStyles.postInput}
            placeholder={this.state.identityId}
            multiline={true}
            onChangeText={(text) => this.setState({text})}/>
        </View>
        <View style={testStyles.socialView}>
          <Text>
            Social Media Channels
          </Text>
        </View>
        <LoginButton
          publishPermissions={['manage_pages','publish_pages', 'publish_actions']}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("login has error: " + result.error);
              } else if (result.isCancelled) {
                alert("login is cancelled.");
              } else {
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    this.onLoginInvoked(true, data.accessToken.toString());
                  }
                )
              }
            }
          }
          onLogoutFinished={() => this.onLoginInvoked(false, "")}
        />
        <Button
          onPress={uploadPhoto.bind(this)}
          title="Upload photo"
        />
        <TouchableOpacity
          style={testStyles.submitTouchable}
          onPress={this.submitPost.bind(this)}>
          <View>
            <Text style={testStyles.submitButton}>
              Post Now
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const containerStyles = StyleSheet.create({
  flex: 1
})

const testStyles = StyleSheet.create({
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
  headerText: {
    fontSize: 30,
  },
  postView: {
    backgroundColor: '#FDFDFD',
    flex: 3,
  },
  postImage: {
    height: 180,
    width: 370,
    margin: 3,
    borderRadius: 15
  },
  postInput: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 20,
    fontSize: 20
  },
  socialView: {
    flex: 1,
    backgroundColor: 'steelblue'
  },
  submitTouchable: {
    height: 60,
    backgroundColor: '#FDFDFD',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  submitButton: {
    fontSize: 30,
  }
});

AppRegistry.registerComponent('teamB', () => teamB);


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
