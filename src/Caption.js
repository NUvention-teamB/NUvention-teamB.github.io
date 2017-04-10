import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet, Button } from 'react-native'
import { Actions } from 'react-native-router-flux';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  goToNext() {
    Actions.home();
  }

  render() {
    return (
      <View style={styles.container}>

        <TextInput
          style={styles.postInput}
          placeholder="Your Text Here"
          multiline={true}
          onChangeText={(text) => this.setState({text})}/>
        <Text>Hola</Text>
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
