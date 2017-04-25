import React, { Component } from 'react'
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, TextInput, Animated } from 'react-native'
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

    var maxValue = 300;
    var offset = maxValue/(this.props.max*2);
    var count = this.props.count._value*offset;


    return (
      <View style={styles.bar}>
        <Text>{this.props.label+': '}
        <Animated.View style={[styles.barAnimated, styles[this.props.label], {width: count}]} />
        {this.props.count._value}
        </Text>
      </View>
    )
  }
}


class WeekStatistics extends Component {
  constructor(props) {
    super(props);

    var statistics = this.props.statitics;

    this.state = {
      week: 'thisWeekSummary'
    }
  }

  switchWeek () {
    if (this.state.week=='thisWeekSummary') this.setState({week:'pastWeekSummary'});
    else if (this.state.week=='pastWeekSummary') this.setState({week:'thisWeekSummary'});
    else {
      console.log('ERROR, week not defined properly')
    }
    // Animated.parallel(indicators.map(item => {
    //   return Animated.timing(this.state[item], {toValue: width[item]})
    // })).start()
  }


  render () {
    if (!this.props.loaded) return (<Text>Loading...</Text>);

    console.log(this.props.statistics);

    var statistics = {
      likes: new Animated.Value(this.props.statistics[this.state.week].likes),
      reactions: new Animated.Value(this.props.statistics[this.state.week].reactions),
      comments: new Animated.Value(this.props.statistics[this.state.week].comments)
    }

    console.log(statistics);

    var max = (() => {
      var maxValue = 0;
      for (var type in statistics) {
        if (statistics[type]._value>maxValue) maxValue = statistics[type]._value;
      }
      return maxValue
    })();

    console.log(max);

    return (
      <View>
        <HorizontalBar max={max} label={'Likes'} count={statistics.likes} />
        <HorizontalBar max={max} label={'Reactions'} count={statistics.reactions} />
        <HorizontalBar max={max} label={'Comments'} count={statistics.comments} />
        <Text onPress={this.switchWeek.bind(this)}>Switch Week</Text>
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

    return (
      <View style={styles.container}>
        <WeekStatistics statistics={this.state.statistics} loaded={this.state.loaded}/>
        <Text>This is a placeholder</Text>
        <Button
          title="Create a new post>"
          onPress={this.newPost}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100
  },
  bar: {
    marginTop: 5,
    marginBottom: 5,
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
  }
});
