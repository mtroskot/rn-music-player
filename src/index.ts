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
const isAndroid = Platform.OS === 'android';

function currentSongTitle(): Promise<string> {
  return Player.currentSongTitle();
}

function getCurrentPlaybackRate(): Promise<number> {
  return Player.getCurrentPlaybackRate();
}

function getPlaybackDuration(): Promise<number> {
  return Player.getPlaybackDuration();
}

async function getPlaybackTime(): Promise<number> {
  return Player.getPlaybackTime();
}

// TODO Android not ready
function getPlayerState(): Promise<IPlayerState> {
  return Player.getPlayerState();
}

async function getRepeatMode(): Promise<RepeatMode> {
  return Player.getRepeatMode();
}

function getShuffleMode(): Promise<ShuffleMode> {
  if (isIOS) {
    return Player.getShuffleMode();
  } else {
    throw new Error('Not implemented');
  }
}

function isPlaying(): Promise<boolean> {
  return Player.isPlaying();
}

function isPreparedToPlay(): Promise<boolean> {
  if (isIOS) {
    return Player.isPreparedToPlay();
  } else {
    throw new Error('Not implemented');
  }
}

function next(): Promise<void> {
  return Player.next();
}

function pause(): Promise<void> {
  return Player.pause();
}

function play(): Promise<void> {
  return Player.play();
}

function prepareToPlay(): Promise<void> {
  if (isIOS) {
    return Player.prepareToPlay();
  } else {
    throw new Error('iOS only');
  }
}

function previous(): Promise<void> {
  return Player.previous();
}

function setPlaybackTime(timeInSeconds: number): Promise<RepeatMode> {
  return Player.setPlaybackTime(timeInSeconds);
}

function setRepeatMode(repeatMode: RepeatMode): Promise<void> {
  return Player.setRepeatMode(repeatMode);
}

function setShuffleMode(shuffleMode: ShuffleMode): Promise<void> {
  if (isIOS) {
    return Player.setShuffleMode(shuffleMode);
  } else {
    throw new Error('Not implemented');
  }
}

function skipToBeginning(): Promise<void> {
  return Player.skipToBeginning();
}

function stop(): Promise<void> {
  return Player.stop();
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

function playAppleMusicSongById(songId: string): Promise<void> {
  if (isIOS) {
    return Player.playAppleMusicSongById(songId);
  } else {
    throw new Error('Not implemented');
  }
}

function playLocalSongById(songId: string): Promise<void> {
  if (isIOS) {
    return Player.playLocalSongById(songId);
  } else {
    throw new Error('Not implemented');
  }
}

function setAppleMusicQueue(songIds: string[], startPlaying = false, startID?: string): Promise<void> {
  if (isIOS) {
    return Player.setAppleMusicQueue(songIds, startPlaying, startID);
  } else {
    throw new Error('Not implemented');
  }
}

function setLocalMusicQueue(songIds: string[], startPlaying = false, startID?: string): Promise<void> {
  if (isIOS) {
    return Player.setLocalMusicQueue(songIds, startPlaying, startID);
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

// TODO update type
function getUserSongs(): Promise<UserPlaylistItem[] | null> {
  return Player.getUserSongs();
}

function getVolume(): Promise<number> {
  return Player.getVolume();
}

function setVolume(volume: number): Promise<void> {
  return Player.setVolume(volume);
}

function initializeMusicPlayerAndroid(): Promise<void> {
  if (isAndroid) {
    return Player.initializeMusicPlayer();
  } else {
    throw new Error('Android only');
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
  playAppleMusicSongById,
  playLocalSongById,
  setAppleMusicQueue,
  setLocalMusicQueue,
  getUserPlaylists,
  getUserSongs,
  getVolume,
  setVolume,
  initializeMusicPlayerAndroid,
};
