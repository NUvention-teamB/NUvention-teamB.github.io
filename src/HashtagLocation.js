import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet, Button, ListView, TouchableOpacity, Image, Clipboard, ScrollView } from 'react-native'
import { Actions } from 'react-native-router-flux';
import Colors from '../data/Colors';
import Hr from 'react-native-hr';
import { createLongData } from '../lib/SuggestionsHelper';
import TagEditor from './TagEditor';
import CreatePostNavBar from './CreatePostNavBar';


export default class HashtagLocation extends Component {
  constructor(props) {
    super(props);
    
    this.addHashtag = this.addHashtag.bind(this);
    this.addHashtagFunction = this.addHashtagFunction.bind(this);
    this.copyAndNext = this.copyAndNext.bind(this);

    this.state = {
      hashtags: [
        'EvanstonCrepes',
        'gottabhappy',
        'GottabCrepes',
        'Crepes',
        'ChicagoCrepes',
        'Evanston',
      ],
      hashtagText: '',
      recentLocations: [
        'Current Location',
        'Northwestern University Tech Institute',
        '633 Clark St, Evanston, IL'
      ]
    };
  }

  addHashtag(hashtag) {
    console.log(hashtag);
    this.setState({
      hashtagText: this.state.hashtagText + ' #' + hashtag,
    });
  }

  addHashtagFunction(hashtag) {
    return () => {this.addHashtag(hashtag)};
  }

  copyAndNext() {
    text = this.props.data != null ? this.props.data.captionWithTags : '';
    Clipboard.setString(text + this.state.hashtagText);
    this.props.nextScreen();
  }
  
  render() {
    var image = (() => {
      if (this.props.postImage != null) return (
        <Image source={this.props.postImage} style={styles.postImage}/>
      )
    })();

    var captionWithTags = (() => {
      text = this.props.data != null ? this.props.data.captionWithTags : '';
      return text += this.state.hashtagText;
    })();

    var hashtags = (() => {
      output = []
      for(i = 0 ; i < this.state.hashtags.length ; i++) {
        output.push(
          <Text 
            style={styles.elementText} 
            key={'text'+i}
            onPress={this.addHashtagFunction(this.state.hashtags[i])}>
            #{this.state.hashtags[i]}
          </Text>
        )
        output.push(<Text key={'textspace'+i}>{'    '}</Text>);
      } 
      output.pop();
      return output;
    })();

    var recentLocations = (() => {
      output = [];
      for(i = 0 ; i < this.state.recentLocations.length ; i++) {
        output.push(
          <View style={styles.elementView} key={'view'+i}>
            <Text 
              key={'text'+i}
              onPress={() => {console.log('currently does nothing')}}>
              {this.state.recentLocations[i]}
            </Text>
          </View>
        )
        output.push(<Text key={'textspace'+i}>{'    '}</Text>);
      } 
      output.pop();
      return output;
    })();

    return (
      <View style={styles.container}>
        <CreatePostNavBar></CreatePostNavBar>
        <View style={styles.headerRow}>
          {image}
          <ScrollView style={styles.headerScrollView}>
            <Text style={styles.headerText}>{captionWithTags}</Text>
          </ScrollView>
        </View>
        <Hr lineColor={Colors.gray} />
        <View style={styles.sectionHeaderView}>
          <Text style={styles.sectionHeaderText}>
            Your Hashtags
          </Text>
          <TouchableOpacity onPress={this.copyAndNext}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Save template</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.elementTextView}>
          <Text>
            {hashtags}
          </Text>
        </View>
        <View style={styles.sectionHeaderView}>
          <Text style={styles.sectionHeaderText}>
            Recent Locations
          </Text>
        </View>
        <View>
          {recentLocations}
        </View>
        <View style={styles.progressBar}>
          <View style={styles.progress}></View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  headerRow: {
    flexDirection: 'row',
    margin: 10,
  },
  postImage: {
    height: 60,
    width: 60,
    marginRight: 10,
  },
  headerScrollView: {
    height: 60,
  },
  headerText: {
    flex: 1,
  },
  sectionHeaderView: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionHeaderText: {
    color: Colors.gray,
  },
  buttonHolder: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '95%',
  },
  button: {
    padding: 5,
    borderRadius: 10,
    backgroundColor: Colors.lightBlue,
  },
  buttonText: {
    color: Colors.blue,
  },
  elementTextView: {
    marginLeft: 10,
    marginRight: 10,
  },
  elementView: {
    backgroundColor: Colors.lightBlue,
    padding: 5,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10,
  },
  elementText: {
    color: Colors.blue,
    lineHeight: 25,
  },
  progressBar: {
    marginTop: 'auto',
    height: 5,
    flexDirection: 'row',
  },
  progress: {
    width: '80%',
    backgroundColor: Colors.blue,
  },
});
