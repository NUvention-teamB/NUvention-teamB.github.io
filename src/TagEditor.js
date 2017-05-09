import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet, Button, ListView, TouchableOpacity, DatePickerIOS } from 'react-native'
import { Actions } from 'react-native-router-flux';
import Colors from '../data/Colors';
import Hr from 'react-native-hr';

export default class Caption extends Component {
  constructor(props) {
    super(props);

    this.onChangeText = this.onChangeText.bind(this);
    this.returnToCaption = this.returnToCaption.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.returnDate = this.returnDate.bind(this);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      tag: this.props.data,
      ds: ds,
      date: new Date(),
      data: {
        'location': {
          question: 'What location would you like?',
          options: [
            '555 Clark St',
            '555 Clark St. Evanston, IL'
          ]
        },
        'product': {
          question: 'What product would you like?',
          options: [
            'Frappe',
            'Latte'
          ]
        }
      }
    };

  }

  returnToCaption(option) {
    Actions.pop({refresh: {option:option, tagIndex: this.props.tagIndex, id: this.props.id}})
  }

  onChangeText(text) {
    this.setState({text})
  }

  renderRow(rowData) {
    return (
      <View marginBottom={20}>
        <TouchableOpacity
          onPress={()=>{this.returnToCaption(rowData)}}
          style={styles.listElement}>
          <Text
            style={styles.listText}>
            {rowData}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  onDateChange(date){
    this.setState({date: date});
  }

  returnDate() {
    var temp;
    if (this.state.date == null) {
      temp = '[time]'
    } else {
      temp = this.state.date.getHours() + ':' + this.state.date.getMinutes();
    }
    this.returnToCaption(temp);
  }

  render() {
    var render = (() => {
      if (this.props.tag == 'time') {
        return (
          <View style={styles.container}>
            <DatePickerIOS
              date={this.state.date}
              mode="time"
              timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
              onDateChange={this.onDateChange}
            />
            <Button
            title="Done"
            onPress={this.returnDate} />
          </View>
        )
      } else {
        return (
          <View style={styles.container}>
            <View style={styles.headerRow}>
              <Text style={styles.headerText}>{this.state.data[this.props.tag].question}</Text>
            </View>
            <Hr lineColor={Colors.gray} />
            <ListView
              dataSource={this.state.ds.cloneWithRows(this.state.data[this.props.tag].options)}
              renderRow={this.renderRow}
            />
          </View>
        )
      }
    })();

    return (
      <View>
        {render}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 65,
  },
  headerRow: {
    flexDirection: 'row',
    margin: 10,
  },
  headerText: {
    fontSize: 20,
    color: Colors.blue,
  },
  listElement: {
    backgroundColor: Colors.lightBlue,
    margin: 10,
    borderRadius: 10,
  },
  listText: {
    margin: 10
  },
  postInput: {
    height: 100,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 20,
  },
});
