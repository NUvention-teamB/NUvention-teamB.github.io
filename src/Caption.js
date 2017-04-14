import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet, Button } from 'react-native'
import { Actions } from 'react-native-router-flux';
import ImmutableListView from 'react-native-immutable-list-view';
import Immutable from 'immutable';
import listData from '../data/SuggestionsText'


export default class Caption extends Component {
  constructor(props) {
    super(props);

    this.onChangeText = this.onChangeText.bind(this);
    this.goToNext = this.goToNext.bind(this);
    
    this.state = {

    }
  }

  renderRow(rowData) {
    return (
      <View marginBottom={20}>
        <Text>{rowData}</Text>
      </View>
    );
  }

  goToNext() {
    this.props.post.caption = this.state.text;
    Actions.post({post:this.props.post});
  }

  onChangeText(text) {
    this.setState({text})
  }

  render() {
    return (
      <View style={styles.container}>

        <TextInput
          style={styles.postInput}
          placeholder="Your Text Here"
          multiline={true}
          onChangeText={this.onChangeText}/>
        <View>
          <Text>Suggestions</Text>
          <ImmutableListView
            height={250}
            immutableData={listData}
            renderRow={this.renderRow}
          />
        </View>
        <Button
          title="Next>"
          onPress={this.goToNext}/>
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
