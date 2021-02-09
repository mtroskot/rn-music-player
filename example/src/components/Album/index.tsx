import React from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import styles from './album.styles';

interface AlbumProps {
  imageUrl: string;
  artist: string;
  album: string;
  onPress: () => void;
}

const Album: React.FC<AlbumProps> = ({ imageUrl, album, artist }) => {
  return (
    <TouchableOpacity style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.text}>Album: {album}</Text>
      <Text style={styles.text}>Artist: {artist}</Text>
    </TouchableOpacity>
  );
};

export default React.memo(Album);
