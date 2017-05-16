import React, { Component } from 'react'
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, TextInput, Animated, TouchableHighlight, ActivityIndicator, ScrollView } from 'react-native'

export default class Home extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.textBar}>
          <Text style={styles.textBarText}>User Statistics</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {

  },
  textBar: {
    width: '100%',
    padding: 15,
    backgroundColor: Colors.lighterBlue
  },
  textBarText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
