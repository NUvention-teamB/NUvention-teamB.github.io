import React, { Component } from 'react'
import { View, Text, StyleSheet, Button, Image, TouchableHighlight, ActivityIndicator } from 'react-native'
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
    // console.log(page);
    globalPageId = page.id;
    globalPageAccessToken = page.access_token;
    Actions.home({type:'reset'});
  }

  render() {
    if (this.state.pages==null) return (
      <View style={styles.container}>
        <Image
          source={require('../img/logo.png')}
          style={styles.logo}>
        </Image>
        <ActivityIndicator
          animating={this.state.pages==null}
          style={[styles.centering, {height: 80}]}
          size="large"
          color="green"
        />
      </View>
    )

    var pages = (() => {
      if (this.state.pages.length==0) {
        return <Text>It appears that you do not manage any Facebook pages...</Text>;
      }

      return this.state.pages.map((page) => {
        // console.log(page);
        return (
          <TouchableHighlight key={page.id} onPress={()=>this.selectPage(page)} underlayColor="lightgreen">
            <View style={styles.page}>
              <Text style={styles.pageName}>{page.name}</Text>
              <Text style={styles.pageCategory}>{page.category}</Text>
            </View>
          </TouchableHighlight>
        )
      });
    })();

    // console.log(pages);

    return (
      <View style={styles.container}>
        <Image
          source={require('../img/logo.png')}
          style={styles.logo}>
        </Image>
        <Text style={styles.instructions}>Select your page...</Text>
        {pages}
        <LoginButton
          style={styles.fbButton}
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
    paddingTop: 20
  },
  logo: {
    width: 335,
    height: 120,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '3%',
  },
  centering: {
    marginTop: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  instructions: {
    fontSize: 20,
    fontWeight: 'normal',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 30
  },
  page: {
    padding: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'green',
    // borderColor: '#81d186',
  },
  pageName: {
    fontSize: 18,
    fontWeight: 'bold',

  },
  pageCategory: {
    fontSize: 13,
    color: 'grey',
    paddingLeft: 5
  },
  fbButton: {
    backgroundColor: 'blue',
    width: '40%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
    height: 30,
    borderRadius: 15
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
