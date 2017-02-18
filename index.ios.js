/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
  TextInput
} from 'react-native';

import { AWSCognitoCredentials } from 'aws-sdk-react-native-core'
import { AWSDynamoDB } from 'aws-sdk-react-native-dynamodb'

var region = "us-east-1";
var identity_pool_id = "us-east-1:073b8647-2b1d-444b-99d9-30a8696b2274";

async function getCredAndID() {
  AWSCognitoCredentials.initWithOptions({"region": region, "identity_pool_id": identity_pool_id});
  var credentialsObj = await AWSCognitoCredentials.getCredentialsAsync();
  var identityIdObj = await AWSCognitoCredentials.getIdentityIDAsync();
  console.log(identityIdObj.identityId);
  this.setState({
    identityId: identityIdObj.identityId
  });
}

async function submitPost() {

  var fakeItem = {
    id: { S: Date.now().toString() },
    text: { S: this.state.text }
  };
  var params = {
    TableName: 'testy',
    Item: fakeItem
  };
  AWSDynamoDB.initWithOptions({"region": region});

  AWSDynamoDB.PutItem(params, function(err, data) {
    if (err) throw err;
    console.log(data);
  });
}

export default class teamB extends Component {

  constructor(props) {
    super(props);
    this.state = {}

    getCredAndID.call(this);
  }


  render() {
    let pic = {
      uri: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRidbGxa6qg4mC_9xTZLv1CH50UXIrIXo3thtcetYB4AyyfYSWr'
    }


    return(
      <View style={{flex: 1}}>
        <View style={testStyles.header}>
          <Text style={testStyles.headerText}>
            Posting
          </Text>
        </View>
        <View style={testStyles.postView}>
          <View style={testStyles.row}>
            <Image source={pic} style={testStyles.profilePicture}/>
          </View>
          <TextInput
            style={testStyles.postInput}
            placeholder="Type here to translate!"
            multiline={true}
            onChangeText={(text) => this.setState({text})}/>
        </View>
        <View style={testStyles.socialView}>
          <Text>
            Social Media Channels
          </Text>
        </View>
        <TouchableOpacity
          style={testStyles.submitTouchable}
          onPress={submitPost.bind(this)}>
          <View>
            <Text style={testStyles.submitButton}>
              Post Now
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const testStyles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#EDEDED',
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomColor: '#A6A6A6',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    padding: 5,
  },
  headerText: {
    fontSize: 30,
  },
  postView: {
    backgroundColor: '#FDFDFD',
    flex: 3,
  },
  profilePicture: {
    height: 70,
    width: 70,
    margin: 20,
    borderRadius: 35,
  },
  postInput: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 20,
    fontSize: 20
  },
  socialView: {
    flex: 1,
    backgroundColor: 'steelblue'
  },
  submitTouchable: {
    height: 60,
    backgroundColor: '#FDFDFD',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  submitButton: {
    fontSize: 30,
  }
});

AppRegistry.registerComponent('teamB', () => teamB);
