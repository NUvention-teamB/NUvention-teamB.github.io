import React, { Component } from 'react'
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, TextInput, Animated, TouchableHighlight, ActivityIndicator, ScrollView } from 'react-native'
import SmallHorizontalBar from './SmallHorizontalBar'
import BoostPost from '../../lib/BoostPost'
import Colors from '../../data/Colors'

export default class IndividualPostStatistics extends Component {
  constructor(props) {
    super(props);

    this.state = {
      boosted: false,
    }
  }

  boostPost() {
    var postId = 'hmm';
    BoostPost(globalPage, postId);
    this.setState({
      boosted: true,
    })
  }

  render() {
    if (this.props.post=null) return (
      <View style={styles.individualPost}>

      </View>
    );
    var post = this.props.post;
    var statistics = post.statistics;


    var message = post.message || '';
    var date = new Date(post.created_time*1000);

    var statistics = {
      likes: new Animated.Value(post.statistics.likes),
      reactions: new Animated.Value(post.statistics.reactions),
      comments: new Animated.Value(post.statistics.comments)
    }

    var boostPost = (()=> {
      if (this.state.boosted) return (
        <View style={styles.successBoostView}>
          <Text style={styles.boostedText}>{'Successfuly boosted this post!    '}</Text>
        </View>
      )

      return (
        <TouchableOpacity style={styles.boostPostButton} onPress={()=>this.boostPost()}>
          <Image
            style={styles.boostPostImage}
            source={require('../../Icons/boostpostbutton.png')}
          />
        </TouchableOpacity>
      )
    })();


    return (
      <View style={styles.individualPost}>
        <Text style={styles.postDate}>{date.toString().slice(0,10).replace(/-/g,"/")}</Text>
        <Text style={styles.postMessage}>{message}</Text>
        <SmallHorizontalBar max={this.props.max} label={'Likes'} count={statistics.likes} />
        <SmallHorizontalBar max={this.props.max} label={'Reactions'} count={statistics.reactions} />
        <SmallHorizontalBar max={this.props.max} label={'Comments'} count={statistics.comments} />
        {boostPost}
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
