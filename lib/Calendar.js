import React, { Component } from 'react';
import Calendar from 'react-native-calendar';
import {
  View,
} from 'react-native';

// var calendar = (() => {

//       if (this.state.showCalendar) return (
//         <View
//             flex={3}>
//           <Calendar
//             ref="calendar"
//             eventDates={['2016-07-03', '2016-07-05', '2016-07-28', '2016-07-30']}
//             events={[{date: '2016-07-04', hasEventCircle: {backgroundColor: 'powderblue'}}]}
//             scrollEnabled
//             showControls
//             titleFormat={'MMMM YYYY'}
//             prevButtonText={'Prev'}
//             nextButtonText={'Next'}
//             onDateSelect={(date) => this.setState({ selectedDate: dateFormat(date, 'm/d/yy'), showCalendar: false })}
//             onTouchPrev={(e) => console.log('onTouchPrev: ', e)}
//             onTouchNext={(e) => console.log('onTouchNext: ', e)}
//             onSwipePrev={(e) => console.log('onSwipePrev: ', e)}
//             onSwipeNext={(e) => console.log('onSwipeNext', e)}
//           />
//         </View>
//       )
//       else return (
//         <View style={testStyles.postView}>
//           {postImage}
//           <TextInput
//             style={testStyles.postInput}
//             placeholder="Your Text Here"
//             multiline={true}
//             onChangeText={(text) => this.setState({text})}/>
//         </View>)
//     })();

class EventCreationCalendar extends Component {
  render() {
    if (this.props.showCalendar) return (
      <View
          flex={3}>
        <Calendar
          ref="calendar"
          eventDates={['2016-07-03', '2016-07-05', '2016-07-28', '2016-07-30']}
          events={[{date: '2016-07-04', hasEventCircle: {backgroundColor: 'powderblue'}}]}
          scrollEnabled
          showControls
          titleFormat={'MMMM YYYY'}
          prevButtonText={'Prev'}
          nextButtonText={'Next'}
          onDateSelect={(date) => this.setState({ selectedDate: dateFormat(date, 'm/d/yy'), showCalendar: false })}
          onTouchPrev={(e) => console.log('onTouchPrev: ', e)}
          onTouchNext={(e) => console.log('onTouchNext: ', e)}
          onSwipePrev={(e) => console.log('onSwipePrev: ', e)}
          onSwipeNext={(e) => console.log('onSwipeNext', e)}
        />
      </View>
    )
    else return null;
  }
}

export { EventCreationCalendar }