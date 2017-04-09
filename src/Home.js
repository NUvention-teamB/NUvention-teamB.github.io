import React, { Component } from 'react'
import { View, Text, StyleSheet} from 'react-native'

export default class Login extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <View>
        
      </View>
    )
    let logo = {
      uri: 'https://scontent-ord1-1.xx.fbcdn.net/v/t34.0-12/17198497_10203158694926222_604100444_n.png?oh=51e9ca9e171b2b29397803c3d238c26a&oe=58C093B2'
    }

    var postPart = (() => {
      if (this.state.showCalendar) return (
        <EventCreationCalendar showCalendar={this.state.showCalendar}/>
      )
      else return (
        <View style={styles.postView}>
          {PostImage}
          <TextInput
            style={styles.postInput}
            placeholder="Your Text Here"
            multiline={true}
            onChangeText={(text) => this.setState({text})}/>
        </View>)
    })();

    return (
      <View style={styles.container}>
        <View style={styles.statusBar}>
        </View>
        <View style={styles.header}>
          <View style={styles.setWidth}></View>
          <Image source={logo} style={styles.logo}/>
          <TouchableOpacity
              onPress={this.submitPost.bind(this)}>
            <View
                style={styles.setWidth}>
              <Text
                  style={styles.postButton}>
                Post
              </Text>
            </View>
          </TouchableOpacity>
        </View>
          {postPart}
        <View
            style={styles.captionSection}>
          <Text
              style={(this.state.postTime == 'smart' || this.state.postTime == 'later') ? styles.captionTextActive : styles.captionText}>
            The best time to post is {this.state.selectedDate} at 6:13pm.
          </Text>
        </View>
        <View style={styles.timeViewSection}>
          <TouchableOpacity
              onPress={()=>{this.setState({postTime: 'now', showCalendar: false}); console.log(this.state.postTime == 'now')}}>
            <View
                style={(this.state.postTime == 'now') ? styles.timeViewActive : styles.timeView}>
              <Text
                  style={(this.state.postTime == 'now') ? styles.timeTextActive : styles.timeText}>
                Post Now
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={()=>{this.setState({postTime: 'smart', showCalendar: false, selectedDate: 'Today'}); console.log(this.state.postTime == 'now')}}>
            <View
                style={(this.state.postTime == 'smart') ? styles.timeViewActive : styles.timeView}>
              <Text
                  style={(this.state.postTime == 'smart') ? styles.timeTextActive : styles.timeText}>
                Smart Post
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={this.openCalendar.bind(this)}>
            <View
                style={(this.state.postTime == 'later') ? styles.timeViewActive : styles.timeView}>
              <Text
                  style={(this.state.postTime == 'later') ? styles.timeTextActive : styles.timeText}>
                Post Later
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.socialView}>
          <TouchableOpacity
              onPress={()=>{this.setState({facebookToggle: !this.state.facebookToggle});}}>
            <View
                style={styles.socialMediaToggles}
                borderColor={this.state.facebookToggle ? this.state.green : this.state.black}>
              <Icon
                  color={this.state.facebookToggle ? this.state.green : this.state.black}
                  size={ 30 }
                  name="facebook"/>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={()=>{this.setState({instagramToggle: !this.state.instagramToggle});}}>
            <View
                style={styles.socialMediaToggles}
                borderColor={this.state.instagramToggle ? this.state.green : this.state.black}>
              <Icon
                  color={this.state.instagramToggle ? this.state.green : this.state.black}
                  size={ 30 }
                  name="instagram"/>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={()=>{this.setState({twitterToggle: !this.state.twitterToggle});}}>
            <View
                style={styles.socialMediaToggles}
                borderColor={this.state.twitterToggle ? this.state.green : this.state.black}>
              <Icon
                  color={this.state.twitterToggle ? this.state.green : this.state.black}
                  size={ 30 }
                  name="twitter"/>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  statusBar: {
    height:20,
  },
  header: {
    height: 60,
    backgroundColor: '#97e1d0',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#A6A6A6',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    padding: 5,
  },
  logo: {
    height: 60,
    width: 200,
  },
  setWidth: {
    width: 60,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  postButton: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  postView: {
    backgroundColor: '#FDFDFD',
    flex: 3,
  },
  postInput: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 20,
  },
  headerText: {
    fontSize: 30,
  },
  captionSection: {
    alignItems: 'center',
  },
  captionTextActive: {
    color: '#ADADAD',
  },
  captionText: {
    color: '#FFFFFF',
  },
  timeViewSection: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  timeView: {
    borderWidth: 1,
    width: 100,
    padding: 10,
    borderRadius: 10,
  },
  timeViewActive: {
    borderWidth: 1,
    width: 100,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#97e1d0'
  },
  timeTextActive: {
    color: '#FFFFFF'
  },
  socialView: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  socialMediaToggles: {
    padding: 10,
    width: 50,
    margin: 10,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: 'center',
  },
});
