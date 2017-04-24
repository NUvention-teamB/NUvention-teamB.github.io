import React, { Component } from 'react'
import { View, Text, StyleSheet, Button } from 'react-native'
import { LoginButton, AccessToken } from 'react-native-fbsdk'
import { AWSCognitoCredentials } from 'aws-sdk-react-native-core'
import { Actions } from 'react-native-router-flux';
import { getPageID, getPageAccessToken, getPages } from '../lib/FacebookAPI'

export default class Pages extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.selectPage = this.selectPage.bind(this);

    checkIfTokenExists();
  }

  componentDidMount() {
    var _this = this;
    getPages(globalFbAccessToken)
    .then(function(pages) {
      // console.log(pages);
      _this.setState({
        pages: pages
      })
    })
    .catch(function(err) {
      console.log(err);
    });
  }

  onLogout() {
    AWSCognitoCredentials.clearCredentials();
    logins = {};
    Actions.login({type:'reset'});
  }

  selectPage(page) {
    console.log(page);
    globalPageId = page.id;
    globalPageAccessToken = page.access_token;
    Actions.home({type:'reset'});
  }

  render() {

    var pages = (() => {
      if (this.state.pages==null) {
        return <Text>Loading...</Text>;
      }

      if (this.state.pages.length==0) {
        return <Text>No pages found...</Text>;
      }

      return this.state.pages.map((page) => {
        return (
          <Button key={page.id} onPress={()=>this.selectPage(page)} title={page.name} />
        )
      });
    })();

    // console.log(pages);

    return (
      <View style={styles.container}>
        <Text>Please select which page you would like to manage</Text>
        {pages}
        <LoginButton
          publishPermissions={['public_profile', 'manage_pages','publish_pages', 'publish_actions']}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("login has error: " + result.error);
              } else if (result.isCancelled) {
                alert("login is cancelled.");
              } else {
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    console.log("LOGIN SHOULD NOT HAPPEN ON THIS SCREEN!");
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
    if (fbTokenData==null) Actions.login({type:'reset'});
  })
  .catch(function(err) {
    Actions.login({type:'reset'});
  });
}
