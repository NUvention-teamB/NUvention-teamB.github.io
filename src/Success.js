import React, { Component } from 'react'
import { View, Text, StyleSheet, Button, Image, TouchableHighlight, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native'
import { Actions } from 'react-native-router-flux';
import Colors from '../data/Colors'
import PostClass from '../lib/PostClass';
import BoostPost from '../lib/BoostPost'

export default class Success extends Component {
  constructor(props) {
    super(props);

    this.state = {
      boosted: false,
      boosting: false,
    };
  }

  newPost() {
    var post = new PostClass();
    Actions.createPost({post: post});
  }

  boostPost() {
    var postId = 'test';
    BoostPost(globalPage, postId);
    this.setState({
      boosting: false,
      boosted: true,
    });
  }

  handleBoostingPost() {
    this.setState({
      boosting: true,
      boostedL: false,
    });
  }

  goToPostHistory() {
    Actions.home({type: 'reset'})
  }

  render() {

    var boostPost = (()=> {
      if (this.state.boosted) return (
        <View style={styles.successBoostView}>
          <Text style={styles.boosted}>Successfuly boosted this post!</Text>
        </View>
      )

      if (this.state.boosting) return (
        <View style={styles.successBoostView}>
          <Text style={styles.selectAmount}>Select the amount for boosting</Text>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <TouchableOpacity style={styles.amountButton} onPress={()=>this.boostPost()}>
              <Text style={styles.amountText}>$1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.amountButton} onPress={()=>this.boostPost()}>
              <Text style={styles.amountText}>$3</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.amountButton} onPress={()=>this.boostPost()}>
              <Text style={styles.amountText}>$5</Text>
            </TouchableOpacity>
          </View>
        </View>
      )

      return (
        <TouchableOpacity style={styles.boostPostButton} onPress={()=>this.handleBoostingPost()}>
          <Image
            style={styles.boostPostImage}
            source={require('../Icons/boostpostbutton.png')}
          />
        </TouchableOpacity>
      )
    })()

    var text = (
      <View>
      <Text style={styles.texty}>
        Successfuly posted!
      </Text>
      <Text style={styles.texty}>
        Thank you for using Breezy.
      </Text>
      </View>
    )

    return (
      <View style={styles.container}>
        <Image
          style={styles.rocket}
          source={require('../Icons/rocket.png')}
        />
        {text}
        {boostPost}
        <TouchableOpacity style={styles.newPostButton} onPress={()=>this.newPost()}>
          <Image
            style={styles.newPostImage}
            source={require('../Icons/newpost.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.postHistoryButton} onPress={()=>this.goToPostHistory()}>
          <Image
            style={styles.postHistoryImage}
            source={require('../Icons/viewposthistory.png')}
          />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50
  },
  boosted: {
    fontSize: 18,
    textAlign: 'center',
    color: Colors.green,
    fontSize: 22,
    fontWeight: '500',
  },
  rocket: {
    width: 250,
    height: 250,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  texty: {
    fontSize: 16,
    textAlign: 'center',
  },
  successBoostView: {
    marginTop: 40,
  },
  successText: {
    fontSize: 18,
    textAlign: 'center',
  },
  newPostButton: {
    marginTop: 30,
  },
  newPostImage: {
    width: 300,
    height: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 20,
  },
  boostPostButton: {
    marginTop: 0,
  },
  boostPostImage: {
    width: 300,
    height: 90,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 20,
  },
  postHistoryButton: {
    marginTop: 20,
  },
  postHistoryImage: {
    width: 300,
    height: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 20,
  },
  selectAmount: {
    fontSize: 18,
    textAlign: 'center',
    color: Colors.middleGray,
    fontSize: 22,
    fontWeight: '500',
  },
  amountButton: {
    backgroundColor: Colors.darkGreen,
    width: 70,
    padding: 10,
    margin: 15,
    borderRadius: 15,
  },
  amountText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 15,
  },
});
