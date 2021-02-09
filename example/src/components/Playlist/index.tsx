import React from 'react';
import { FlatList } from 'react-native';
import styles from './playlist.styles';
import type { Album, Song } from '../../models/interfaces';
import SongItem from '../Song';
import AlbumItem from '../Album';

interface PlaylistProps {
  data: ReadonlyArray<Song | Album>;
  onItemPress: (itemId: string) => void;
}

const Playlist: React.FC<PlaylistProps> = ({ data, onItemPress }) => {
  return (
    <FlatList
      data={data}
      horizontal={true}
      style={styles.flatListStyle}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        if ('songName' in item) {
          let songItem = item as Song;
          return (
            <SongItem
              onPress={() => onItemPress(songItem.id)}
              imageUrl={songItem.artwork}
              album={songItem.albumName}
              artist={songItem.artistName}
              song={songItem.songName}
            />
          );
        } else {
          let albumItem = item as Album;
          return (
            <AlbumItem
              onPress={() => onItemPress(albumItem.id)}
              imageUrl={albumItem.artwork}
              album={albumItem.albumName}
              artist={albumItem.artistName}
            />
          );
        }
      }}
    />
  );
};

export default React.memo(Playlist);
