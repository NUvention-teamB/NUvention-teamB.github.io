import React, { Component } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { LoginButton, AccessToken } from 'react-native-fbsdk'
import { AWSCognitoCredentials } from 'aws-sdk-react-native-core'
import { Actions } from 'react-native-router-flux';
import { getPageID, getPageAccessToken } from '../lib/FacebookAPI'
import Colors from '../data/Colors'

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    }
  }

  componentWillMount() {
    this.checkIfTokenExists();
  }

  checkIfTokenExists() {
    _this = this;
    AccessToken.getCurrentAccessToken()
    .then(function(fbTokenData) {

      if (fbTokenData==null) return Promise.reject();
      // console.log('fbTokenData:', fbTokenData);

      return getCredAndID(fbTokenData.accessToken);
    })
    .then(function() {
      _this.setState({loading: false});
      Actions.pages({type:'reset'});
    })
    .catch(function(err) {
      _this.setState({loading: false});
      if (err) console.log('Error getting token or credentials:', err);
      else console.log('Token not present...');
    });
  }

  onLoginInvoked(fbToken) {
    // console.log('fbToken:', fbToken);

    getCredAndID(fbToken)
    .then(function() {
      Actions.pages({type:'reset'});
    })
  }

  onLogout() {
    AWSCognitoCredentials.clearCredentials();
    logins = {};
    Actions.login({type:'reset'});
  }

  render() {
    if (this.state.loading) return null;

    return (
      <View style={styles.container}>
        <Image
          source={require('../img/logo_white.png')}
          style={styles.logo}>
        </Image>
        <LoginButton
          style={styles.fbButton}
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
    height: "100%",
    paddingTop: 100,
    backgroundColor: Colors.brightBlue,
  },
  logo: {
    width: 310,
    height: 85,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 40,
  },
  fbButton: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '50%',
    marginTop: '30%',
    paddingLeft: 10,
    height: 40,
    borderRadius: 30
  }
});


async function getCredAndID(token) {
  if (token==null) return;

  try {
    logins[AWSCognitoCredentials.RNC_FACEBOOK_PROVIDER] = token;

    var credentialsObj = await AWSCognitoCredentials.getCredentialsAsync();
    // console.log(credentialsObj);
    var identityIdObj = await AWSCognitoCredentials.getIdentityIDAsync();
    // console.log('IDENTITY ID:', identityIdObj.identityId);
    globalFbAccessToken = token;
  }
  catch(err) {
    console.log("ERROR while getting credentials:", err);
  }
}
