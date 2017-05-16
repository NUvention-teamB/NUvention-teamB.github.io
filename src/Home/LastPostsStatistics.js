import React, { Component } from 'react'
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, TextInput, Animated, TouchableHighlight, ActivityIndicator, ScrollView } from 'react-native'
import HorizontalBar from './HorizontalBar'

export default class LastPostsStatistics extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.statistics==null || this.props.statistics.posts==null || this.props.statistics.posts.length==0) return null;
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
      <ScrollView>
        {posts}
      </ScrollView>
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

const styles = StyleSheet.create({
  postDate: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 5,
  },
  postMessage: {
    paddingLeft: 20,
    paddingRight: 10,
    fontSize: 11,
  },
  individualPost: {
    backgroundColor: 'white',
    paddingTop: 20,
    borderRadius: 5,
    marginTop: 10,
    shadowRadius: 5,
    shadowOpacity: 0.1,
    shadowOffset: {
      top: 1
    }
  },
});
