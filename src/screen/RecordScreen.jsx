import {useState, useEffect} from 'react';
import {
  ScrollView,
  Input,
  HStack,
  Box,
  VStack,
  Text,
  Button,
  Pressable,
  Select,
  Spinner,
  Heading,
} from 'native-base';
import ImageGallery from '../../componenets/ImageGallery';
import firestore from '@react-native-firebase/firestore';
import Ads from '../../componenets/Ads';
import Tab from '../../componenets/Record/Tab';
import Menu from '../../assets/Record_Screen-BillType.icon.png';
import calendar from '../../assets/Record_Screen-BillDate.icon.png';
import Shop from '../../assets/Record_Screen-ShopName.icon.png';
import desc from '../../assets/Record_Screen-BillDetailsicon.png';
import Fork from '../../assets/expense-management/icons/112.png';
import withAuthenticationValidation from '../utils/withAuthenticationValidation';
import {firebase} from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import {useImageContext} from '../../componenets/ImageContext';
import DatePicker from 'react-native-date-picker';

//icon import
import {iconsList} from '../utils/IconsList';

//screen re-render
import {useIsFocused} from '@react-navigation/native';
import {
  Image,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import {VirtualizedList} from 'react-native';

const RecordScreen = ({navigation, route}) => {
  //default icon array size
  iconSize = 55;

  const {newScannedImages, setNewScannedImages} = useImageContext();
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoadingMore, setLoadingMore] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    route?.params?.CategoryName || 'Default Category',
  );
  //Menu Icons

  const [SelectedCategoryId, setSelectedCategoryId] = useState();
  const [SelectedIconName, setSelectedIconName] = useState(iconsList[1].Icon);
  //re-render
  const isFocused = useIsFocused();

  const scannedImages = newScannedImages;

  const user = firebase.auth().currentUser;
  // console.log('category :', categories[0]['categoryId']);
  useEffect(() => {
    fetchCategories();
  }, [isFocused]);

  //handle Category Selection from select:
  const handleCategorySelect = value => {
    // setSelectedCategory(value);
    console.log('record:', value);
    // Find the category object that matches the selected categoryName
    try {
      setSelectedCategory(value.categoryName);
      setSelectedCategoryId(value.categoryId);
      setSelectedIconName(iconsList[value.iconName].Icon);
    } catch (error) {}
  };

  //handle pagination:
  const fetchMoreCategories = async () => {
    if (lastVisible && !isLoadingMore) {
      setLoadingMore(true);

      try {
        const querySnapshot = await firestore()
          .collection('users')
          .doc(user.uid)
          .collection('categories')
          .orderBy('updatedAt')
          .startAfter(lastVisible)
          .limit(4)
          .get();

        if (querySnapshot.docs.length > 0) {
          const newCategoriesData = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              categoryName: data.categoryName,
              iconName: data.iconName,
              categoryId: doc.id,
            };
          });

          setCategories(prevCategories => [
            ...prevCategories,
            ...newCategoriesData,
          ]);

          const newLastVisible =
            querySnapshot.docs[querySnapshot.docs.length - 1];
          setLastVisible(newLastVisible);
        } else {
          setLastVisible(null);
        }

        setLoadingMore(false);
      } catch (error) {
        console.error('Error fetching more categories:', error);
        setLoadingMore(false);
      }
    }
  };

  //Fetch firestore data on Category
  const fetchCategories = async () => {
    try {
      const querySnapshot = await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('categories')
        .orderBy('updatedAt')
        .limit(14)
        .get();

      const categoriesData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          categoryName: data.categoryName,
          iconName: data.iconName,
          categoryId: doc.id,
        };
      });
      setCategories(categoriesData);
      if (querySnapshot.docs.length > 0) {
        const newLastVisible =
          querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastVisible(newLastVisible);
      } else {
        setLastVisible(null);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const [inputValues, setInputValues] = useState({
    amount: '',
    category: '',
    date: '',
    shopName: '',
    description: '',
  });

  const CategoryName = route?.params?.CategoryName || 'Default Category';
  // console.log('IconList:', iconsList[1].Icon);
  const handleUploadToFirestore = async () => {
    try {
      // Create a reference to Firebase Storage
      const storageRef = storage().ref();

      // Upload images to Firebase Storage and get their download URLs
      const imageUrls = [];
      for (const imageUri of scannedImages) {
        const imageName = imageUri.substring(imageUri.lastIndexOf('/') + 1);
        const imageRef = storageRef.child(`images/${user.uid}/${imageName}`);
        await imageRef.putFile(imageUri);
        const imageUrl = await imageRef.getDownloadURL();
        imageUrls.push(imageUrl);
      }

      const userRecordsRef = firestore()
        .collection('users')
        .doc(user.uid)
        .collection('records');

      await userRecordsRef.add({
        scannedImages: imageUrls,
        amount: inputValues.amount,
        category: [selectedCategory, SelectedCategoryId, SelectedIconName],
        date: inputValues.date,
        shopName: inputValues.shopName,
        description: inputValues.description,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        // Add other fields as needed
      });
      setNewScannedImages([]);
      setInputValues([]);
      console.log('Data uploaded successfully');

      navigation.navigate('HomeScreen');
      // You can also navigate or show a success message here
    } catch (error) {
      console.error('Error uploading data:', error);
      // Handle error here
    }
  };

  return (
    <Box p="3" justifyContent={'space-around'} height="100%" width="100%">
      <ScrollView w="100%">
        <VStack space={1} alignContent={'flex-start'} w={'100%'}>
          <ImageGallery />

          <Box
            space={1}
            bg="white"
            borderWidth="3"
            borderColor="orange.400"
            width={'100%'}
            direction={'row'}
            alignItems={'flex-end'}>
            <Input
              variant={'unstyled'}
              textAlign="right"
              width="auto"
              placeholder="123456789.9"
              fontSize="xl"
              value={inputValues.amount}
              onChangeText={amount => setInputValues({...inputValues, amount})}
            />
          </Box>

          <HStack
            alignItems={'center'}
            space="2"
            justifyItems={'space-between'}
            w="50%">
            <Pressable
              onPress={() => navigation.navigate('BillCreationComponent')}>
              <Image
                source={Menu}
                alt="Cetegory Select"
                style={{width: iconSize, height: iconSize}}
              />
            </Pressable>
            <Box
              space={2}
              bg="white"
              borderWidth="3"
              borderColor="orange.400"
              width={'100%'}
              direction={'row'}
              alignItems={'center'}>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  style={{
                    borderColor: selectedCategory ? 'orange' : 'gray',
                  }}>
                  <Text textAlign="center" width="auto" fontSize="xl">
                    {selectedCategory || 'Category'}
                  </Text>
                </TouchableOpacity>

                <Modal
                  visible={modalVisible}
                  transparent={true}
                  animationType="slide">
                  <TouchableWithoutFeedback
                    onPress={() => setModalVisible(false)}>
                    <View style={{flex: 1}}>
                      <View style={{flex: 1}} />
                      {/* Empty view for top half of screen */}
                      <View
                        style={{
                          flex: 1,
                          borderTopLeftRadius: 50,
                          borderTopRightRadius: 50,
                          backgroundColor: 'white',
                          shadowRadius: 2,
                          shadowOpacity: 10,
                          shadowColor: 'black',
                        }}>
                        <VirtualizedList
                          data={categories}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({item}) => (
                            <TouchableOpacity
                              onPress={() => handleCategorySelect(item)}>
                              <Text
                                style={{
                                  fontSize: 18,
                                  textAlign: 'center',
                                  paddingVertical: 10,
                                }}>
                                {item.categoryName}
                              </Text>
                            </TouchableOpacity>
                          )}
                          getItemCount={() => categories.length}
                          getItem={(data, index) => categories[index]}
                          ListFooterComponent={
                            isLoadingMore ? (
                              <Spinner
                                accessibilityLabel="Loading posts"
                                color="orange.400"
                              />
                            ) : null
                          }
                          onEndReached={fetchMoreCategories} // Manually trigger fetchMoreCategories
                          onEndReachedThreshold={0.2}
                        />
                        <TouchableOpacity
                          onPress={() => setModalVisible(false)}>
                          <Text
                            style={{
                              textAlign: 'center',
                              paddingVertical: 10,
                              fontSize: 18,
                              color: 'orange',
                            }}>
                            Cancel
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>
              </View>
            </Box>

            <Image
              shadow={2}
              source={SelectedIconName}
              alt="Cetegory Image"
              style={{width: iconSize, height: iconSize}}
            />
          </HStack>
          <HStack
            space={2}
            alignItems={'center'}
            justifyItems={'center'}
            // bgColor={'amber.300'}
          >
            <Image
              source={calendar}
              alt="profile image"
              style={{width: iconSize, height: iconSize}}
              resizeMode="center"
            />
            <Box
              space={1}
              bg="white"
              borderWidth="3"
              width={'50%'}
              borderColor="orange.400"
              // width={'auto'}
              direction={'row'}
              alignItems={'center'}>
              <DatePicker
                modal
                open={open}
                date={date}
                onConfirm={date => {
                  setInputValues({...inputValues, date});
                  setOpen(false);
                  setDate(date);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />

              <Pressable onPress={() => setOpen(true)}>
                <Text
                  // maxWidth="90%"
                  textAlign="center"
                  width="auto"
                  placeholder="DATE"
                  fontSize="xl"
                  // onChangeText={date => setInputValues({...inputValues, date})}
                >
                  {inputValues.date
                    ? inputValues.date.toLocaleDateString()
                    : 'Default Date'}
                </Text>
              </Pressable>
            </Box>
          </HStack>
          <HStack space={2} alignItems={'center'} justifyItems={'center'}>
            <Image
              shadow={2}
              source={Shop}
              alt="profile image"
              style={{width: iconSize, height: iconSize}}
            />
            <Box
              space={1}
              bg="white"
              borderWidth="3"
              borderColor="orange.400"
              width={'80%'}
              direction={'row'}
              alignItems={'center'}>
              <Input
                variant={'unstyled'}
                alt="show name"
                // maxWidth="90%"
                textAlign="left"
                width="auto"
                placeholder="show name"
                fontSize="xl"
                value={inputValues.shopName}
                onChangeText={shopName =>
                  setInputValues({...inputValues, shopName})
                }
              />
            </Box>
          </HStack>
          <HStack
            space={2}
            direction={'row'}
            alignItems={'center'}
            justifyItems={'center'}>
            <Image
              shadow={2}
              source={desc}
              alt="profile image"
              style={{width: iconSize, height: iconSize}}
              resizeMode="cover"
            />
            <Box
              space={1}
              bg="white"
              borderWidth="3"
              borderColor="orange.400"
              width={'80%'}
              height={'auto'}
              direction={'row'}
              alignItems={'center'}>
              <Input
                variant="unstyled"
                placeholder="Description"
                value={inputValues.description}
                onChangeText={description =>
                  setInputValues({...inputValues, description})
                }
                fontSize="xl"
              />
            </Box>
          </HStack>
          {/* <Button onPress={handleUploadToFirestore}>Upload to Firestore</Button> */}
        </VStack>
      </ScrollView>
      <Box height={'12%'}>
        <Ads />
      </Box>
      <Box width={'100%'}>
        <Tab HandleSubmit={handleUploadToFirestore} />
      </Box>
    </Box>
  );
};

export default withAuthenticationValidation(RecordScreen);
