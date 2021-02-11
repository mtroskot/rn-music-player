export type ShuffleMode = 'off' | 'songs' | 'albums';
export type RepeatMode = 'none' | 'one' | 'all';
export interface IPlayerState {
  playbackStoreID: string | null;
  trackName: string | null;
  author: string | null;
  playbackDuration: number;
  playbackPosition: number;
  isPlaying: boolean;
  artwork: string | null;
}
export interface IApiRequest {
  url: string;
  options: {
    method: 'GET' | 'POST' | 'PUT';
    headers: { 'Authorization': string; 'Music-User-Token'?: string };
  };
}

export interface UserPlaylist {
  persistentID: string;
  name: string;
  artwork: string | null;
  items: UserPlaylistItem[];
}

export interface UserPlaylistItem {
  persistentID: string;
  albumPersistentID: string;
  albumTitle: string;
  playbackDuration: 192.112;
  artist: string;
  title: string;
  albumArtist: string;
  artwork: string | null;
}

export type AuthorizationStatus = 'NOT_DETERMINED' | 'DENIED' | 'RESTRICTED' | 'AUTHORIZED';

export interface IMusicPlayer {
  currentSongTitle(): Promise<string>;
  getCurrentPlaybackRate(): Promise<number>; // returns seconds
  getPlaybackDuration(): Promise<number>; // returns seconds
  getPlaybackTime(): Promise<number>; // returns seconds
  getPlayerState(): Promise<IPlayerState>; // returns seconds
  getRepeatMode(): Promise<RepeatMode>;
  getShuffleMode(): Promise<ShuffleMode>;
  isPlaying(): Promise<boolean>;
  isPreparedToPlay(): Promise<boolean>;
  next(): Promise<void>;
  play(): Promise<void>;
  playSongById(songId: string): Promise<void>;
  setQueue(songIds: string[], startPlaying?: boolean, startID?: string): Promise<void>;
  pause(): Promise<void>;
  prepareToPlay(): Promise<void>;
  previous(): Promise<void>;
  setPlaybackTime(timeInSeconds: number): Promise<RepeatMode>;
  setRepeatMode(repeatMode: RepeatMode): Promise<void>;
  setShuffleMode(shuffleMode: ShuffleMode): Promise<void>;
  skipToBeginning(): Promise<void>;
  stop(): Promise<void>;
  checkIfPremiumApple(): Promise<boolean>;
  getStoreFrontCountryCode(): Promise<string>;
  requestUserToken(developerToken: string): Promise<string>;
  requestAuthorization(): Promise<AuthorizationStatus>;
  getAuthorizationStatus(): Promise<AuthorizationStatus>;
  getUserPlaylists(): Promise<UserPlaylist[] | null>;
  getUserSongs(): Promise<UserPlaylistItem[] | null>;
  getVolume(): Promise<number>;
  setVolume(volume: number): Promise<void>;
}
