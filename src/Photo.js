import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Image, CameraRoll, TouchableHighlight, ScrollView, TouchableOpacity } from 'react-native'
import { Actions } from 'react-native-router-flux';
import ImagePicker from 'react-native-image-picker';
import CreatePostNavBar from './CreatePostNavBar';
import Suggestions from './Suggestions';
import Swiper from 'react-native-swiper';
import Colors from '../data/Colors';

export default class Photo extends Component {
  constructor(props) {
    super(props);

    this.goToNext = this.goToNext.bind(this);
    this.noPhoto = this.noPhoto.bind(this);
    this.storeImages = this.storeImages.bind(this);
    this.updateImage = this.updateImage.bind(this);
    this.updateImageFunction = this.updateImageFunction.bind(this);

    this.state = {
      images: [],
      imageDisplay: [],
    }
  }

  componentWillMount() {
    var that = this;
    const fetchParams: Object = {
      first: 16,
      groupTypes: 'All',

    };
    CameraRoll.getPhotos(fetchParams)
      .then(that.storeImages)
      .catch(this.logImageError);
  }

  storeImages(data) {
    const assets = data.edges;
    const images = assets.map( asset => asset.node.image );
    const imageDisplay = []
    for (i = 0 ; i <images.length ; i+= 4) {
      imageDisplay.push(images.slice(i, Math.min(i + 4, images.length)));
    }
    var postImage = null
    if (images.length != 0) {
      postImage = {uri: images[0].uri};
    }
    this.setState({
        images: images,
        imageDisplay: imageDisplay,
        postImage: postImage,
    });
    this.props.updateImage(postImage);
  }

  logImageError(err) {
    console.log(err);
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
        // this.props.uploadPhoto(source);
        this.props.updateImage(source);
      }
    });
  }

  updateImage(source) {
    this.setState({postImage: source});
    this.props.updateImage(source);
  }

  updateImageFunction(source) {
    return (source) => {
      this.updateImage(source);
    }
  }

  goToNext() {
    this.props.nextScreen();
  }

  noPhoto() {
    // this.props.uploadPhoto(null);
    this.props.updateImage(null);
  }

  // renderRow(imageSet, index) {
  //   var output = [];
  //   var image = null;
  //   for (i = 0 ; i < 4 ; i++) {
  //     if (i < imageSet.length) {
  //       image = imageSet[i];
  //       output.push(
  //         <TouchableOpacity
  //           onPress={this.updateImageFunction({uri: image.uri})}
  //           key={'touch'+index*4 + i}>
  //           <Image 
  //             style={styles.image} 
  //             key={index*4 + i} 
  //             source={{ uri: image.uri }} />
  //         </TouchableOpacity>
  //       );
  //     } else {
  //       output.push(
  //         <View
  //           style={styles.image}
  //           key={index*4 + i}>
  //         </View>
  //       )
  //     }
  //   }
  //   return output;
  // }

  render() {
    // var addPhotoBtn = (() => {
    //   return (
    //     <TouchableHighlight onPress={this.addImage.bind(this)} underlayColor={Colors.blue}>
    //       <View style={styles.addPhotoBtn}>
    //         <Text style={styles.addPhotoBtnText}>Add a photo</Text>
    //       </View>
    //     </TouchableHighlight>
    //   )
    // })();

    // var postImage = (() => {
    //   if (this.props.postImage==null) return (
    //     <View>
    //       {addPhotoBtn}
    //     </View>
    //   )
    //   else return (
    //     <View>
    //       <Image source={this.props.postImage} style={styles.postImage}/>
    //       {addPhotoBtn}
    //     </View>
    //   )
    // })();

    var image = (() => {
      if (this.props.postImage != null) {
        return (
          <Image source={this.props.postImage} style={styles.postImage}/>
        );
      } else {
        console.log('in here');
        return (
          <View style={styles.postImage}>
            <View>
              <Text style={styles.postImageText}>No Photo</Text>
            </View>
          </View>
        )
      }
    })();

    return (
      <View style={styles.container}>
        <CreatePostNavBar onPress={this.goToNext} text='Continue'></CreatePostNavBar>
        {image}
        <View style={styles.headerView}>
          <Text style={styles.headerText}>
            Your Photos
          </Text>
        </View>
        <ScrollView style={styles.imageScrollContainer}>
          <View style={styles.imageGrid}>
            { 
              this.state.imageDisplay.map((imageSet, index) => {
                return(
                  <View style={styles.imageRow} key={'view'+ index}>
                      {
                        imageSet.map((image, innerIndex) => {
                          return (
                            <TouchableOpacity
                              key={'touch' + index*4 + innerIndex} 
                              onPress={() => {this.updateImage({uri: image.uri})}}>
                              <Image 
                                style={styles.image} 
                                key={index*4 + innerIndex} 
                                source={{ uri: image.uri }} />
                            </TouchableOpacity>
                          )
                        })
                      }
                  </View>
                )
              })
            }
          </View>
        </ScrollView>
        <TouchableOpacity onPress={() => {this.updateImage(null)}}>
          <View style={styles.buttonView}>
            <Text style={styles.buttonText}>No Photo</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.addImage.bind(this)}>
          <View style={styles.buttonView}>
            <Text style={styles.buttonText}>Other Photos</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={styles.progress}></View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postImage: {
    height: 180,
    width: '100%',
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postImageText: {
    fontSize: 30,
    color: Colors.gray,
  },
  headerView: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    marginTop: 10,
  },
  headerText: {
    color: Colors.gray,
  },
  buttonHolder: {
    flexDirection: 'row',
  },
  buttonView: {
    backgroundColor: Colors.blue,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '60%',
    padding: 15,
    marginBottom: 20,
    borderRadius: 20,
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowColor: 'darkblue',
    shadowOffset: {
      top: 1
    },
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
  imageScrollContainer: {
    flex: 1,
  },
  imageGrid: {
    width: '100%',
    flex: 1,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    margin: 10,
    marginTop: 0,
  },
  image: {
    height: 80,
    width: 80,
    marginLeft: 5,
    marginRight: 5,
  },
  progressBar: {
    marginTop: 'auto',
    height: 5,
    flexDirection: 'row',
  },
  progress: {
    width: '25%',
    backgroundColor: Colors.blue,
  },
});
                      // imageSet.map((image, innerIndex) => {
                      //   return (
                      //     <TouchableOpacity
                      //       onPress={() => {this.updateImage({uri: image.uri})}}>
                      //       <Image 
                      //         style={styles.image} 
                      //         key={index*4 + innerIndex} 
                      //         source={{ uri: image.uri }} />
                      //     </TouchableOpacity>
                      //   )
                      // })

                    //   var output = [];
                    //   var image = null;
                    //   for (i = 0 ; i < 4 ; i++) {
                    //     console.log('for');
                    //     console.log(i);
                    //     console.log(imageSet.length);;
                    //     if (i < imageSet.length) {
                    //       image = imageSet[i];
                    //       output.push(
                    //         <TouchableOpacity
                    //           onPress={() => {this.updateImage({uri: image.uri})}}>
                    //           <Image 
                    //             style={styles.image} 
                    //             key={index*4 + i} 
                    //             source={{ uri: image.uri }} />
                    //         </TouchableOpacity>
                    //       );
                    //     } else {
                    //       output.push(
                    //         <View
                    //           style={styles.image}
                    //           key={index*4 + i}>
                    //         </View>
                    //       )
                    //     }
                    //   }
                    //   console.log('here');
                    //   console.log(imageSet);
                    //   console.log(output);
                    //   return output;