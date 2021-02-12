import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ImageSourcePropType, ListRenderItem, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import MusicPlayer, { AppleMusicRequests, IPlayerState, MusicPlayerEvents, RepeatMode, ShuffleMode, UserPlaylist } from 'rn-music-player';
import ApiService from './api';
import PlayerControls from './components/PlayerControls';
import SongCover from './components/SongCover';
import PlayerSlider from './components/PlayerSlider';
import AlbumItem from './components/Album';
import SongItem from './components/Song';
import PlaylistSection from './components/PlaylistSection';
import VolumeSlider from './components/VolumeSlider';
import type { AuthorizationStatus, UserPlaylistItem } from 'src/interfaces';
import type { Album, Song, SongResponse, TopChartsResponse } from './models/interfaces';
import { convertArtworkUrlToImageUrl, secondsToPlayTimeString, throttle } from './utils/funcUtils';

const coverSize = 200;
const DEVELOPER_JWT_TOKEN = 'YOUR_OWN_APPLE_DEVELOPER_TOKEN';
let USER_TOKEN = '';
let STORE_FRONT = 'us';
export default function App() {
  const [currentSongTitle, setCurrentSongTitle] = useState<null | string>(null);
  const [author, setAuthor] = useState<null | string>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [shuffleMode, setShuffleMode] = useState<ShuffleMode | null>(null);
  const [artwork, setArtwork] = useState<ImageSourcePropType | null>(null);
  const [repeatMode, setRepeatMode] = useState<RepeatMode | null>(null);
  const [playbackTime, setPlaybackTime] = useState<number | null>(null);
  const [playbackDuration, setPlaybackDuration] = useState<number | null>(null);
  const [topSongs, setTopSongs] = useState<Song[]>([]);
  const [topAlbums, setTopAlbums] = useState<Album[]>([]);
  const [userPlaylists, setUserPlaylists] = useState<UserPlaylist[]>([]);
  const [userSongs, setUserSongs] = useState<UserPlaylistItem[]>([]);
  const [volume, setVolume] = useState(0);
  const coverSetForCurrentSong = useRef(false);

  useEffect(() => {
    getVolume();
    getUserPlaylists();
    getUserSongs();
    requestAuthorization();
    getShuffleMode();
    getRepeatMode();
    getPlayerState();
    addListeners();
    return () => {
      removeListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let handler: NodeJS.Timeout | null = null;
    if (isPlaying) {
      handler = setInterval(getPlaybackTime, 500);
    }
    return () => {
      clearInterval(handler as NodeJS.Timeout);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      getPlaybackDuration();
    }
  }, [isPlaying]);

  function addListeners() {
    MusicPlayerEvents.addListener('onSongChange', (playerState: IPlayerState) => {
      coverSetForCurrentSong.current = false;
      parsePlayerState(playerState);
    });
    MusicPlayerEvents.addListener('onPlay', (playerState: IPlayerState) => {
      parsePlayerState(playerState);
    });
    MusicPlayerEvents.addListener('onPause', (playerState: IPlayerState) => {
      parsePlayerState(playerState);
    });
    MusicPlayerEvents.addListener('onNext', (playerState: IPlayerState) => {
      parsePlayerState(playerState);
    });
    MusicPlayerEvents.addListener('onPrevious', (playerState: IPlayerState) => {
      parsePlayerState(playerState);
    });
    MusicPlayerEvents.addListener('onStop', (playerState: IPlayerState) => {
      parsePlayerState(playerState);
    });
    MusicPlayerEvents.addListener('systemVolumeDidChange', (volume: number) => {
      setVolume(volume);
    });
  }

  function removeListeners() {
    MusicPlayerEvents.removeAllListeners('onPlay');
    MusicPlayerEvents.removeAllListeners('onPause');
    MusicPlayerEvents.removeAllListeners('onNext');
    MusicPlayerEvents.removeAllListeners('onPrevious');
    MusicPlayerEvents.removeAllListeners('onStop');
    MusicPlayerEvents.removeAllListeners('systemVolumeDidChange');
  }

  async function getVolume() {
    const volume = await MusicPlayer.getVolume();
    setVolume(volume);
  }
  async function getUserPlaylists() {
    const result = await MusicPlayer.getUserPlaylists();
    if (result) {
      setUserPlaylists(result);
    }
  }

  async function getUserSongs() {
    const result = await MusicPlayer.getUserSongs();
    if (result) {
      setUserSongs(result);
    }
  }

  async function getUserToken() {
    const userToken = await MusicPlayer.requestUserToken(DEVELOPER_JWT_TOKEN);
    USER_TOKEN = userToken;
    console.log(USER_TOKEN);
  }

  async function getStoreFrontCode() {
    const storeFront = await MusicPlayer.getStoreFrontCountryCode();
    STORE_FRONT = storeFront;
    await getTopCharts();
  }
  async function requestAuthorization() {
    const authStatus = await MusicPlayer.getAuthorizationStatus();
    if (authStatus === 'NOT_DETERMINED') {
      const status = await MusicPlayer.requestAuthorization();
      checkAuthorizationStatus(status);
    } else if (authStatus === 'AUTHORIZED') {
      await getUserToken();
      await getStoreFrontCode();
    }
    checkAuthorizationStatus(authStatus);
  }

  function checkAuthorizationStatus(status: AuthorizationStatus) {
    if (status === 'DENIED') {
      alert("You won't be able to play music from your library without granting permissions");
    }
  }

  async function getTopCharts() {
    try {
      const response = await ApiService.callApi<TopChartsResponse>(
        AppleMusicRequests.fetchAlbumsAndSongsTopChartRequest(DEVELOPER_JWT_TOKEN, STORE_FRONT)
      );
      const songs = response.data.results.songs[0].data.map((song) => ({
        id: song.id,
        albumName: song.attributes.albumName,
        artistName: song.attributes.artistName,
        artwork: convertArtworkUrlToImageUrl(song.attributes.artwork.url, coverSize),
        songUrl: song.attributes.url,
        songName: song.attributes.name,
      }));
      setTopSongs(songs);
      const albums = response.data.results.albums[0].data.map((album) => ({
        id: album.id,
        albumName: album.attributes.name,
        artistName: album.attributes.artistName,
        artwork: convertArtworkUrlToImageUrl(album.attributes.artwork.url, coverSize),
        songUrl: album.attributes.url,
      }));
      setTopAlbums(albums);
    } catch (error) {
      console.log('getTopCharts', error);
    }
  }

  async function getSongById(songId: string) {
    try {
      const response = await ApiService.callApi<SongResponse>(
        AppleMusicRequests.fetchSongByIdRequest(songId, DEVELOPER_JWT_TOKEN, STORE_FRONT)
      );
      setArtwork({ uri: convertArtworkUrlToImageUrl(response.data.data[0].attributes.artwork.url, coverSize) });
    } catch (error) {
      setArtwork(null);
    } finally {
      coverSetForCurrentSong.current = true;
    }
  }

  async function getPlaybackTime() {
    const result = await MusicPlayer.getPlaybackTime();
    setPlaybackTime(result);
  }

  async function getPlayerState() {
    const playerState: IPlayerState = await MusicPlayer.getPlayerState();
    parsePlayerState(playerState);
  }

  function parsePlayerState(playerState: IPlayerState) {
    setPlaybackTime(playerState.playbackPosition);
    setPlaybackDuration(playerState.playbackDuration);
    setCurrentSongTitle(playerState.trackName);
    setAuthor(playerState.author);
    setIsPlaying(playerState.isPlaying);
    if (coverSetForCurrentSong.current === false) {
      if (playerState.playbackStoreID !== '0' && playerState.playbackStoreID && playerState.artwork === null) {
        getSongById(playerState.playbackStoreID);
      } else {
        setArtwork(playerState.artwork ? { uri: `data:image/png;base64,${playerState.artwork}` } : null);
      }
    }
  }

  async function getPlaybackDuration() {
    const result = await MusicPlayer.getPlaybackDuration();
    setPlaybackDuration(result);
  }

  async function getShuffleMode() {
    const result = await MusicPlayer.getShuffleMode();
    setShuffleMode(result);
  }

  async function getRepeatMode() {
    const result = await MusicPlayer.getRepeatMode();
    setRepeatMode(result);
  }

  async function onShufflePress() {
    await MusicPlayer.setShuffleMode(shuffleMode === 'off' ? 'songs' : 'off');
    await getShuffleMode();
  }

  async function onRepeatPress() {
    await MusicPlayer.setRepeatMode(repeatMode === 'all' ? 'none' : repeatMode === 'none' ? 'one' : 'all');
    await getRepeatMode();
  }

  async function onTogglePlayPress() {
    if (isPlaying) {
      await MusicPlayer.pause();
    } else {
      await MusicPlayer.play();
    }
  }

  async function onNextPress() {
    await MusicPlayer.next();
  }
  async function onPreviousPress() {
    await MusicPlayer.previous();
  }

  async function seek(value: number) {
    if (playbackDuration) {
      await MusicPlayer.setPlaybackTime(playbackDuration * value);
    }
  }

  const onVolumeSlide = useCallback(async (value: number) => {
    setVolume(value);
    await MusicPlayer.setVolume(value);
  }, []);
  const onVolumeSlideThrottled = useMemo(() => throttle(onVolumeSlide, 150), [onVolumeSlide]);

  async function playAppleMusicSongBy(songId: string) {
    await MusicPlayer.playAppleMusicSongById(songId);
  }

  function onAlbumPress(albumId: string) {
    console.log(albumId);
  }

  // async function onPlayAllTopSongsPress() {
  //   await MusicPlayer.setQueue(
  //     topSongs.map((song) => song.id),
  //     true
  //   );
  // }

  const renderAppleMusicSongItem: ListRenderItem<Song> = useCallback(({ item }) => {
    return (
      <SongItem
        onPress={() => {
          playAppleMusicSongBy(item.id);
          // MusicPlayer.setAppleMusicQueue(
          //   topSongs.map((song) => song.id),
          //   true,
          //   item.id
          // );
        }}
        imageUrl={item.artwork}
        album={item.albumName}
        artist={item.artistName}
        song={item.songName}
      />
    );
  }, []);

  const renderAlbumItem: ListRenderItem<Album> = useCallback(({ item }) => {
    return <AlbumItem onPress={() => onAlbumPress(item.id)} imageUrl={item.artwork} album={item.albumName} artist={item.artistName} />;
  }, []);

  const renderUserPlaylists: ListRenderItem<UserPlaylist> = useCallback(({ item }) => {
    return <AlbumItem onPress={() => onAlbumPress(item.persistentID)} imageUrl={item.artwork} album={item.name} />;
  }, []);

  const renderUserSongs: ListRenderItem<UserPlaylistItem> = useCallback(
    ({ item }) => {
      return (
        <SongItem
          onPress={() =>
            // MusicPlayer.playLocalSongById(item.persistentID)
            MusicPlayer.setLocalMusicQueue(
              userSongs.map((song) => song.persistentID),
              true,
              item.persistentID
            )
          }
          song={item.title}
          artist={item.artist}
          album={item.albumTitle}
        />
      );
    },
    [userSongs]
  );

  return (
    <SafeAreaView style={styles.flex}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
        <SongCover artistName={author} songTitle={currentSongTitle} image={artwork} />
        <PlayerSlider
          sliderValue={playbackTime !== null && playbackDuration ? playbackTime / playbackDuration : 0}
          playbackDuration={secondsToPlayTimeString(playbackDuration)}
          playbackTime={secondsToPlayTimeString(playbackTime)}
          onSlidingComplete={seek}
          isDisabled={playbackDuration === 0}
        />
        <PlayerControls
          {...{ repeatMode, shuffleMode, isPlaying, onShufflePress, onRepeatPress, onTogglePlayPress, onNextPress, onPreviousPress }}
        />
        <VolumeSlider volume={volume} onSlide={onVolumeSlideThrottled} />
        <PlaylistSection data={topSongs} renderItem={renderAppleMusicSongItem} keyExtractor={(item: Song) => item.id} title={'Top Songs'} />
        <PlaylistSection data={topAlbums} renderItem={renderAlbumItem} keyExtractor={(item: Album) => item.id} title={'Top Albums'} />
        <PlaylistSection
          data={userPlaylists}
          renderItem={renderUserPlaylists}
          keyExtractor={(item: UserPlaylist) => item.persistentID}
          title={'User Playlists'}
        />
        <PlaylistSection
          data={userSongs}
          renderItem={renderUserSongs}
          keyExtractor={(item: UserPlaylistItem) => item.persistentID}
          title={'User Songs'}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    marginTop: 20,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  topSongsTitleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    marginTop: 20,
  },
});
