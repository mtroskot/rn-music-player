import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styles from './album.styles';
import SafeImage from '../SafeImage';

interface AlbumProps {
  imageUrl: string | null;
  artist?: string;
  album: string;
  onPress: () => void;
}

const Album: React.FC<AlbumProps> = ({ imageUrl, album, artist, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <SafeImage imageStyle={styles.image} imageUri={imageUrl} />
      <Text style={styles.text}>Album: {album}</Text>
      {artist ? <Text style={styles.text}>Artist: {artist}</Text> : null}
    </TouchableOpacity>
  );
};

export default React.memo(Album);
