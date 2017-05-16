import React, { Component } from 'react'
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, TextInput, Animated, TouchableHighlight, ActivityIndicator, ScrollView } from 'react-native'
import { PostImage } from '../../lib/PostImage'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import PostClass from '../../lib/PostClass';
import { getPageID, getPageAccessToken } from '../../lib/FacebookAPI'
import { getListOfPosts, getPostLikeCount, getTotalLikesCount } from '../../lib/FbPostsAPI'
import { AWSCognitoCredentials } from 'aws-sdk-react-native-core'
import HorizontalBar from './HorizontalBar'
import LastPostsStatistics from './LastPostsStatistics'
import WeekStatistics from './WeekStatistics'
import HomeNavBar from './HomeNavBar'

export default class Home extends Component {
  constructor(props) {
    super(props);

    var genericNumbers = {
      likes: 0,
      reactions: 0,
      comments: 0
    }
    this.state = {
      loaded: false,
      screen: 'weekStatistics'
    }
  }

  componentDidMount() {
    var _this = this;
    getListOfPosts(globalPageId, globalPageAccessToken)
    .then(function(statistics) {
      // console.log(statistics);

      _this.setState({
        statistics: statistics,
        loaded: true
      });
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  newPost() {
    var post = new PostClass();
    Actions.createPost({post: post});
  }

  switchScreens(newScreen) {
    this.setState({
      screen: newScreen
    });
  }

  render() {
    var statistics = this.state.statistics;

    var screen = (() => {
      if (this.state.screen=='weekStatistics') return (<WeekStatistics statistics={this.state.statistics} loaded={this.state.loaded} week="thisWeekSummary"/>)
      else return (<LastPostsStatistics statistics={this.state.statistics} loaded={this.state.loaded} />)
    })();

    return (
      <View style={styles.container}>
        <HomeNavBar switchScreens={this.switchScreens.bind(this)} screen={this.state.screen} />
        {screen}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 64,
    backgroundColor: '#f7f7f7',
  },
  centering: {
    // marginTop: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
});
