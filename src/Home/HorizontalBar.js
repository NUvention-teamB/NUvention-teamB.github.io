import React, { Component } from 'react'
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, TextInput, Animated, TouchableHighlight, ActivityIndicator, ScrollView } from 'react-native'
import Colors from '../../data/Colors'

export default class HorizontalBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.max==0) return (<Text>No {this.props.label} found...</Text>);

    var maxValue = 280;
    var offset = maxValue/(this.props.max*2);
    var count = this.props.count._value*offset;

    var imageSource = (() => {
      switch (this.props.label) {
        case 'Likes':
          return require('../../Icons/eye.png');
        case 'Reactions':
          return require('../../Icons/heart.png');
        case 'Comments':
          return require('../../Icons/comment.png');
      }
    })();

    var bestCountDisplay = (()=> {
      if (this.props.bestCount==null) return null;

      var bestCount = this.props.bestCount._value*offset;

      return (
        <Text style={styles.barText}><Animated.View style={[styles.barAnimated, styles[this.props.label], {width: bestCount}]} />{' ' + this.props.bestCount._value+' '}<Text style={styles.labelStyle}>{this.props.label.toLowerCase()}</Text>
          <Image
            style={styles.crown}
            source={require('../../Icons/crown.png')} />
        </Text>
      )
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
            <Text style={styles.barText}><Animated.View style={[styles.barAnimated, styles[this.props.label], {width: count}]} />{' ' + this.props.count._value}</Text>
            {bestCountDisplay}
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
    borderBottomWidth: 1,
    borderColor: 'grey',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 30
  },
  rowIcon: {
    width: '20%',
  },
  rowIconStyle: {
    width: '70%',
  },
  rowStats: {
    width: '80%',
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
  crown: {
    height: 15,
  },
  labelStyle: {
    color: Colors.middleGray
  }
});
