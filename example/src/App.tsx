import React, { useEffect } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Image,
} from 'react-native';
import MusicPlayer, { MusicPlayerEvents } from 'rn-music-player';
import type { PlayerState } from 'rn-music-player';

export default function App() {
  const [currentSongTitle, setCurrentSongTitle] = React.useState<null | string>(
    null
  );
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [shuffleMode, setShuffleMode] = React.useState<string | null>(null);
  const [artwork, setArtwork] = React.useState<string | null>(null);
  const [repeatMode, setRepeatMode] = React.useState<string | null>(null);
  const [playbackTime, setPlaybackTime] = React.useState<string | null>(null);
  const [playbackDuration, setPlaybackDuration] = React.useState<string | null>(
    null
  );
  useEffect(() => {
    getPlayerState();
    MusicPlayerEvents.addListener(
      'onSongChange',
      (playerState: PlayerState) => {
        parsePlayerState(playerState);
      }
    );
    MusicPlayerEvents.addListener('onPlay', (playerState: PlayerState) => {
      parsePlayerState(playerState);
    });
    MusicPlayerEvents.addListener('onPause', (playerState: PlayerState) => {
      parsePlayerState(playerState);
    });
    MusicPlayerEvents.addListener('onNext', (playerState: PlayerState) => {
      parsePlayerState(playerState);
    });
    MusicPlayerEvents.addListener('onPrevious', (playerState: PlayerState) => {
      parsePlayerState(playerState);
    });
    MusicPlayerEvents.addListener('onStop', (playerState: PlayerState) => {
      parsePlayerState(playerState);
    });
    return () => {
      MusicPlayerEvents.removeAllListeners('onPlay');
      MusicPlayerEvents.removeAllListeners('onPause');
      MusicPlayerEvents.removeAllListeners('onNext');
      MusicPlayerEvents.removeAllListeners('onPrevious');
      MusicPlayerEvents.removeAllListeners('onStop');
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

  async function getNowPlaying() {
    const result = await MusicPlayer.currentSongTitle();
    setCurrentSongTitle(result);
    await getPlaybackDuration();
  }

  async function getPlaybackTime() {
    const result = await MusicPlayer.getPlaybackTime();
    setPlaybackTime(secondsToPlayTimeString(result));
  }

  async function getPlayerState() {
    const playerState: PlayerState = await MusicPlayer.getPlayerState();
    parsePlayerState(playerState);
  }

  function parsePlayerState(playerState: PlayerState) {
    console.log(playerState);
    setPlaybackTime(secondsToPlayTimeString(playerState.playbackPosition));
    setPlaybackDuration(secondsToPlayTimeString(playerState.playbackDuration));
    setCurrentSongTitle(playerState.trackName);
    setIsPlaying(playerState.isPlaying);
    setArtwork(playerState.artwork);
  }

  async function getPlaybackDuration() {
    const result = await MusicPlayer.getPlaybackDuration();
    setPlaybackDuration(secondsToPlayTimeString(result));
  }

  async function checkIfPlaying() {
    const result = await MusicPlayer.isPlaying();
    setIsPlaying(result);
  }

  async function getShuffleMode() {
    const result = await MusicPlayer.getShuffleMode();
    setShuffleMode(result);
  }

  async function getRepeatMode() {
    const result = await MusicPlayer.getRepeatMode();
    setRepeatMode(result);
  }

  async function changeShuffleMode() {
    await MusicPlayer.setShuffleMode(shuffleMode === 'off' ? 'songs' : 'off');
    await getShuffleMode();
  }

  async function changeRepeatMode() {
    await MusicPlayer.setRepeatMode(
      repeatMode === 'all' ? 'none' : repeatMode === 'none' ? 'one' : 'all'
    );
    await getRepeatMode();
  }

  async function prepareToPlay() {
    await MusicPlayer.prepareToPlay();
  }

  async function play() {
    await MusicPlayer.play();
  }

  async function stop() {
    await MusicPlayer.stop();
  }

  async function pause() {
    await MusicPlayer.pause();
  }
  async function next() {
    await MusicPlayer.next();
  }
  async function previous() {
    await MusicPlayer.previous();
  }

  async function seek() {
    await MusicPlayer.setPlaybackTime(10 * 6);
  }

  return (
    <SafeAreaView style={styles.flex}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
        <Image
          style={{ width: 200, height: 200 }}
          source={{ uri: `data:image/png;base64,${artwork}` }}
        />
        <Text>Now playing: {currentSongTitle}</Text>
        <Text>Is playing: {isPlaying.toString()}</Text>
        <Text>Repeat mode: {repeatMode}</Text>
        <Text>Shuffle mode: {shuffleMode}</Text>
        <Text>Playback time: {playbackTime}</Text>
        <Text>Playback duration: {playbackDuration}</Text>
        <Button title={'Prepare To Play'} onPress={prepareToPlay} />
        <Button title={'Play Music'} onPress={play} />
        <Button title={'Pause Music'} onPress={pause} />
        <Button title={'Stop Music'} onPress={stop} />
        <Button title={'Next Music'} onPress={next} />
        <Button title={'Previous Music'} onPress={previous} />
        <Button title={'CheckIf playing'} onPress={checkIfPlaying} />
        <Button title={'Now playing'} onPress={getNowPlaying} />
        <Button title={'getRepeatMode'} onPress={getRepeatMode} />
        <Button title={'getShuffleMode'} onPress={getShuffleMode} />
        <Button title={'changeRepeatMode'} onPress={changeRepeatMode} />
        <Button title={'changeShuffleMode'} onPress={changeShuffleMode} />
        <Button title={'Set Playback To 1 Minute'} onPress={seek} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
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
});

function secondsToPlayTimeString(seconds: number) {
  const flooredSeconds = Math.floor(seconds);
  const minutes = Math.floor(flooredSeconds / 60);
  const playTimeSeconds =
    flooredSeconds % 60 === 0 ? 0 : flooredSeconds - minutes * 60;
  return `${minutes}:${convertShortTimeToLongTime(playTimeSeconds)}`;
}

function convertShortTimeToLongTime(time: number): string {
  return time < 10 ? `0${time}` : `${time}`;
}
