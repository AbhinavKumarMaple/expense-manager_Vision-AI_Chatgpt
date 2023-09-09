import {
  Image,
  Text,
  Box,
  ScrollView,
  Container,
  VStack,
  HStack,
  Center,
  Select,
  View,
} from 'native-base';
import {useState} from 'react';
import ProfilePic from '../../assets/expense-management/Screenbuttons.icon/ActiveProfileScreen-Languagebutton.icon(1).png';
import TabNavigation from '../../componenets/CurrencyScreen/TabNavigation';
import Add from '../../assets/expense-management/Screenbuttons.icon/Record_ScreenPlussign.icon.png';
import withAuthenticationValidation from '../utils/withAuthenticationValidation';

const Language = () => {
  const [selectedOptions, setSelectedOptions] = useState({
    currency: 'USD',
    decimalPoints: 2,
  });

  const languages = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    it: 'Italiano',
    ja: '日本語',
    zh: '中文',
    ko: '한국어',
    ru: 'Русский',
    ar: 'العربية',
    hi: 'हिन्दी',
    pt: 'Português',
  };

  const billItems = [
    {name: 'Groceries', amount: 50.75},
    {name: 'Restaurant', amount: 30.25},
    {name: 'Gasoline', amount: 40.0},
    {name: 'Clothing', amount: 75.5},
    {name: 'Electronics', amount: 150.0},
    {name: 'Utilities', amount: 80.0},
    {name: 'Medicine', amount: 15.75},
    {name: 'Entertainment', amount: 25.5},
    {name: 'Transportation', amount: 35.0},
    {name: 'Gifts', amount: 50.0},
  ];

  return (
    <Box flex="1" safeAreaTop p="5" height="100vm">
      <ScrollView height="2000vm" showsVerticalScrollIndicator={false}>
        <VStack
          //   bg="orange.400"
          //   justifyContent="space-between"
          alignItems="center"
          //   py={5}
          //   space={50}
          h="100%"
          w="100%">
          <Container justifyContent="center" alignItems="center">
            <Image source={ProfilePic} alt="Alternate Text" size="200" />
          </Container>
          <Box w="100%" flexDirection={'row'} alignItems={'center'}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} p={4}>
              {Object.keys(languages).map((languageCode, index) => (
                <HStack
                  width="auto"
                  //   bg="orange.400"
                  key={languageCode}
                  px={3}
                  py={2}
                  borderRadius={5}
                  borderColor="orange.400"
                  alignItems="center">
                  <Text fontSize={16} fontWeight="bold" mr={1}>
                    {languageCode}
                  </Text>
                </HStack>
              ))}
            </ScrollView>
            <Image source={Add} size="6" mx="2" />
          </Box>
          <VStack justifyContent={'flex-start'} w="100%">
            <Box pb="1">
              <Text fontSize={16} color="orange.400">
                Bill Type
              </Text>
            </Box>
            <Box
              bg="white"
              space={1}
              borderWidth="3"
              borderColor="orange.400"
              width={'100%'}
              // height="40%"
              direction={'row'}
              // bg="orange.400"
              alignItems={'flex-start'}>
              <Text
                px="3"
                variant="outline"
                maxWidth="90%"
                // width="auto"
                //   height="100%"
                placeholder="Outline"
                textAlign={'start'}
                fontSize="2xl"
                width="auto">
                Português
              </Text>
            </Box>
            <Box>
              {billItems.map((item, index) => (
                <VStack
                  key={index}
                  p={1}
                  borderColor="gray.300"
                  alignItems="flex-start">
                  <Text fontSize="sm" fontWeight="medium">
                    {item.name}
                  </Text>
                </VStack>
              ))}
            </Box>
          </VStack>
        </VStack>
      </ScrollView>
      <Box height="10%">
        <TabNavigation />
      </Box>
    </Box>
  );
};

export default withAuthenticationValidation(Language);
