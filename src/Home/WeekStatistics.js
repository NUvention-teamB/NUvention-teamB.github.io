import React, { Component } from 'react'
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, TextInput, Animated, TouchableHighlight, ActivityIndicator, ScrollView } from 'react-native'
import HorizontalBar from './HorizontalBar'
import Colors from '../../data/Colors'

export default class WeekStatistics extends Component {
  constructor(props) {
    super(props);

    this.state = {
      weekIndex: 0,
    }

    this.switchWeek = this.switchWeek.bind(this);
  }

  switchWeek(newWeek) {
    if (this.state.week!=newWeek) this.setState({week:newWeek});
  }

  goLeft() {
    this.setState({
      weekIndex: this.state.weekIndex+1
    })
  }

  goRight() {
    this.setState({
      weekIndex: this.state.weekIndex-1
    })
  }


  render () {
    if (!this.props.loaded) return (
      <ActivityIndicator
        animating={this.state.pages==null}
        style={[styles.centering, {height: 80}]}
        size="large"
        color={Colors.blue}
      />
    );

    var statsByWeek = this.props.statistics.statsByWeek;

    var max = (() => {
      var maxValue = 0;
      for (var weekStats of statsByWeek) {
        for (var label in weekStats) {
          if (weekStats[label]>maxValue) maxValue = weekStats[label];
        }
      }

      return maxValue;
    })();

    var weekStatistics = this.props.statistics.statsByWeek[this.state.weekIndex];
    var bestWeek = this.props.statistics.bestWeek;

    var statistics = {
      likes: new Animated.Value(weekStatistics.likes),
      reactions: new Animated.Value(weekStatistics.reactions),
      comments: new Animated.Value(weekStatistics.comments)
    }

    var bestStatistics = {
      likes: new Animated.Value(bestWeek.likes),
      reactions: new Animated.Value(bestWeek.reactions),
      comments: new Animated.Value(bestWeek.comments)
    }

    // console.log(statistics);
    var weekLabel = (() => {
      var label = (() => {
        if (this.state.weekIndex==0) return 'This Week';
        if (this.state.weekIndex==1) return 'Past Week';
        else return this.state.weekIndex+' Weeks Ago';
      })();

      return (
        <Text style={styles.weekLabel}>{label}</Text>
      )
    })();

    var leftSlide = (() => {
      if (statsByWeek.length==this.state.weekIndex+1) return <Text style={styles.weekNavigator}>{' '}</Text>;
      return (
        <Text style={styles.weekNavigator} onPress={this.goLeft.bind(this)}>{'<'}</Text>
      )
    })();

    var rightSlide = (() => {
      if (this.state.weekIndex==0) return <Text style={styles.weekNavigator}>{' '}</Text>;
      return (
        <Text style={styles.weekNavigator} onPress={this.goRight.bind(this)}>{'>'}</Text>
      )
    })();

    return (
      <View style={styles.weekStatistics}>
        <View>
          <View style={styles.weekNavBar}>
            {leftSlide}
            {weekLabel}
            {rightSlide}
          </View>
        </View>

        <HorizontalBar max={max} label={'Likes'} count={statistics.likes} bestCount={bestStatistics.likes} />
        <HorizontalBar max={max} label={'Reactions'} count={statistics.reactions} bestCount={bestStatistics.reactions} />
        <HorizontalBar max={max} label={'Comments'} count={statistics.comments} bestCount={bestStatistics.comments} />

      </View>
    )
  }
}

const styles = StyleSheet.create({
  centering: {
    backgroundColor: 'white',
  },
  weekNavBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: Colors.lightGray,
    paddingTop: 10,
    paddingBottom: 10,
  },
  weekLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '80%',
    color: Colors.brightBlue,
  },
  weekNavigator: {
    width: '8%',
    marginLeft: '2%',
    // marginRight: '1%',
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.brightBlue,
  },
  weekButtonActive: {
    width: 100,
  },
  weekButtonInactive: {
    width: 100,
    color: 'grey',
  },
  weekOptions: {
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 20,
    color: 'darkblue'
  },
  weekOptionsSeperator: {
    fontWeight: '500',
    color: 'black'
  },
  barLabel: {
    fontWeight: 'bold',
    color: 'darkgrey',
  },
  barText: {
    fontWeight: 'bold',
    color: 'grey',
    fontSize: 15
  },
  weekStatistics: {
    backgroundColor: 'white',
  },
});
