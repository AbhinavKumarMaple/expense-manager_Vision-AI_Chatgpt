import React, {useState, useEffect} from 'react';
import {Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute} from '@react-navigation/native';
import {Select, Pressable, Box, Text, ScrollView} from 'native-base';
import {iconsList} from '../utils/IconsList';
import {useNavigation} from '@react-navigation/native'; // Import the hook
import withAuthenticationValidation from '../utils/withAuthenticationValidation';
//firebase
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/auth';

const BillCreationComponent = () => {
  const navigation = useNavigation();
  const DefaultIcon = require('../../assets/expense-management/Screenbuttons.icon/Record_Screen-BillType.icon.png');
  const Add = require('../../assets/expense-management/Screenbuttons.icon/Record_ScreenPlussign.icon.png');

  const [selectedIcon, setSelectedIcon] = useState(null);
  const [selectedBillType, setSelectedBillType] = useState('');
  const [existingBills, setExistingBills] = useState([]);

  //Image Lazy Load

  const [currentIndex, setCurrentIndex] = useState(0);

  const route = useRoute();
  const defaultIconUrl = route.params?.defaultIcon || null;
  const defaultBillType = route.params?.defaultBillType || '';
  //fetch userId
  const user = firebase.auth().currentUser;

  useEffect(() => {
    if (defaultIconUrl) {
      setSelectedIcon({uri: defaultIconUrl});
    }
    if (defaultBillType) {
      setSelectedBillType(defaultBillType);
    }

    //Image Lzy Loading
    if (currentIndex < iconsList.length - 1 && currentIndex < 60) {
      const timer = setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 1); // Adjust the delay to your preference

      return () => clearTimeout(timer);
    }
  }, [defaultIconUrl, defaultBillType, currentIndex]);

  const handleIconChange = icon => {
    setSelectedIcon(icon);
  };

  const handleSubmit = async () => {
    if (!selectedBillType) {
      return console.log('please select Bill Type');
    }
    if (!selectedIcon) {
      return console.log('please select an Icon');
    }
    try {
      const categoryData = {
        categoryName: selectedBillType,
        iconName: selectedIcon - 29,
        userId: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      const newCategoryRef = await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('categories')
        .add(categoryData);

      const newCategoryId = newCategoryRef.id; // Get the ID of the newly created document

      navigation.setParams({
        CategoryName: selectedBillType,
        CategoryId: newCategoryId,
        CategoryIcon: selectedIcon,
      });

      console.log('Category created successfully');
      setSelectedBillType('');
      setSelectedIcon('');
      // navigate Back
      navigation.goBack();
    } catch (error) {
      console.error('Error creating category:', error);
      // Handle error here
    }
  };

  return (
    <Box flex={1} p={2} safeAreaTop="5">
      {/* Big icon at the top */}
      <Box alignItems="center" mb={2}>
        {/* {console.log(DefaultIcon)} */}
        <Image
          source={selectedIcon || DefaultIcon}
          style={{width: 160, height: 160}}
          alt={'Selected Icon'}
        />
        <Pressable
          onPress={() => handleSubmit()}
          justifyContent={'flex-start'}
          alignItems={'flex-end'}
          w="100%"
          px="8"
          m="8">
          <Image
            source={Add}
            style={{width: 40, height: 40}}
            alt={'Selected Icon'}
          />
        </Pressable>
      </Box>

      {/* Select bill type */}
      <Pressable
        onPress={() => navigation.navigate('BillType', {selectedBillType})}
        bg="gray.100"
        _pressed={{bg: 'gray.200'}}
        _text={{fontSize: 30}}
        py={3}
        mb={2}>
        <Text>{selectedBillType || 'Select Bill Type'}</Text>
      </Pressable>

      {/* Change icon */}

      <Text fontSize="xl">Bill Type</Text>
      <ScrollView>
        <Box
          justifyContent={'flex-start'}
          flexDirection="row"
          flexWrap={'wrap'}
          flex="1"
          w="100%"
          bg="white"
          p="1"
          alignItem="center">
          {iconsList.slice(0, currentIndex + 1).map((icon, index) => (
            <Pressable
              key={index}
              onPress={() => handleIconChange(icon.Icon)}
              bgColor={'gray.200'}
              m="1"
              flexDirection="row">
              <Image
                source={icon.Icon}
                style={{width: 32, height: 32}}
                alt={`options ${index}`}
              />
            </Pressable>
          ))}
        </Box>
      </ScrollView>
    </Box>
  );
};

export default withAuthenticationValidation(BillCreationComponent);
