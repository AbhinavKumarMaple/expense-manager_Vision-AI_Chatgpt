import {
  Image,
  Text,
  Box,
  ScrollView,
  Container,
  VStack,
  Pressable,
  HStack,
} from 'native-base';
import ProfilePic from '../../assets/expense-management/Screenbuttons.icon/ProfileButton-WhiteBG.png';
import ProfileScreenUpdateCheckbutton from '../../assets/expense-management/Screenbuttons.icon/ProfileScreen-UpdateCheckbutton.icon.png';
import ProfileScreenLanguage from '../../assets/expense-management/Screenbuttons.icon/ProfileScreen-Languagebutton.icon.png';
import ProfileCurrency from '../../assets/expense-management/Screenbuttons.icon/ProfileScreen-Currency.icon.png';
import ProfileScreenBill from '../../assets/expense-management/Screenbuttons.icon/ProfileScreen-BillType.icon.png';
import ProfileScreenBack from '../../assets/expense-management/Screenbuttons.icon/ProfileButton-WhiteBG.png';

import {useNavigation} from '@react-navigation/native'; // Import the hook
import TabNavigation from '../../componenets/Profile/TabNavigation';
import withAuthenticationValidation from '../utils/withAuthenticationValidation';
import auth from '@react-native-firebase/auth';
const buttons = [ProfileScreenBill, ProfileCurrency, ProfileScreenLanguage];
const name = 'David Letterman';
const Email = 'david@letterman.com.hk';
const version = 'v.1.0.0';
const date = '2021/04/22';

const ProfileScreen = ({navigation}) => {
  //Logout user
  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        navigation.replace('SignIn');
      });

    console.log('User signed out successfully');
  };

  return (
    <Box flex="1" safeAreaTop>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <VStack
          justifyContent="space-between"
          alignItems="center"
          py={5}
          space={50}
          h="100%"
          w="100%">
          <Container justifyContent="center" alignItems="center">
            <Pressable onPress={handleLogout}>
              <Image source={ProfilePic} alt="Alternate Text" size="xl" />
            </Pressable>
            <Text fontSize="xl">{name}</Text>
            <Text fontSize="xl">{Email}</Text>
          </Container>
          <Container
            flexDirection="row"
            justifyContent="space-between"
            w="100%">
            <Pressable
              onPress={() => navigation.navigate('BillCreationComponent')}>
              <Image source={buttons[0]} alt="Alternate Text" size="sm" />
            </Pressable>
            <Pressable onPress={() => navigation.navigate('CurrencyScreen')}>
              <Image source={buttons[1]} alt="Alternate Text" size="sm" />
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Language')}>
              <Image source={buttons[2]} alt="Alternate Text" size="sm" />
            </Pressable>
          </Container>
          <HStack
            justifyContent="space-between"
            alignItems="center"
            px="10%"
            w={'100%'}>
            <Box>
              <Text fontSize="md">Expense & Bills {version}</Text>
              <Text fontSize="md">Last Update: {date}</Text>
              <Text fontSize="md" color="#FF701B">
                @solomon Hong Kong
              </Text>
            </Box>
            <Pressable>
              <Image
                source={ProfileScreenUpdateCheckbutton}
                alt="Alternate Text"
                size="sm"
              />
            </Pressable>
          </HStack>
        </VStack>
      </ScrollView>
      <TabNavigation />
    </Box>
  );
};

export default withAuthenticationValidation(ProfileScreen);
