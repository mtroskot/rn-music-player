import React from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import styles from './song.styles';

interface SongProps {
  imageUrl: string;
  song: string;
  artist: string;
  album: string;
  onPress: () => void;
}

const Song: React.FC<SongProps> = ({ imageUrl, song, onPress, artist, album }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.text}>Song: {song}</Text>
      <Text style={styles.text}>Artist: {artist}</Text>
      <Text style={styles.text}>Album: {album}</Text>
    </TouchableOpacity>
  );
};

export default React.memo(Song);
