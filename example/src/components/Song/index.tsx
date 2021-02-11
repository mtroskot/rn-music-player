import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styles from './song.styles';
import SafeImage from '../SafeImage';

interface SongProps {
  imageUrl?: string | null;
  song: string;
  artist?: string;
  album?: string;
  onPress: () => void;
}

const Song: React.FC<SongProps> = ({ imageUrl, song, onPress, artist, album }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <SafeImage imageStyle={styles.image} imageUri={imageUrl} />
      <Text style={styles.text}>Song: {song}</Text>
      {artist ? <Text style={styles.text}>Artist: {artist}</Text> : null}
      {album ? <Text style={styles.text}>Album: {album}</Text> : null}
    </TouchableOpacity>
  );
};

export default React.memo(Song);
