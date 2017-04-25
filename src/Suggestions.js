import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity } from 'react-native'
import { Actions } from 'react-native-router-flux';
import ImmutableListView from 'react-native-immutable-list-view';
import listData from '../data/SuggestionsText'


export default class Caption extends Component {
  constructor(props) {
    super(props);

    this.onChangeText = this.onChangeText.bind(this);
    this.goToNext = this.goToNext.bind(this);
    this.renderRow = this.renderRow.bind(this);
    
    this.state = {

    }
  }

  goToNext(data) {
    this.props.post.caption = this.state.text;
    Actions.caption({post:this.props.post, caption: data});
  }

  renderRow(rowData) {
    console.log(rowData._root);
    return (
      <View marginBottom={20}>
        <TouchableOpacity
            onPress={() => {this.goToNext(rowData)}}>
          <Text>{rowData}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  onChangeText(text) {
    this.setState({text})
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Suggestions</Text>
        <ImmutableListView
          immutableData={listData}
          renderRow={this.renderRow}
        />
        <View marginBottom={20}>
          <TouchableOpacity onPress={() => {this.goToNext('')}}>
            <Text>Custom</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100
  },
  postInput: {
    height: 100,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 20,
  },
});
