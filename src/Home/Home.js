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

export default class Home extends Component {
  constructor(props) {
    super(props);

    var genericNumbers = {
      likes: 0,
      reactions: 0,
      comments: 0
    }
    this.state = {
      statistics: {
        thisWeek: genericNumbers,
        pastWeek: genericNumbers,
      },
      loaded: false
    }
  }

  componentDidMount() {
    var _this = this;
    getListOfPosts(globalPageId, globalPageAccessToken)
    .then(function(statistics) {
      console.log(statistics);

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

  render() {

    var statistics = this.state.statistics;

    var max = (() => {
      var maxValue = 0;
      for (var type in statistics) {
        for (var label in statistics[type]) {
          if (statistics[type][label]>maxValue) maxValue = statistics[type][label];
        }
      }
      return maxValue
    })();

    // console.log(max);

    var weekLabel = (this.state.week)

    return (
      <ScrollView>
      <View style={styles.container}>
        <Text style={styles.pageName}>Your Stats For {globalPage.name}</Text>
        <WeekStatistics statistics={this.state.statistics} max={max} loaded={this.state.loaded} week="thisWeekSummary"/>
        <TouchableHighlight onPress={this.newPost}>
          <View style={styles.newPost}>
            <Text style={styles.newPostText}>Create a new post</Text>
          </View>
        </TouchableHighlight>

        <LastPostsStatistics statistics={this.state.statistics} loaded={this.state.loaded} />

      </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  centering: {
    // marginTop: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  pageName: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'darkblue',
    marginBottom: 30,
    marginTop: 10
  },
  newPost: {
    backgroundColor: '#00b0ff',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
    width: '60%',
    padding: 15,
    borderRadius: 20,
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowColor: 'darkblue',
    shadowOffset: {
      top: 1
    },
  },
  newPostText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
  },
});
