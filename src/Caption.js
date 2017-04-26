import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet, Button, ListView, TouchableOpacity, Image } from 'react-native'
import { Actions } from 'react-native-router-flux';
import Colors from '../data/Colors';
import Hr from 'react-native-hr';


export default class Caption extends Component {
  constructor(props) {
    super(props);

    this.onChangeText = this.onChangeText.bind(this);
    this.goToPost = this.goToPost.bind(this);
    this.goToTagEditor = this.goToTagEditor.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.generateText = this.generateText.bind(this);
    this.getTags = this.getTags.bind(this);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    
    this.state = {
      data: this.props.data ? this.props.data : {caption:'',captionWithTags:'',tags:[]},
      tags: tags = this.props.data != null ? ds.cloneWithRows(this.props.data.tags) : null,
    };
  }

  generateText() {
    data = this.props.data ? this.props.data : {caption:'',captionWithTags:'',tags:[]};
    output = data.caption;
    console.log('output' + output);
    for (i = data.tags.length - 1 ; i >= 0 ; i--) {
      position = data.tags[i].position;
      console.log(i + data.tags[i].replacement);
      if (data.tags[i].replacement != undefined) {
        output = [output.slice(0, position), data.tags[i].replacement, output.slice(position)].join('');
      } else {
        output = [output.slice(0, position), '[' + data.tags[i].name + ']', output.slice(position)].join('');
      }
    }
    // this.props.updateText(output);
    return output;
  }

  goToPost() {
    this.state.data.caption = this.state.text;
    // Actions.post({post:this.props.post});
    this.props.nextScreen();
  }

  goToTagEditor(tag) {
    Actions.tagEditor({tag:tag})
  }

  onChangeText(text) {
    this.setState({text})
  }

  getTags(data) {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return data != null && data.tags != null ? ds.cloneWithRows(data.tags) : null;
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
    if (this.getTags(this.props.data) != null) {
      return (
        <ListView
          dataSource={this.getTags(this.props.data)}
          renderRow={this.renderRow}
        />
      )
    }
  }

  render() {
    var image = (() => {
      if (this.props.postImage != null) return (
        <Image source={this.props.postImage} style={styles.postImage}/>
      )
    })();
    var text = this.generateText();
    var conditional = this.conditional();
  
    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          {image}
          <Text style={styles.headerText}>Edit the tags below.</Text>
        </View>
        <Hr lineColor={Colors.gray} />
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
    color: Colors.darkGreen,
  },
  postInput: {
    height: 100,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 20,
  },
  listElement: {
    backgroundColor: Colors.lightGreen,
    margin: 10,
    borderRadius: 10,
  },
  listText: {
    margin: 10
  },
});
