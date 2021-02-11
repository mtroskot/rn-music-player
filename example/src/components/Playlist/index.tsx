import React from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import styles from './playlist.styles';

export interface PlaylistProps {
  data: ReadonlyArray<any>;
  renderItem: ListRenderItem<any> | null | undefined;
  keyExtractor: (item: any, index: number) => string;
}

const Playlist: React.FC<PlaylistProps> = ({ data, renderItem, keyExtractor }) => {
  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      data={data}
      horizontal={true}
      style={styles.flatListStyle}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
};

export default React.memo(Playlist);
