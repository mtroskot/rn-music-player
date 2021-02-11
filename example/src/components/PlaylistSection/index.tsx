import React from 'react';
import { Text, View } from 'react-native';
import Playlist, { PlaylistProps } from '../Playlist';
import styles from './playlistSection.styles';

interface PlaylistSectionProps extends PlaylistProps {
  title: string;
}

const PlaylistSection: React.FC<PlaylistSectionProps> = ({ title, renderItem, keyExtractor, data }) => {
  if (data.length === 0) {
    return null;
  }
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Playlist data={data} renderItem={renderItem} keyExtractor={keyExtractor} />
    </>
  );
};

export default React.memo(PlaylistSection);
