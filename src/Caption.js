import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet, Button, ListView, TouchableOpacity, Image, Clipboard } from 'react-native'
import { Actions } from 'react-native-router-flux';
import Colors from '../data/Colors';
import Hr from 'react-native-hr';
import { createLongData } from '../lib/SuggestionsHelper';
import TagEditor from './TagEditor';
import CreatePostNavBar from './CreatePostNavBar';


export default class Caption extends Component {
  constructor(props) {
    super(props);

    this.onChangeText = this.onChangeText.bind(this);
    this.copyAndNext = this.copyAndNext.bind(this);
    this.goToTagEditor = this.goToTagEditor.bind(this);
    this.goToTagEditorFunction = this.goToTagEditorFunction.bind(this);
    this.updateActiveFunction = this.updateActiveFunction.bind(this);
    this.updateValue = this.updateValue.bind(this);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    
    this.state = {
      data: this.props.data ? this.props.data : {caption:'',captionWithTags:'',tags:[]},
      tags: tags = this.props.data != null ? ds.cloneWithRows(this.props.data.tags) : null,
      active: null,
    };
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

  goToTagEditorFunction(tag, tagIndex) {
    return () => {
      this.goToTagEditor(tag,tagIndex);
    }
  }

  updateActiveFunction(index) {
    return () => {
      this.setState({active:index})
    }
  }

  updateValue(index, value) {
    this.props.updateTagSuggestion(this.props.data.id, index, value);
    this.setState({active:null});
  }

  render() {
    var image = (() => {
      if (this.props.postImage != null) return (
        <Image source={this.props.postImage} style={styles.postImage}/>
      )
    })();
    var text = (() => {
      longData = createLongData(this.props.data);

      if (longData == null) return null;
      output = [<Text key={0}>{longData[0]}</Text>];
      
      for(i = 1 ; i < longData.length ; i += 2) {
        output.push(
          <Text 
            key={i}
            style={styles.clickable}
            onPress={this.updateActiveFunction(parseInt(i/2))}>
            {longData[i]}
          </Text>);
        output.push(<Text key={i+1}>{longData[i + 1]}</Text>);
      }

      return <Text>{output}</Text>
      if (this.props.data != null) return (
        this.props.data.captionWithTags)
    })();

    var tagEditor = (() => {
      if (this.props.data == null || this.props.data.tags == null || this.state.active == null) {
        return null
      }
      console.log(this.props.data.tags[this.state.active]);
      return (
        <TagEditor 
          tag={this.props.data.tags[this.state.active].name} 
          tagIndex={this.state.active} 
          updateValue={this.updateValue}>
        </TagEditor>
      )
    })();

    return (
      <View style={styles.container}>
        <CreatePostNavBar></CreatePostNavBar>
        <View style={styles.headerRow}>
          {image}
          <Text style={styles.headerText}>Edit the tags below.</Text>
        </View>
        <Hr lineColor={Colors.gray} />
        <Text
          style={styles.postInput}>
          {text}
        </Text>
        <Hr lineColor={Colors.gray} />
        <View style={styles.buttonHolder}>
          <TouchableOpacity onPress={this.copyAndNext}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Save template</Text>
            </View>
          </TouchableOpacity>
        </View>
        {tagEditor}
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
  clickable: {
    color: Colors.hyperlink,
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
  progressBar: {
    marginTop: 'auto',
    height: 5,
    flexDirection: 'row',
  },
  progress: {
    width: '75%',
    backgroundColor: Colors.blue,
  },
});
