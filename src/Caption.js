import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet, Button, ListView, TouchableOpacity } from 'react-native'
import { Actions } from 'react-native-router-flux';


export default class Caption extends Component {
  constructor(props) {
    super(props);

    this.onChangeText = this.onChangeText.bind(this);
    this.goToPost = this.goToPost.bind(this);
    this.goToTagEditor = this.goToTagEditor.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.generateText = this.generateText.bind(this);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    
    this.state = {
      data: this.props.data ? this.props.data : {caption:'',captionWithTags:'',tags:[]},
      tags: tags = this.props.data != null ? ds.cloneWithRows(this.props.data.tags) : null,
    };
    
    
  }

  generateText() {
    output = this.state.data.caption;
    for (i = this.state.data.tags.length - 1 ; i >= 0 ; i--) {
      position = this.state.data.tags[i].position;
      console.log(i + this.state.data.tags[i].replacement);
      if (this.state.data.tags[i].replacement != undefined) {
        output = [output.slice(0, position), this.state.data.tags[i].replacement, output.slice(position)].join('');
      } else {
        output = [output.slice(0, position), '[' + this.state.data.tags[i].name + ']', output.slice(position)].join('');
      }
    }
    console.log(output);
    return output;
  }

  goToPost() {
    this.state.data.caption = this.state.text;
    Actions.post({post:this.props.post});
  }

  goToTagEditor(tag) {
    Actions.tagEditor({post:this.props.post, tag:tag})
  }

  onChangeText(text) {
    this.setState({text})
  }

  renderRow(rowData) {
    return (
      <View marginBottom={20}>
        <TouchableOpacity
            onPress={() => {this.goToTagEditor(rowData.name)}}
            style={styles.listElement}>
          <Text
            style={styles.listText}>
            {rowData.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  conditional() {
    if (this.state.data.tags.length != 0) {
      return (
        <ListView
          dataSource={this.state.tags}
          renderRow={this.renderRow}
        />
      )
    }
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
    var text = this.generateText();
    var conditional = this.conditional();
  
    return (
      <View style={styles.container}>
        {header}
        <Text
          style={styles.postInput}>
          {text}
        </Text>
        {conditional}
        <Button
          title="Next>"
          onPress={this.goToPost}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100
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
  postInput: {
    height: 100,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 20,
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
