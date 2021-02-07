import { NativeEventEmitter, NativeModules } from 'react-native';

export type ShuffleMode = 'off' | 'songs' | 'albums';
export type RepeatMode = 'none' | 'one' | 'all';
export interface PlayerState {
  trackName: string | null;
  author: string | null;
  playbackDuration: number;
  playbackPosition: number;
  isPlaying: boolean;
  artwork: string;
}

type MusicPlayerType = {
  prepareToPlay(): Promise<void>;
  isPreparedToPlay(): Promise<boolean>;
  play(): Promise<void>;
  pause(): Promise<void>;
  stop(): Promise<void>;
  next(): Promise<void>;
  skipToBeginning(): Promise<void>;
  previous(): Promise<void>;
  currentSongTitle(): Promise<string>;
  isPlaying(): Promise<boolean>;
  setShuffleMode(shuffleMode: ShuffleMode): Promise<void>;
  getShuffleMode(): Promise<ShuffleMode>;
  setRepeatMode(repeatMode: RepeatMode): Promise<void>;
  getRepeatMode(): Promise<RepeatMode>;
  setPlaybackTime(timeInSeconds: number): Promise<RepeatMode>;
  getPlaybackTime(): Promise<number>; // returns seconds
  getCurrentPlaybackRate(): Promise<number>; // returns seconds
  getPlaybackDuration(): Promise<number>; // returns seconds
  getPlayerState(): Promise<PlayerState>; // returns seconds
};

const { MusicPlayer } = NativeModules;
const MusicPlayerEvents = new NativeEventEmitter(MusicPlayer);
export { MusicPlayerEvents };
export default MusicPlayer as MusicPlayerType;
