import React, { Component } from 'react'
import { View, Text, StyleSheet} from 'react-native'
import { LoginButton, AccessToken } from 'react-native-fbsdk'
import { AWSCognitoCredentials } from 'aws-sdk-react-native-core'
var logins = "";

export default class Login extends Component {
  constructor(props) {
    super(props);

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

  setAWSCognitoCredential(token) {
    logins = {};
    logins[AWSCognitoCredentials.RNC_FACEBOOK_PROVIDER] = token;
    // AWSCognitoCredentials.setLogins(logins); //ignored for iOS
    getCredAndID(token);
  }

  onLoginInvoked(fbToken) {
    console.log('Accesstoken:', fbToken);

    getCredAndID(fbToken);
  }

  onLogout() {
    AWSCognitoCredentials.clearCredentials();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Hi</Text>
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
                    this.onLoginInvoked(data.accessToken.toString());
                  }
                )
              }
            }
          }
          onLogoutFinished={() => this.onLogout()}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100
  }
});

async function getCredAndID(token) {
  if (token==null) return;

  try {
    logins = {};
    logins[AWSCognitoCredentials.RNC_FACEBOOK_PROVIDER] = token;
    AWSCognitoCredentials.getLogins = function() {
      return logins;
    };
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
