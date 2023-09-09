import React from 'react';
import {View, ScrollView, Image, Text} from 'native-base';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useImageContext} from '../componenets/ImageContext';

const ImageGallery = () => {
  const {newScannedImages, setNewScannedImages} = useImageContext();
  const navigation = useNavigation();

  const handleImagePress = uri => {
    // Navigate to a new screen to show the image in full size
    navigation.navigate('ImageDetailScreen', {imageUri: uri});
  };

  const onAddImage = () => {
    navigation.navigate('DocScanner');
  };

  return (
    <View>
      <ScrollView horizontal>
        {newScannedImages.map((uri, index) => (
          <TouchableOpacity key={index} onPress={() => handleImagePress(uri)}>
            <Image
              borderColor={'orange.400'}
              borderWidth="3"
              source={{uri}}
              alt={`Image ${index}`}
              style={{
                width: 120,
                height: 160,
                marginHorizontal: 5,
                marginBottom: 10,
              }}
            />
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={onAddImage}>
          <View
            style={{
              width: 120,
              height: 160,
              marginHorizontal: 5,
              marginBottom: 10,
              backgroundColor: 'lightgray',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 30}}>+</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ImageGallery;
