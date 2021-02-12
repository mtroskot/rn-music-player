import React from 'react';
import Slider from '@react-native-community/slider';
import { Text, View } from 'react-native';
import styles from './volumeSlider.styles';

interface VolumeSliderProps {
  volume: number;
  onSlide: (value: number) => void;
}

const VolumeSlider: React.FC<VolumeSliderProps> = ({ volume, onSlide }) => {
  return (
    <View style={styles.container}>
      <View style={styles.sliderWrapper}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          minimumTrackTintColor="#babcbf"
          maximumTrackTintColor="#babcbf"
          step={0.05}
          onValueChange={onSlide}
        />
      </View>
      <View style={styles.volumeWrapper}>
        <Text>{Math.round(volume * 100)}%</Text>
      </View>
    </View>
  );
};

export default React.memo(VolumeSlider);
