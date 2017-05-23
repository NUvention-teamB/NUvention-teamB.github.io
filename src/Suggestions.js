import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity, ListView, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import listData from '../data/SuggestionsText';
import Colors from '../data/Colors';
import Hr from 'react-native-hr';
import CreatePostNavBar from './CreatePostNavBar';


export default class Caption extends Component {
  constructor(props) {
    super(props);

    this.onChangeText = this.onChangeText.bind(this);
    this.goToNext = this.goToNext.bind(this);
    this.renderRow = this.renderRow.bind(this);
    
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      dataSource: ds.cloneWithRows(listData),
    }
  }

  goToNext(data) {
    this.props.updateSuggestion(data);
    this.props.nextScreen();
  }

  customCaption() {
    this.props.updateSuggestion();
    this.props.skipTwo();
  }

  renderRow(rowData) {
    return (
      <TouchableOpacity
        onPress={() => {this.goToNext(rowData)}}
        style={styles.listElement}>
        <Text
          style={styles.listText}>
          {rowData.fullCaption}
        </Text>
      </TouchableOpacity>    
    );
  }

  onChangeText(text) {
    this.setState({text})
  }

  render() {
    var image = (() => {
      if (this.props.postImage != null) return (
        <Image source={this.props.postImage} style={styles.postImage}/>
      )
    })();

    return (
      <View style={styles.container}>
        <CreatePostNavBar></CreatePostNavBar>
        <View style={styles.headerRow}>
          {image}
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>What do you want to post?</Text>
            <View style={styles.subheaderTextContainer}>
              <Text style={styles.subheaderText}>Select one below or</Text>
              <TouchableOpacity
                style={styles.writeYourOwnTouch}
                onPress={()=>{this.customCaption()}}>
                <Text style={styles.writeYourOwn}>write your own</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Hr lineColor={Colors.gray} />
        <Text
          style={styles.title}>
          Suggestions:
        </Text>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
  },
  headerRow: {
    height: 60,
    flexDirection: 'row',
    margin: 10,
  },
  postImage: {
    height: 60,
    width: 60,
    marginRight: 10,
  },
  headerTextContainer: {
    flexDirection: "column",
    flex: 1,
  },
  headerText: {
    fontSize: 20,
    color: Colors.blue,
  },
  subheaderTextContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  subheaderText: {
    fontSize: 15,
    color: Colors.blue,
    margin: 5,
    marginLeft: 0,
  },
  writeYourOwnTouch: {
    backgroundColor: Colors.lightBlue,
    borderRadius: 10,
  },
  writeYourOwn: {
    fontSize: 15,
    color: 'white',
    margin: 5
  },
  title: {
    margin: 10,
    color: Colors.blue,
  },
  listElement: {
    backgroundColor: Colors.lightBlue,
    margin: 10,
    borderRadius: 10,
  },
  listText: {
    margin: 10
  },
});
