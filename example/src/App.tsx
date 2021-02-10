import React, { useEffect, useRef, useState } from 'react';
import { ImageSourcePropType, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MusicPlayer, { AppleMusicRequests, IPlayerState, MusicPlayerEvents, RepeatMode, ShuffleMode } from 'rn-music-player';
import ApiService from './api';
import PlayerControls from './components/PlayerControls';
import SongCover from './components/SongCover';
import PlayerSlider from './components/PlayerSlider';
import Playlist from './components/Playlist';
import type { AuthorizationStatus } from 'src/interfaces';
import type { Album, Song, SongResponse, TopChartsResponse } from './models/interfaces';

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
  const coverSetForCurrentSong = useRef(false);

  useEffect(() => {
    requestAuthorization();
    getShuffleMode();
    getRepeatMode();
    getUserToken();
    getStoreFrontCode();
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
      handler = setInterval(getPlaybackTime, 1000);
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
  }

  function removeListeners() {
    MusicPlayerEvents.removeAllListeners('onPlay');
    MusicPlayerEvents.removeAllListeners('onPause');
    MusicPlayerEvents.removeAllListeners('onNext');
    MusicPlayerEvents.removeAllListeners('onPrevious');
    MusicPlayerEvents.removeAllListeners('onStop');
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
        artwork: convertArtworkUrlToImageUrl(song.attributes.artwork.url),
        songUrl: song.attributes.url,
        songName: song.attributes.name,
      }));
      setTopSongs(songs);
      const albums = response.data.results.albums[0].data.map((album) => ({
        id: album.id,
        albumName: album.attributes.name,
        artistName: album.attributes.artistName,
        artwork: convertArtworkUrlToImageUrl(album.attributes.artwork.url),
        songUrl: album.attributes.url,
      }));
      setTopAlbums(albums);
    } catch (error) {
      console.log('getTopCharts', error);
    }
  }

  function convertArtworkUrlToImageUrl(artworkUrl: string) {
    return artworkUrl.replace('{w}x{h}', `${coverSize}x${coverSize}`);
  }

  async function getSongById(songId: string) {
    try {
      const response = await ApiService.callApi<SongResponse>(
        AppleMusicRequests.fetchSongByIdRequest(songId, DEVELOPER_JWT_TOKEN, STORE_FRONT)
      );
      setArtwork({ uri: convertArtworkUrlToImageUrl(response.data.data[0].attributes.artwork.url) });
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

  async function playSongById(songId: string) {
    await MusicPlayer.playSongById(songId);
  }
  async function onPlayAllTopSongsPress() {
    await MusicPlayer.setQueue(
      topSongs.map((song) => song.id),
      true
    );
  }

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
        <View style={styles.topSongsTitleWrapper}>
          <TouchableOpacity onPress={onPlayAllTopSongsPress}>
            <Text style={styles.title}>Play all</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Top Songs</Text>
          <Text style={[styles.title, { opacity: 0 }]}>Play all</Text>
        </View>
        <Playlist data={topSongs} onItemPress={playSongById} />
        <View>
          <Text style={styles.title}>Top Albums</Text>
        </View>
        <Playlist data={topAlbums} onItemPress={() => {}} />
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
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  divider: { marginVertical: 10 },
  title: {
    fontSize: 24,
  },
  topSongsTitleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    marginTop: 20,
  },
});

function secondsToPlayTimeString(seconds: number | null) {
  if (typeof seconds !== 'number') {
    return '0:00';
  }
  const flooredSeconds = Math.floor(seconds);
  const minutes = Math.floor(flooredSeconds / 60);
  const playTimeSeconds = flooredSeconds % 60 === 0 ? 0 : flooredSeconds - minutes * 60;
  return `${minutes}:${convertShortTimeToLongTime(playTimeSeconds)}`;
}

function convertShortTimeToLongTime(time: number): string {
  return time < 10 ? `0${time}` : `${time}`;
}
