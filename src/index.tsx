import { NativeModules } from 'react-native';

type RnMusicPlayerType = {
  multiply(a: number, b: number): Promise<number>;
};

const { RnMusicPlayer } = NativeModules;

export default RnMusicPlayer as RnMusicPlayerType;
