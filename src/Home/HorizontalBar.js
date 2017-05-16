import React, { Component } from 'react'
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, TextInput, Animated, TouchableHighlight, ActivityIndicator, ScrollView } from 'react-native'

export default class HorizontalBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.max==0) return (<Text>No {this.props.label} found...</Text>);

    var maxValue = 500;
    var offset = maxValue/(this.props.max*2);
    var count = this.props.count._value*offset;


    return (
      <View style={styles.bar}>
        <Text style={styles.barLabel}>{this.props.label}</Text>
        <Text style={styles.barText}><Animated.View style={[styles.barAnimated, styles[this.props.label], {width: count}]} />{' ' + this.props.count._value}</Text>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  bar: {
    marginTop: 5,
    marginBottom: 5,
    paddingLeft: 20,
  },
  barAnimated: {
    height: 15,
    borderRadius: 5,
    marginTop: 2,
  },
  Likes: {
    backgroundColor: 'blue',
  },
  Reactions: {
    backgroundColor: 'orange',
  },
  Comments: {
    backgroundColor: 'green',
  },
});
