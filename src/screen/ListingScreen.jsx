import React, {useState} from 'react';

import DateSelect from '../../componenets/ListingScreen/DateSelect';
import Bills from '../../componenets/ListingScreen/Bills';

import DateRange from '../../componenets/ListingScreen/DateRange';
import FilterCategory from '../../componenets/ListingScreen/FilterCategory';
import TabNavigation from '../../componenets/ListingScreen/TabNavigation';
import withAuthenticationValidation from '../utils/withAuthenticationValidation';
import {Box} from 'native-base';

const ListingScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState(null);

  const updateFilter = filter => {
    console.log('this filter', filter);
    setSelectedFilter(filter);
  };

  return (
    <Box flex={1} justifyContent="center" alignItems="center" w={'100%'} px="2">
      <DateSelect />
      <DateRange />
      <FilterCategory updateFilter={updateFilter} />

      <Bills selectedFilter={selectedFilter} />
      <TabNavigation />
    </Box>
  );
};

export default withAuthenticationValidation(ListingScreen);
