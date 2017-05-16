import React, { Component } from 'react'
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, TextInput, Animated, TouchableHighlight, ActivityIndicator, ScrollView } from 'react-native'
import Colors from '../../data/Colors'

export default class SmallHorizontalBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.max==0) return (<Text>No {this.props.label} found...</Text>);

    var maxValue = 200;
    var offset = maxValue/(this.props.max*2);
    var count = this.props.count._value*offset;

    var imageSource = (() => {
      switch (this.props.label) {
        case 'Likes':
          return require('../../Icons/eye.png');
        case 'Reactions':
          return require('../../Icons/heart.png');
        case 'Comments':
          return require('../../Icons/chat.png');
      }
    })();

    return (
      <View style={styles.bar}>
        {/* <Text style={styles.barLabel}>{this.props.label}</Text> */}
        <View style={styles.rowContainer}>
          <View style={styles.rowIcon}>
            <Image
              style={styles.rowIconStyle}
              source={imageSource} />
          </View>
          <View style={styles.rowStats}>
            <Text style={styles.barText}><Animated.View style={[styles.barAnimated, styles[this.props.label], {width: count}]} />{' ' + this.props.count._value+' '}<Text style={styles.labelStyle}>{this.props.label.toLowerCase()}</Text></Text>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 30,
    height: 30,
  },
  rowIcon: {
    width: '25%',
  },
  rowIconStyle: {
    width: 25,
    height: 20,
  },
  rowStats: {
    width: '75%',
  },
  bar: {
    marginTop: 5,
    marginBottom: 5,
  },
  barAnimated: {
    height: 15,
    borderRadius: 5,
    marginTop: 2,
  },
  Likes: {
    backgroundColor: Colors.blue,
  },
  Reactions: {
    backgroundColor: Colors.red,
  },
  Comments: {
    backgroundColor: Colors.green,
  },
  labelStyle: {
    color: Colors.middleGray
  }
});
