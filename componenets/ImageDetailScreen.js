import React from 'react';
import { View, Image, Text } from 'native-base';
import { useRoute } from '@react-navigation/native';

const ImageDetailScreen = () => {
  const route = useRoute();
  const imageUri = route.params.imageUri;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',   }}>
      <Image
        source={{ uri: imageUri }}
        style={{ flex: 1, width: '95%',resizeMode: 'contain' }}
        
      />
        <View style={{ height:"20%",width:"100%", backgroundColor: 'gray', alignItems: 'center', justifyContent: 'center' }}>
        {/* Google Ads content goes here */}
        <Text>Google Ads Here</Text>
      </View>
    </View>
  );
};

export default ImageDetailScreen;
