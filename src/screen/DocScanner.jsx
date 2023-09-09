import React, {useEffect, useState} from 'react';
import {
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import DocumentScanner from 'react-native-document-scanner-plugin';
import RNFS from 'react-native-fs';
import {useNavigation} from '@react-navigation/native';

import ImageCropPicker from 'react-native-image-crop-picker';
import {useImageContext} from '../../componenets/ImageContext';
import {Box, Center, Image, Text} from 'native-base';
import withAuthenticationValidation from '../utils/withAuthenticationValidation';
import TabNavigation from '../../componenets/HomeScreen/TabNavigation';

//Icons
import Camera from '../../assets/expense-management/Screenbuttons.icon/E&BLogoOrageTransparentBG.png';
import AddImage from '../../assets/expense-management/Screenbuttons.icon/Record_ScreenPlussign.icon.png';
const DocScanner = () => {
  const {newScannedImages, setNewScannedImages} = useImageContext();
  const navigation = useNavigation();

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission granted');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleScanDocument = async () => {
    try {
      const {scannedImages} = await DocumentScanner.scanDocument();
      console.log(scannedImages);
      setNewScannedImages([...newScannedImages, ...scannedImages]);
      navigation.navigate('RecordScreen');
    } catch (error) {
      console.log(error + 'HandleScanDocument');
    }
  };

  const handlePickImage = () => {
    ImageCropPicker.openPicker({
      mediaType: 'photo',
    })
      .then(response => {
        if (!response.didCancel) {
          setNewScannedImages([...newScannedImages, response.path]);
          navigation.navigate('RecordScreen');
        }
      })
      .catch(error => {
        console.log('Image picking error:', error);
      });
  };

  return (
    <Center
      justifyContent={'space-between'}
      itemAlign="center"
      h="100%"
      // bg="amber.400"
    >
      <Box
        justifyContent={'space-evenly'}
        h="80%"
        safeAreaTop="10"
        alignItems={'center'}>
        <TouchableOpacity onPress={handleScanDocument} itemAlign="center">
          <Image source={Camera} alt="Alternate Text" size="xl" />
          <Text fontSize="xl" textAlign={'center'}>
            Scan Document
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePickImage} itemAlign="center">
          <Image source={AddImage} alt="Alternate Text" size="xl" />
          <Text fontSize="xl" textAlign={'center'}>
            Add Image
          </Text>
        </TouchableOpacity>
      </Box>
      <TabNavigation />
    </Center>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5FCFF',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     paddingTop: 40,
//     paddingBottom: 20,
//     backgroundColor: '#007AFF',
//   },
//   imageContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     padding: 5,
//   },
//   scannedImage: {
//     width: 120,
//     height: 160,
//     margin: 5,
//   },
//   saveButton: {
//     backgroundColor: '#007AFF',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     alignSelf: 'center',
//     marginTop: 20,
//   },
//   saveButtonText: {
//     color: '#FFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   deleteButton: {
//     backgroundColor: '#FF0000',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     alignSelf: 'center',
//     marginTop: 10,
//   },
//   deleteButtonText: {
//     color: '#FFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

export default withAuthenticationValidation(DocScanner);
