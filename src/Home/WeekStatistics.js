import React, { Component } from 'react'
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, TextInput, Animated, TouchableHighlight, ActivityIndicator, ScrollView } from 'react-native'
import HorizontalBar from './HorizontalBar'

export default class WeekStatistics extends Component {
  constructor(props) {
    super(props);

    var statistics = this.props.statitics;
    // console.log(this.props);
    this.state = {
      week: this.props.week || 'thisWeekSummary'
    }

    this.switchWeek = this.switchWeek.bind(this);
  }

  switchWeek (newWeek) {
    if (this.state.week!=newWeek) this.setState({week:newWeek});
  }


  render () {
    if (!this.props.loaded) return (
      <ActivityIndicator
        animating={this.state.pages==null}
        style={[styles.centering, {height: 80}]}
        size="large"
        color="green"
      />
    );

    // console.log(this.props.statistics);

    var statistics = {
      likes: new Animated.Value(this.props.statistics[this.state.week].likes),
      reactions: new Animated.Value(this.props.statistics[this.state.week].reactions),
      comments: new Animated.Value(this.props.statistics[this.state.week].comments)
    }

    // console.log(statistics);
    var weekLabel = (this.state.week=='thisWeekSummary') ? "This Week" : "Past Week";
    var thisWeekStyle = (this.state.week=='thisWeekSummary') ? styles.weekButtonActive : styles.weekButtonInactive;
    var pastWeekStyle = (this.state.week=='pastWeekSummary') ? styles.weekButtonActive : styles.weekButtonInactive;

    return (
      <View style={styles.weekStatistics}>
        {/* <Text style={styles.weekLabel}>{weekLabel}</Text> */}
        <HorizontalBar max={this.props.max} label={'Likes'} count={statistics.likes} />
        <HorizontalBar max={this.props.max} label={'Reactions'} count={statistics.reactions} />
        <HorizontalBar max={this.props.max} label={'Comments'} count={statistics.comments} />
        <View>
          <Text style={styles.weekOptions}>
            <Text onPress={() => this.switchWeek('thisWeekSummary')} style={thisWeekStyle}>This Week</Text>
            <Text style={styles.weekOptionsSeperator}>{'    |    '}</Text>
            <Text onPress={() => this.switchWeek('pastWeekSummary')} style={pastWeekStyle}>Past Week</Text>
          </Text>
        </View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  weekLabel: {
    marginTop: 25,
    marginBottom: 10,
    paddingLeft: 10,
    fontSize: 18,
    fontWeight: 'bold'
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
