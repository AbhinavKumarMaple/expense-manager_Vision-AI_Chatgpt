import React, {useState, useEffect} from 'react';
import {
  View,
  HStack,
  Pressable,
  Text,
  IconButton,
  Skeleton,
  Center,
  VStack,
  Spinner,
} from 'native-base';

import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/auth';
import {ScrollView} from 'react-native';
import {Image} from 'react-native';

//icon List
import {iconsList} from '../../src/utils/IconsList';

const ItemsPerPage = 8;

const Bills = ({selectedFilter}) => {
  const user = firebase.auth().currentUser;
  const [data, setData] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, [selectedFilter]);

  const fetchInitialData = async () => {
    setIsLoading(true);

    try {
      let query = firestore()
        .collection('users')
        .doc(user.uid)
        .collection('records')
        .limit(ItemsPerPage);

      if (selectedFilter) {
        query = query.where('category', '==', selectedFilter);
      }

      const querySnapshot = await query.get();

      const records = querySnapshot.docs.map(doc => doc.data());
      setData(records);

      if (querySnapshot.docs.length > 0) {
        const lastVisibleDoc =
          querySnapshot.docs[querySnapshot.docs.length - 1];
        // console.log('Last visible document:', lastVisibleDoc.data());
        setLastVisible(lastVisibleDoc);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  const fetchMoreData = async (filter = null) => {
    setIsLoading(true);
  
    try {
      if (lastVisible) {
        let query = firestore()
          .collection('users')
          .doc(user.uid)
          .collection('records')
          .startAfter(lastVisible)
          .limit(ItemsPerPage);
  
        if (filter) {
          query = query.where('category', '==', filter);
        } else if (selectedFilter) {
          query = query.where('category', '==', selectedFilter);
        }
  
        const querySnapshot = await query.get();
  
        if (!querySnapshot.empty) {
          const newRecords = querySnapshot.docs.map(doc => doc.data());
          setData(prevData => [...prevData, ...newRecords]);
  
          const newLastVisible =
            querySnapshot.docs[querySnapshot.docs.length - 1];
          // console.log('visible', newLastVisible);
          setLastVisible(newLastVisible);
        } else {
          setLastVisible(null);
        }
      }
  
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching more data:', error);
      setIsLoading(false);
    }
  };
  

  const navigation = useNavigation();

  const handleScrollEnd = ({nativeEvent}) => {
    const offsetY = nativeEvent.contentOffset.y;
    const contentHeight = nativeEvent.contentSize.height;
    const visibleHeight = nativeEvent.layoutMeasurement.height;

    if (offsetY + visibleHeight >= contentHeight) {
      fetchMoreData();
    }
  };

  return (
    <View flex={1}>
      <View w="100%" p={1}>
        <ScrollView onScrollEndDrag={handleScrollEnd}>
          {data.map((record, index) => (
            <HStack
              key={index}
              justifyContent="space-between"
              alignItems="center"
              w="100%">
              <Image
                source={
                  record.category
                    ? iconsList[record.category[2] - 26].Icon
                    : iconsList[2].Icon
                }
                style={{width: 50, height: 50}}
                alt={`Image ${index}`}
                key={`Image ${index}`}
              />
              <Pressable
                onPress={() => navigation.navigate('RecordScreen', {record})}
                flex="1"
                justifyContent="space-between"
                flexDirection="row"
                borderColor="orange.400"
                borderWidth="3"
                m="2"
                p="1">
                <Text fontSize="2xl">{`${record.shopName} `}</Text>
                <Text fontSize="2xl">{`: ${record.amount}`}</Text>
              </Pressable>
            </HStack>
          ))}
          {isLoading && (
            <View>
              <Spinner accessibilityLabel="Loading posts" color="orange.400" />
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default Bills;
