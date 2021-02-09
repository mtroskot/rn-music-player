import React from 'react';
import { Text, View } from 'react-native';
import styles from './playerSlider.styles';
import Slider from '@react-native-community/slider';

interface PlayerSliderProps {
  sliderValue: number;
  playbackTime: string;
  isDisabled: boolean;
  onSlidingComplete: (value: number) => void;
  playbackDuration: string;
}

const PlayerSlider: React.FC<PlayerSliderProps> = ({ sliderValue, playbackDuration, playbackTime, isDisabled, onSlidingComplete }) => {
  return (
    <View style={styles.container}>
      <Text>{playbackTime}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={sliderValue}
        disabled={isDisabled}
        minimumTrackTintColor="#babcbf"
        maximumTrackTintColor="#babcbf"
        onSlidingComplete={onSlidingComplete}
      />
      <Text>{playbackDuration}</Text>
    </View>
  );
};

export default React.memo(PlayerSlider);
