import { Box, HStack, Pressable, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { FilterIcons } from '../../src/utils/IconsList.js';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/auth';

const FilterCategory = ({ updateFilter }) => {
  const [mostUsedIcons, setMostUsedIcons] = useState([]);

//get current user
 const user = firebase.auth().currentUser;


 useEffect(() => {
  fetchMostUsedIcons();
}, []);

const fetchMostUsedIcons = async () => {
  try {
    const querySnapshot = await firestore()
      .collection('users')
      .doc(user.uid)
      .collection('records')
      .get();

    const iconNameCounts = {};

    querySnapshot.forEach((doc) => {
      const { category } = doc.data();
      const iconName = category ? category.name : null;

      if (iconName) {
        iconNameCounts[iconName] = (iconNameCounts[iconName] || 0) + 1;
      }
    });

    const iconNameCountArray = Object.keys(iconNameCounts).map((iconName) => ({
      iconName,
      count: iconNameCounts[iconName],
    }));

    iconNameCountArray.sort((a, b) => b.count - a.count);

    const top5Icons = iconNameCountArray.slice(0, 5).map((item) => item.iconName);

    setMostUsedIcons(top5Icons);
  } catch (error) {
    console.error('Error fetching most used icons:', error);
  }
};


  return (
    <Box bg="amber.400" w="100%">
      <HStack justifyContent="space-between">
        {/* {FilterIcons.map((icon, index) => (
          <Pressable key={index} onPress={() => updateFilter(icon)}>
            <Image source={icon.Icon} style={{ width: 55, height: 55 }} />
          </Pressable>
        ))} */}
        {mostUsedIcons.map((iconName, index) => (
          <Pressable key={index} onPress={() => updateFilter({ iconName })}>
            {/* You might need to replace 'ImageSourceForIconName' with your actual logic */}
            <Image source={ImageSourceForIconName(iconName)} style={{ width: 55, height: 55 }} />
          </Pressable>
        ))}
      </HStack>
    </Box>
  );
};

export default FilterCategory;
