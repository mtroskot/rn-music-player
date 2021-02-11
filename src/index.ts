import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import type {
  IMusicPlayer,
  IPlayerState,
  RepeatMode,
  ShuffleMode,
  AuthorizationStatus,
  UserPlaylist,
  UserPlaylistItem,
} from './interfaces';
import AppleMusicRequests from './api';
const { MusicPlayer } = NativeModules;

const Player = MusicPlayer as IMusicPlayer;
const isIOS = Platform.OS === 'ios';

function currentSongTitle(): Promise<string> {
  if (isIOS) {
    return Player.currentSongTitle();
  } else {
    throw new Error('Not implemented');
  }
}

function getCurrentPlaybackRate(): Promise<number> {
  if (isIOS) {
    return Player.getCurrentPlaybackRate();
  } else {
    throw new Error('Not implemented');
  }
}

function getPlaybackDuration(): Promise<number> {
  if (isIOS) {
    return Player.getPlaybackDuration();
  } else {
    throw new Error('Not implemented');
  }
}

function getPlaybackTime(): Promise<number> {
  if (isIOS) {
    return Player.getPlaybackTime();
  } else {
    throw new Error('Not implemented');
  }
}

function getPlayerState(): Promise<IPlayerState> {
  if (isIOS) {
    return Player.getPlayerState();
  } else {
    throw new Error('Not implemented');
  }
}

function getRepeatMode(): Promise<RepeatMode> {
  if (isIOS) {
    return Player.getRepeatMode();
  } else {
    throw new Error('Not implemented');
  }
}

function getShuffleMode(): Promise<ShuffleMode> {
  if (isIOS) {
    return Player.getShuffleMode();
  } else {
    throw new Error('Not implemented');
  }
}

function isPlaying(): Promise<boolean> {
  if (isIOS) {
    return Player.isPlaying();
  } else {
    throw new Error('Not implemented');
  }
}

function isPreparedToPlay(): Promise<boolean> {
  if (isIOS) {
    return Player.isPreparedToPlay();
  } else {
    throw new Error('Not implemented');
  }
}

function next(): Promise<void> {
  if (isIOS) {
    return Player.next();
  } else {
    throw new Error('Not implemented');
  }
}

function pause(): Promise<void> {
  if (isIOS) {
    return Player.pause();
  } else {
    throw new Error('Not implemented');
  }
}

function play(): Promise<void> {
  if (isIOS) {
    return Player.play();
  } else {
    throw new Error('Not implemented');
  }
}

function prepareToPlay(): Promise<void> {
  if (isIOS) {
    return Player.prepareToPlay();
  } else {
    throw new Error('Not implemented');
  }
}

function previous(): Promise<void> {
  if (isIOS) {
    return Player.previous();
  } else {
    throw new Error('Not implemented');
  }
}

function setPlaybackTime(timeInSeconds: number): Promise<RepeatMode> {
  if (isIOS) {
    return Player.setPlaybackTime(timeInSeconds);
  } else {
    throw new Error('Not implemented');
  }
}

function setRepeatMode(repeatMode: RepeatMode): Promise<void> {
  if (isIOS) {
    return Player.setRepeatMode(repeatMode);
  } else {
    throw new Error('Not implemented');
  }
}

function setShuffleMode(shuffleMode: ShuffleMode): Promise<void> {
  if (isIOS) {
    return Player.setShuffleMode(shuffleMode);
  } else {
    throw new Error('Not implemented');
  }
}

function skipToBeginning(): Promise<void> {
  if (isIOS) {
    return Player.skipToBeginning();
  } else {
    throw new Error('Not implemented');
  }
}

function stop(): Promise<void> {
  if (isIOS) {
    return Player.stop();
  } else {
    throw new Error('Not implemented');
  }
}

function checkIfPremiumApple(): Promise<boolean> {
  if (isIOS) {
    return Player.checkIfPremiumApple();
  } else {
    throw new Error('Not implemented');
  }
}

function getStoreFrontCountryCode(): Promise<string> {
  if (isIOS) {
    return Player.getStoreFrontCountryCode();
  } else {
    throw new Error('Not implemented');
  }
}

function requestUserToken(developerToken: string): Promise<string> {
  if (isIOS) {
    return Player.requestUserToken(developerToken);
  } else {
    throw new Error('Not implemented');
  }
}

function requestAuthorization(): Promise<AuthorizationStatus> {
  if (isIOS) {
    return Player.requestAuthorization();
  } else {
    throw new Error('Not implemented');
  }
}

function getAuthorizationStatus(): Promise<AuthorizationStatus> {
  if (isIOS) {
    return Player.getAuthorizationStatus();
  } else {
    throw new Error('Not implemented');
  }
}

function playSongById(songId: string): Promise<void> {
  if (isIOS) {
    return Player.playSongById(songId);
  } else {
    throw new Error('Not implemented');
  }
}

function setQueue(songIds: string[], startPlaying = false, startID?: string): Promise<void> {
  if (isIOS) {
    return Player.setQueue(songIds, startPlaying, startID);
  } else {
    throw new Error('Not implemented');
  }
}

function getUserPlaylists(): Promise<UserPlaylist[] | null> {
  if (isIOS) {
    return Player.getUserPlaylists();
  } else {
    throw new Error('Not implemented');
  }
}

function getUserSongs(): Promise<UserPlaylistItem[] | null> {
  if (isIOS) {
    return Player.getUserSongs();
  } else {
    throw new Error('Not implemented');
  }
}

function getVolume(): Promise<number> {
  if (isIOS) {
    return Player.getVolume();
  } else {
    throw new Error('Not implemented');
  }
}

function setVolume(volume: number): Promise<void> {
  if (isIOS) {
    return Player.setVolume(volume);
  } else {
    throw new Error('Not implemented');
  }
}

const MusicPlayerEvents = new NativeEventEmitter(MusicPlayer);
export { AppleMusicRequests, MusicPlayerEvents };
export type { IPlayerState, RepeatMode, ShuffleMode, IMusicPlayer, AuthorizationStatus, UserPlaylist };
export default {
  currentSongTitle,
  getCurrentPlaybackRate,
  getPlaybackDuration,
  getPlaybackTime,
  getPlayerState,
  getRepeatMode,
  getShuffleMode,
  isPlaying,
  isPreparedToPlay,
  next,
  play,
  pause,
  prepareToPlay,
  previous,
  setPlaybackTime,
  setRepeatMode,
  setShuffleMode,
  skipToBeginning,
  stop,
  checkIfPremiumApple,
  getStoreFrontCountryCode,
  requestUserToken,
  requestAuthorization,
  getAuthorizationStatus,
  playSongById,
  setQueue,
  getUserPlaylists,
  getUserSongs,
  getVolume,
  setVolume,
};
