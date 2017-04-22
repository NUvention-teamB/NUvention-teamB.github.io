import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity, ListView } from 'react-native'
import { Actions } from 'react-native-router-flux';
import listData from '../data/SuggestionsText'


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
    this.props.post.caption = this.state.text;
    Actions.caption({post:this.props.post, data: data});
  }

  renderRow(rowData) {
    return (
      <View marginBottom={20}>
        <TouchableOpacity
            onPress={() => {this.goToNext(rowData)}}>
          <Text>{rowData.captionWithTags}</Text>
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
        <ListView
          dataSource={this.state.dataSource}
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
