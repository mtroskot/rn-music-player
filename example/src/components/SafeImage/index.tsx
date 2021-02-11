import React from 'react';
import { Image, ImageStyle, StyleProp, View } from 'react-native';

interface SafeImageProps {
  imageUri?: string | null;
  imageStyle: StyleProp<ImageStyle>;
}

const SafeImage: React.FC<SafeImageProps> = ({ imageUri, imageStyle }) => {
  if (!imageUri) {
    return <View style={imageStyle} />;
  }
  return <Image source={{ uri: imageUri }} style={imageStyle} />;
};

export default React.memo(SafeImage);
