import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { LoginButton, AccessToken } from 'react-native-fbsdk'
import { AWSCognitoCredentials } from 'aws-sdk-react-native-core'
import { AWSDynamoDB } from 'aws-sdk-react-native-dynamodb'
import Icon from 'react-native-vector-icons/FontAwesome';
import { RNS3 } from 'react-native-aws3';
import { getPageID, getPageAccessToken, pagePost } from './lib/FacebookAPI'
import { PostImage } from './lib/PostImage'
import Login from './src/Login'
import Home from './src/Home'
import Caption from './src/Caption'
import Photo from './src/Photo'
import Post from './src/Post'
import Suggestions from './src/Suggestions'
import TagEditor from './src/TagEditor'
import CreatePost from './src/CreatePost'
import { Scene, Router } from 'react-native-router-flux';
import Pages from './src/Pages'

region = "us-east-1";
identity_pool_id = "us-east-1:073b8647-2b1d-444b-99d9-30a8696b2274";
logins = {};
globalFbAccessToken = null;
globalPageId = null;
globalPageAccessToken = null;
globalPage = null;

export default class teamB extends Component {
  constructor(props) {
    super(props);

    AWSCognitoCredentials.initWithOptions({"region": region, "identity_pool_id": identity_pool_id});
    AWSCognitoCredentials.clearCredentials();
    AWSCognitoCredentials.getLogins = function() {
      return logins;
    };

    // AWSDynamoDB.initWithOptions({"region": region});
  }

  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene key="login" component={Login} title="Login" initial={true} hideNavBar={true} />
          <Scene key="pages" component={Pages} title="Pages" hideNavBar={true} />
          <Scene key="home" component={Home} title="Home" hideNavBar={false} />
          <Scene key="caption" component={Caption} title="Caption" />
          <Scene key="photo" component={Photo} title="Photo" />
          <Scene key="post" component={Post} title="Post" />
          <Scene key="suggestions" component={Suggestions} title="Suggestions" />
          <Scene key="tagEditor" component={TagEditor} title="TagEditor" />
          <Scene key="createPost" component={CreatePost} title="CreatePost" />
        </Scene>
      </Router>
    )
  }
}

AppRegistry.registerComponent('teamB', () => teamB);
