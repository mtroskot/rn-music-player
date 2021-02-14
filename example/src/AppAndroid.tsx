import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ImageSourcePropType, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import MusicPlayer, { IPlayerState, RepeatMode, ShuffleMode } from 'rn-music-player';
import PlayerControls from './components/PlayerControls';
import SongCover from './components/SongCover';
import PlayerSlider from './components/PlayerSlider';
import { secondsToPlayTimeString, throttle } from './utils/funcUtils';
import VolumeSlider from './components/VolumeSlider';
import { PERMISSIONS, RESULTS, request } from 'react-native-permissions';

export default function AppIos() {
  const [currentSongTitle, setCurrentSongTitle] = useState<null | string>(null);
  const [author, setAuthor] = useState<null | string>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [shuffleMode] = useState<ShuffleMode | null>(null);
  const [artwork] = useState<ImageSourcePropType | null>(null);
  const [repeatMode, setRepeatMode] = useState<RepeatMode | null>(null);
  const [playbackTime, setPlaybackTime] = useState<number | null>(null);
  const [playbackDuration, setPlaybackDuration] = useState<number | null>(null);
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    requestPermission();
    getPlayerState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let handler: NodeJS.Timeout | null = null;
    if (isPlaying) {
      getPlaybackDuration();
      handler = setInterval(getPlaybackTime, 500);
    }
    return () => {
      clearInterval(handler as NodeJS.Timeout);
    };
  }, [isPlaying]);

  async function requestPermission() {
    const result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    switch (result) {
      case RESULTS.UNAVAILABLE:
        console.log('This feature is not available (on this device / in this context)');
        break;
      case RESULTS.DENIED:
        console.log('The permission has not been requested / is denied but requestable');
        break;
      case RESULTS.LIMITED:
        console.log('The permission is limited: some actions are possible');
        break;
      case RESULTS.GRANTED:
        console.log('The permission is granted');
        initializeMusicPlayerAndroid();
        getCurrentSongTitle();
        getRepeatMode();
        getVolume();
        break;
      case RESULTS.BLOCKED:
        console.log('The permission is denied and not requestable anymore');
        break;
    }
  }

  async function getVolume() {
    const volume = await MusicPlayer.getVolume();
    setVolume(volume);
  }

  async function initializeMusicPlayerAndroid() {
    await MusicPlayer.initializeMusicPlayerAndroid();
    getUserSongs();
  }

  async function getUserSongs() {
    const result = await MusicPlayer.getUserSongs();
    console.log(result);
  }

  async function getCurrentSongTitle() {
    const result = await MusicPlayer.currentSongTitle();
    setCurrentSongTitle(result);
  }

  async function getPlaybackTime() {
    const result = await MusicPlayer.getPlaybackTime();
    setPlaybackTime(result);
  }

  async function getPlaybackDuration() {
    const result = await MusicPlayer.getPlaybackDuration();
    setPlaybackDuration(result);
  }

  async function getPlayerState() {
    const playerState: IPlayerState = await MusicPlayer.getPlayerState();
    parsePlayerState(playerState);
  }

  async function getRepeatMode() {
    const result = await MusicPlayer.getRepeatMode();
    setRepeatMode(result);
  }

  async function onRepeatPress() {
    await MusicPlayer.setRepeatMode(repeatMode === 'all' ? 'none' : repeatMode === 'none' ? 'one' : 'all');
    await getRepeatMode();
  }

  function parsePlayerState(playerState: IPlayerState) {
    setPlaybackTime(playerState.playbackPosition);
    setPlaybackDuration(playerState.playbackDuration);
    setCurrentSongTitle(playerState.trackName);
    setAuthor(playerState.author);
    setIsPlaying(playerState.isPlaying);
  }

  async function onTogglePlayPress() {
    if (isPlaying) {
      setIsPlaying(false);
      await MusicPlayer.pause();
    } else {
      setIsPlaying(true);
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
          {...{
            repeatMode,
            shuffleMode,
            isPlaying,
            onShufflePress: () => {},
            onRepeatPress: onRepeatPress,
            onTogglePlayPress,
            onNextPress,
            onPreviousPress,
          }}
        />
        <VolumeSlider volume={volume} onSlide={onVolumeSlideThrottled} />
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
