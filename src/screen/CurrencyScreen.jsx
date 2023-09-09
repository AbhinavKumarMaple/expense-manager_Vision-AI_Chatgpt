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
import ProfilePic from '../../assets/expense-management/Screenbuttons.icon/ActiveProfileScreen-Currency.icon.png';
import TabNavigation from '../../componenets/CurrencyScreen/TabNavigation';
import withAuthenticationValidation from '../utils/withAuthenticationValidation';

const CurrencyScreen = () => {
  const [selectedOptions, setSelectedOptions] = useState({
    currency: 'USD',
    decimalPoints: 2,
  });

  const currencyOptions = [
    {label: 'USD', value: 'USD'},
    {label: 'EUR', value: 'EUR'},
    {label: 'JPY', value: 'JPY'},
    // Add more currency options as needed
  ];

  const decimalOptions = [0, 1, 2, 3, 4, 5];

  const handleCurrencyChange = itemValue => {
    setSelectedOptions({
      ...selectedOptions,
      currency: itemValue,
    });
  };

  const handleDecimalPointsChange = itemValue => {
    setSelectedOptions({
      ...selectedOptions,
      decimalPoints: itemValue,
    });
  };

  return (
    <Box flex="1" safeAreaTop pt={50}>
      <ScrollView>
        <VStack
          justifyContent="space-between"
          alignItems="center"
          py={5}
          space={50}
          h="100%"
          w="100%">
          <Container justifyContent="center" alignItems="center">
            <Image source={ProfilePic} alt="Alternate Text" size="xl" />
          </Container>
          <Center flex={1} p={4}>
            <VStack space={4} alignItems="center" w="80%">
              <Text fontSize="xl">Currency</Text>
              <Select
                _selectedItem={{
                  bg: 'gray.100', // Set the background color of the selected item
                  borderColor: 'orange.400',
                  color: 'orange.400',
                  borderWidth: '4',
                }}
                _item={{
                  bg: 'gray.100',
                  _focusVisible: {
                    bg: 'orange.400', // Set the background color of the pressed options
                  },
                }}
                selectedValue={selectedOptions.currency}
                minWidth={200}
                placeholder="Select currency"
                onValueChange={handleCurrencyChange}>
                {currencyOptions.map(option => (
                  <Select.Item
                    _pressed={{bgColor: 'gray.100'}}
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Select>

              <Text fontSize="xl">Decimal Points</Text>
              <Select
                _item={{
                  bg: 'gray.100',
                }}
                selectedValue={selectedOptions.decimalPoints}
                minWidth={120}
                onValueChange={handleDecimalPointsChange}>
                {decimalOptions.map(option => (
                  <Select.Item
                    _pressed={{bgColor: 'gray.100'}}
                    key={option}
                    label={option.toString()}
                    value={option}
                  />
                ))}
              </Select>
            </VStack>
          </Center>
        </VStack>
      </ScrollView>
      <TabNavigation />
    </Box>
  );
};

export default withAuthenticationValidation(CurrencyScreen);
