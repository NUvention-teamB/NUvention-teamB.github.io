import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet, Button, Image, CameraRoll, TouchableHighlight } from 'react-native'
import { Actions } from 'react-native-router-flux';
import ImagePicker from 'react-native-image-picker'
import Suggestions from './Suggestions'
import Swiper from 'react-native-swiper'

export default class Photo extends Component {
  constructor(props) {
    super(props);

    this.goToNext = this.goToNext.bind(this);
    this.noPhoto = this.noPhoto.bind(this);

    console.log('POST in Photo:', this.props.post);
    const fetchParams: Object = {
      first: 10,
    };
    // const data = await CameraRoll.getPhotos(fetchParams);
    // console.log('data' + data);
    this.state = {

    }
  }

  addImage() {
    console.log('AddImage');
    var options = {
      title: 'Add a photo for your post',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // console.log('IMAGE DATA:')
        // console.log(response.data);
        let source = { uri: response.uri };

        // You can also display the image using data:
        let imageData = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          imageData: imageData,
          postImage: source
        });
        this.props.uploadPhoto(source);
        this.goToNext();
      }
    });
  }

  goToNext() {
    this.props.nextScreen();
  }

  noPhoto() {
    this.props.uploadPhoto(null);
    this.goToNext();
  }

  render() {

    var addPhotoBtn = (() => {
      return (
        <TouchableHighlight onPress={this.addImage.bind(this)} underlayColor="#00b0ff">
          <View style={styles.addPhotoBtn}>
            <Text style={styles.addPhotoBtnText}>Add a photo</Text>
          </View>
        </TouchableHighlight>
      )
    })();

    var postImage = (() => {
      if (this.props.postImage==null) return (
        <View>
          {addPhotoBtn}
        </View>
      )
      else return (
        <View>
          <Image source={this.props.postImage} style={styles.postImage}/>
          {addPhotoBtn}
        </View>
      )
    })();

    return (
      <View style={styles.container}>
        {postImage}
        <Button
          title="Or continue without a photo... >"
          onPress={this.noPhoto}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60
  },
  postImage: {
    height: 180,
    width: '100%',
  },
  addPhotoBtn: {
    backgroundColor: '#00b0ff',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 30,
    marginBottom: 20,
    width: '60%',
    padding: 15,
    borderRadius: 20,
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowColor: 'darkblue',
    shadowOffset: {
      top: 1
    },
  },
  addPhotoBtnText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,

  },
});
