import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import Colors from '../data/Colors';

export default class Home extends Component {
  constructor(props) {
    super(props);


    this.state = {

    }
  }

  render() {

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={() => {Actions.pop()}}>
          <Icon name="times" size={20} color={Colors.gray}></Icon>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height:50,
    backgroundColor: Colors.blue,
  },
  button: {
    paddingTop: 20,
    marginLeft: 10,
    marginRight: 10,
  },

});
