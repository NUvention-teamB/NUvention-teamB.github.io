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
    var additional = (() => {
      if (this.props.onPress != null && this.props.text != null) {
        return (
          <TouchableOpacity style={styles.button} onPress={this.props.onPress.bind(this)}>
            <Text style={styles.text}>{this.props.text}</Text>
          </TouchableOpacity>
        )
      }
    })();

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={() => {Actions.pop()}}>
          <Text style={styles.text}>Back</Text>
        </TouchableOpacity>
        {additional}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height:60,
    backgroundColor: Colors.blue,
    borderBottomWidth: 1,
    borderColor: Colors.darkGray,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  text: {
    color: 'white',
  },
  button: {
    paddingTop: 30,
    marginLeft: 20,
    marginRight: 20,
  },

});
