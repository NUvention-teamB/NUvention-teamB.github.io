import React, { Component } from 'react'
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, TextInput, Animated, TouchableHighlight, ActivityIndicator, ScrollView } from 'react-native'
import SmallHorizontalBar from './SmallHorizontalBar'
import BoostPost from '../../lib/BoostPost'
import Colors from '../../data/Colors'
import IndividualPostStatistics from './IndividualPostStatistics'

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
      <View style={styles.container}>
        <View style={styles.textBar}>
          <Text style={styles.textBarText}>Post History</Text>
        </View>
        {posts}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10
  },
  boostPostButton: {
    marginTop: 0,
  },
  boostPostImage: {
    width: 120,
    height: 40,
    marginLeft: '60%',
    borderRadius: 10,
  },
  successBoostView: {
    marginTop: 10,
    paddingRight: 20,
  },
  boostedText: {
    fontSize: 12,
    textAlign: 'right',
    color: Colors.green,
  },
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
    },
    paddingBottom: 20,
  },
  textBar: {
    width: '100%',
    padding: 15,
    backgroundColor: Colors.lighterBlue
  },
  textBarText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
