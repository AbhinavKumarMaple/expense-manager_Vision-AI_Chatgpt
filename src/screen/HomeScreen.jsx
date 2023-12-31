import {HStack, Image, Box, Pressable, ZStack, Center} from 'native-base';
import Camera from '../../assets/expense-management/Screenbuttons.icon/E&BLogo-OrangeWhiteBG.png';
import Listing from '../../assets/expense-management/Screenbuttons.icon/ListingButton-WhiteBG.png';
import Profile from '../../assets/expense-management/Screenbuttons.icon/ProfileButton-WhiteBG.png';
import Background from '../../assets/HomeScreen.jpeg';
import {useNavigation} from '@react-navigation/native'; // Import the hook
import withAuthenticationValidation from '../utils/withAuthenticationValidation';

const HomeScreen = () => {
  const navigation = useNavigation(); // Get the navigation object

  return (
    <ZStack flex={1}>
      <Image
        source={Background}
        alt="Background Image"
        alignItems={'flex-start'}
        // resizeMode="cover"
        // position="initial"
        top={0}
        left={0}
        width="100%"
        height="100%"
        // zIndex={-1}
        right={10} // Adjust this value to change the offset from the right side
        center // Centers the image vertically
      />
      <Box
        pb={5}
        h={'100vp'}
        justifyContent="space-between"
        alignItem="center"
        w={'100%'}
        position={'absolute'}
        bottom={'0%'}
        bg={'transparent'}>
        <HStack justifyContent="space-between" px={'10%'} bg={'transparent'}>
          <Pressable onPress={() => navigation.navigate('ListingScreen')}>
            <Image source={Listing} alt="Image 1" size="sm" />
          </Pressable>
          <Pressable onPress={() => navigation.navigate('DocScanner')}>
            <Image source={Camera} alt="Image 2" size="sm" />
          </Pressable>
          <Pressable onPress={() => navigation.navigate('ProfileScreen')}>
            <Image source={Profile} alt="Image 3" size="sm" />
          </Pressable>
        </HStack>
      </Box>
    </ZStack>
  );
};

export default withAuthenticationValidation(HomeScreen);
