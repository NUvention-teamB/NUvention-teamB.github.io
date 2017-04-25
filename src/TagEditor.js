import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet, Button, ListView, TouchableOpacity } from 'react-native'
import { Actions } from 'react-native-router-flux';


export default class Caption extends Component {
  constructor(props) {
    super(props);

    this.onChangeText = this.onChangeText.bind(this);
    this.goToNext = this.goToNext.bind(this);
    this.renderRow = this.renderRow.bind(this);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    if (this.props.data != null) {
      this.state = {
        tag: this.props.tag,
        options: ds.cloneWithRows(this.props.tag),
        data: {
          
        }
      }
    }
  }

  goToNext() {
    this.props.post.caption = this.state.text;
    Actions.post({post:this.props.post});
  }

  onChangeText(text) {
    this.setState({text})
  }

  renderRow(rowData) {
    return (
      <View marginBottom={20}>
        <TouchableOpacity>
          <Text>{rowData.name}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>test</Text>
        <ListView
          dataSource={this.state.tag}
          renderRow={this.renderRow}
        />
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
