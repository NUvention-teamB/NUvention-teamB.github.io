import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity, ListView, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import listData from '../data/SuggestionsText';
import Colors from '../data/Colors';
import Hr from 'react-native-hr';


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
    // Actions.caption({post:this.props.post, data: data});
    this.props.nextScreen();
  }

  renderRow(rowData) {
    return (
      <TouchableOpacity
        onPress={() => {this.goToNext(rowData)}}
        style={styles.listElement}>
        <Text
          style={styles.listText}>
          {rowData.captionWithTags}
        </Text>
      </TouchableOpacity>    
    );
  }

  onChangeText(text) {
    this.setState({text})
  }

  render() {
    var header = (() => {
      if (this.props.postImage != null) return (
        <View style={styles.headerRow}>
          <Image source={this.props.postImage} style={styles.postImage}/>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>What do you want to post?</Text>
          </View>
        </View>
      )
      else return (
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>What do you want to post?</Text>
        </View>
      )
    })();

    return (
      <View style={styles.container}>
        {header}
        <Hr lineColor={Colors.gray} />
        <Text
          style={styles.title}>
          Suggestions:
        </Text>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
        />
        <TouchableOpacity
          onPress={() => {this.goToNext('')}}
          style={styles.listElement}>
          <Text
            style={styles.listText}>
            Custom Text
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
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
    color: 'black',
  },
  title: {
    margin: 10,
  },
  listElement: {
    backgroundColor: '#d5dddb',
    margin: 10,
    borderRadius: 10,
  },
  listText: {
    margin: 10
  },
});
