import React, { Component } from 'react'
import { View, Text, StyleSheet} from 'react-native'
import { LoginButton, AccessToken } from 'react-native-fbsdk'
import { AWSCognitoCredentials } from 'aws-sdk-react-native-core'
import { Actions } from 'react-native-router-flux';

export default class Login extends Component {
  constructor(props) {
    super(props);

    checkIfTokenExists();
  }

  onLoginInvoked(fbToken) {
    console.log('fbToken:', fbToken);

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

function checkIfTokenExists() {
  AccessToken.getCurrentAccessToken()
  .then(function(fbTokenData) {
    if (fbTokenData==null) return;
    console.log('fbTokenData:', fbTokenData);

    return getCredAndID(fbTokenData.accessToken)
  })
  .then(function() {
    Actions.caption({type:'reset'});
  })
  .catch(function(err) {
    console.log('Error getting token:', err);
  });
}

async function getCredAndID(token) {
  if (token==null) return;

  try {
    logins[AWSCognitoCredentials.RNC_FACEBOOK_PROVIDER] = token;

    var credentialsObj = await AWSCognitoCredentials.getCredentialsAsync();
    console.log(credentialsObj);
    var identityIdObj = await AWSCognitoCredentials.getIdentityIDAsync();
    console.log('IDENTITY ID:', identityIdObj.identityId);
  }
  catch(err) {
    console.log("ERROR while getting credentials:", err);
  }
}
