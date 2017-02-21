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

async function submitPost() {
  console.log('Submitting post');
  var fakeItem = {
    id: { S: Date.now().toString() },
    text: { S: this.state.text }
  };
  var params = {
    TableName: 'testy',
    Item: fakeItem
  };
  AWSDynamoDB.PutItem(params, function(err, data) {
    if (err) console.log("Error:", err);
    else console.log(data);
  });
}

export default class teamB extends Component {

  constructor(props) {
    super(props);
    this.state = {}
    this.onLoginInvoked.bind(this);

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
      this.setAWSCognitoCredential(fbTokenData.accessToken);
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

  render() {
    let pic = {
      uri: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRidbGxa6qg4mC_9xTZLv1CH50UXIrIXo3thtcetYB4AyyfYSWr'
    }


    return(
      <View style={containerStyles}>
        <View style={testStyles.header}>
          <Text style={testStyles.headerText}>
            Posting
          </Text>
        </View>
        <View style={testStyles.postView}>
          <View style={testStyles.row}>
            <Image source={pic} style={testStyles.profilePicture}/>
          </View>
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
          publishPermissions={['manage_pages','publish_pages']}
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
          onPress={getCredAndID.bind(this)}
          title="Get Creds"
        />
        <TouchableOpacity
          style={testStyles.submitTouchable}
          onPress={submitPost.bind(this)}>
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
  header: {
    height: 60,
    backgroundColor: '#EDEDED',
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomColor: '#A6A6A6',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    padding: 5,
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
