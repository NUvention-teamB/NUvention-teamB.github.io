import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet, Button, ListView, TouchableOpacity, Image, Clipboard } from 'react-native'
import { Actions } from 'react-native-router-flux';
import Colors from '../data/Colors';
import Hr from 'react-native-hr';


export default class Caption extends Component {
  constructor(props) {
    super(props);

    this.onChangeText = this.onChangeText.bind(this);
    this.copyAndNext = this.copyAndNext.bind(this);
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
    data = this.props.data ? this.props.data : {id:null,caption:'',captionWithTags:'',tags:[]};
    output = data.caption;

    for (i = data.tags.length - 1 ; i >= 0 ; i--) {
      position = data.tags[i].position;
      console.log(i + data.tags[i].replacement);
      if (data.tags[i].replacement != undefined) {
        output = [output.slice(0, position), data.tags[i].replacement, output.slice(position)].join('');
      } else {
        output = [output.slice(0, position), '[' + data.tags[i].name + ']', output.slice(position)].join('');
      }
    }
    return output;
  }

  copyAndNext() {
    text = this.props.data != null ? this.props.data.captionWithTags : '';
    Clipboard.setString(text);
    this.props.nextScreen();
  }

  goToTagEditor(tag, tagIndex) {
    Actions.tagEditor({tag: tag, tagIndex: tagIndex, id: this.props.data.id})
  }

  onChangeText(text) {
    this.setState({text})
  }

  getTags(data) {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return ds.cloneWithRows(data.tags);
  }

  renderRow(rowData, sectionId, rowId) {
    return (
      <View marginBottom={20}>
        <TouchableOpacity
            onPress={() => {this.goToTagEditor(rowData.name, parseInt(rowId))}}
            style={styles.listElement}>
          <Text
            style={styles.listText}>
            {rowData.name}: {rowData.suggestion || 'None'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    var image = (() => {
      if (this.props.postImage != null) return (
        <Image source={this.props.postImage} style={styles.postImage}/>
      )
    })();
    var text = (() => {
      if (this.props.data != null) return (
        this.props.data.captionWithTags)
    })();

    var conditional = (()=> {
      if (this.props.data != null && this.props.data.tags != null) {
        return (
          <ListView
            dataSource={this.getTags(this.props.data)}
            renderRow={this.renderRow}
          />
        )
      }
    })();
  
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
          title="Copy"
          onPress={this.copyAndNext}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
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
  headerText: {
    fontSize: 20,
    color: Colors.blue,
  },
  postInput: {
    marginTop: 10,
    height: 100,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 20,
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
