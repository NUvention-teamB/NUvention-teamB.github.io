import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { LoginButton, AccessToken } from 'react-native-fbsdk'
import { AWSCognitoCredentials } from 'aws-sdk-react-native-core'
import { AWSDynamoDB } from 'aws-sdk-react-native-dynamodb'
import Icon from 'react-native-vector-icons/FontAwesome';
import { RNS3 } from 'react-native-aws3';
import { getPageID, getPageAccessToken, pagePost } from './lib/FacebookAPI'
import { EventCreationCalendar } from './lib/Calendar'
import { PostImage } from './lib/PostImage'
import Login from './src/Login'
import Home from './src/Home'
import Caption from './src/Caption'
import Photo from './src/Photo'
import Post from './src/Post'
import { Scene, Router } from 'react-native-router-flux';

region = "us-east-1";
identity_pool_id = "us-east-1:073b8647-2b1d-444b-99d9-30a8696b2274";
logins = {};

export default class teamB extends Component {
  constructor(props) {
    super(props);

    AWSCognitoCredentials.initWithOptions({"region": region, "identity_pool_id": identity_pool_id});
    AWSCognitoCredentials.clearCredentials();
    AWSCognitoCredentials.getLogins = function() {
      return logins;
    };

    AWSDynamoDB.initWithOptions({"region": region});
  }

  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene key="login" component={Login} title="Login" />
          <Scene key="home" component={Home} title="Home" />
          <Scene key="caption" component={Caption} title="Caption" />
          <Scene key="photo" component={Photo} title="Photo" />
          <Scene key="post" component={Post} title="Post" />
        </Scene>
      </Router>
    )
  }
}

AppRegistry.registerComponent('teamB', () => teamB);
