import React, { Component } from 'react'
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, TextInput, Animated, TouchableHighlight, ActivityIndicator, ScrollView } from 'react-native'
import { PostImage } from '../lib/PostImage'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import PostClass from '../lib/PostClass';
import { getPageID, getPageAccessToken } from '../lib/FacebookAPI'
import { getListOfPosts, getPostLikeCount, getTotalLikesCount } from '../lib/FbPostsAPI'
import { AWSCognitoCredentials } from 'aws-sdk-react-native-core'


class HorizontalBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.max==0) return (<Text>No {this.props.label} found...</Text>);

    var maxValue = 500;
    var offset = maxValue/(this.props.max*2);
    var count = this.props.count._value*offset;


    return (
      <View style={styles.bar}>
        <Text style={styles.barLabel}>{this.props.label}</Text>
        <Text style={styles.barText}><Animated.View style={[styles.barAnimated, styles[this.props.label], {width: count}]} />{' ' + this.props.count._value}</Text>

      </View>
    )
  }
}

class LastPostsStatistics extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.statistics=null || this.props.statistics.posts==null || this.props.statistics.posts.length==0) return null;
    var statistics = this.props.statistics;

    var max = 0;

    for (var post of statistics.posts) {
      for (var type in post.statistics) {
        var value = post.statistics[type];
        if (value>max) max=value;
      }
    }

    var posts = statistics.posts.map((post) => {
      return (
        <IndividualPostStatistics max={max} key={post.id} post={post} />
      )
    });


    return (
      <View>
        <Text style={styles.recentHistoryLabel}>Your Recent History</Text>
        {posts}
      </View>
    )
  }
}

class IndividualPostStatistics extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.post=null) return null;
    var post = this.props.post;
    // console.log(post);
    var statistics = post.statistics;


    var message = this.props.post.message || '';
    var date = new Date(post.created_time*1000);

    var statistics = {
      likes: new Animated.Value(post.statistics.likes),
      reactions: new Animated.Value(post.statistics.reactions),
      comments: new Animated.Value(post.statistics.comments)
    }


    return (
      <View style={styles.individualPost}>
        <Text style={styles.postDate}>{date.toISOString().slice(0,10).replace(/-/g,"/")}</Text>
        <Text style={styles.postMessage}>{message}</Text>
        <HorizontalBar max={this.props.max} label={'Likes'} count={statistics.likes} />
        <HorizontalBar max={this.props.max} label={'Reactions'} count={statistics.reactions} />
        <HorizontalBar max={this.props.max} label={'Comments'} count={statistics.comments} />
      </View>
    )
  }
}


class WeekStatistics extends Component {
  constructor(props) {
    super(props);

    var statistics = this.props.statitics;
    // console.log(this.props);
    this.state = {
      week: this.props.week || 'thisWeekSummary'
    }

    this.switchWeek = this.switchWeek.bind(this);
  }

  switchWeek (newWeek) {
    if (this.state.week!=newWeek) this.setState({week:newWeek});
  }


  render () {
    if (!this.props.loaded) return (
      <ActivityIndicator
        animating={this.state.pages==null}
        style={[styles.centering, {height: 80}]}
        size="large"
        color="green"
      />
    );

    // console.log(this.props.statistics);

    var statistics = {
      likes: new Animated.Value(this.props.statistics[this.state.week].likes),
      reactions: new Animated.Value(this.props.statistics[this.state.week].reactions),
      comments: new Animated.Value(this.props.statistics[this.state.week].comments)
    }

    // console.log(statistics);
    var weekLabel = (this.state.week=='thisWeekSummary') ? "This Week" : "Past Week";
    var thisWeekStyle = (this.state.week=='thisWeekSummary') ? styles.weekButtonActive : styles.weekButtonInactive;
    var pastWeekStyle = (this.state.week=='pastWeekSummary') ? styles.weekButtonActive : styles.weekButtonInactive;

    return (
      <View style={styles.weekStatistics}>
        {/* <Text style={styles.weekLabel}>{weekLabel}</Text> */}
        <HorizontalBar max={this.props.max} label={'Likes'} count={statistics.likes} />
        <HorizontalBar max={this.props.max} label={'Reactions'} count={statistics.reactions} />
        <HorizontalBar max={this.props.max} label={'Comments'} count={statistics.comments} />
        <View>
          <Text style={styles.weekOptions}>
            <Text onPress={() => this.switchWeek('thisWeekSummary')} style={thisWeekStyle}>This Week</Text>
            <Text style={styles.weekOptionsSeperator}>{'    |    '}</Text>
            <Text onPress={() => this.switchWeek('pastWeekSummary')} style={pastWeekStyle}>Past Week</Text>
          </Text>
        </View>

      </View>
    )
  }
}

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
      // NOTE: DATA FOR DEMO

      // statistics.thisWeekSummary = {
      //   likes: 120,
      //   reactions: 43,
      //   comments: 38
      // }
      // statistics.pastWeekSummary = {
      //   likes: 170,
      //   reactions: 67,
      //   comments: 30
      // }

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
  weekLabel: {
    marginTop: 25,
    marginBottom: 10,
    paddingLeft: 10,
    fontSize: 18,
    fontWeight: 'bold'
  },
  bar: {
    marginTop: 5,
    marginBottom: 5,
    paddingLeft: 20,
  },
  barAnimated: {
    height: 15,
    borderRadius: 5,
    marginTop: 2,
  },
  Likes: {
    backgroundColor: 'blue',
  },
  Reactions: {
    backgroundColor: 'orange',
  },
  Comments: {
    backgroundColor: 'green',
  },
  weekButtonActive: {
    width: 100,
  },
  weekButtonInactive: {
    width: 100,
    color: 'grey',
  },
  weekOptions: {
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 20,
    color: 'darkblue'
  },
  weekOptionsSeperator: {
    fontWeight: '500',
    color: 'black'
  },
  barLabel: {
    fontWeight: 'bold',
    color: 'darkgrey',
  },
  barText: {
    fontWeight: 'bold',
    color: 'grey',
    fontSize: 15
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
  recentHistoryLabel: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 20,
    paddingTop: 30,
    paddingBottom: 10,
    color: 'darkblue',
    fontWeight: '700',
    backgroundColor: 'white'
  },
  postDate: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 5,
  },
  postMessage: {
    marginLeft: 20,
    fontSize: 11,
  },
  individualPost: {
    backgroundColor: 'white',
    padding: 10,
    paddingTop: 20,
    borderRadius: 5,
    marginTop: 10,
    shadowRadius: 5,
    shadowOpacity: 0.1,
    shadowOffset: {
      top: 1
    }
  },
  weekStatistics: {
    backgroundColor: 'white',
  },
});
