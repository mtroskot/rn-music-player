import React from 'react';
import { Image, ImageSourcePropType, Text, View } from 'react-native';
import styles from './songCover.styles';
import Icon from 'react-native-vector-icons/Ionicons';

interface SongCoverProps {
  image: ImageSourcePropType | null;
  songTitle: string | null;
  artistName: string | null;
}

const SongCover: React.FC<SongCoverProps> = ({ image, artistName, songTitle }) => {
  const cover = image ? (
    <Image style={styles.cover} source={image} />
  ) : (
    <View style={styles.cover}>
      <Icon name="musical-notes" size={80} color="#000" />
    </View>
  );

  return (
    <View>
      {cover}
      <View style={styles.titleContainer}>
        <Text style={styles.text}>{songTitle}</Text>
        <Text style={styles.text}>{artistName}</Text>
      </View>
    </View>
  );
};

export default React.memo(SongCover);
