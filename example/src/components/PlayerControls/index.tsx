import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { RepeatMode, ShuffleMode } from 'rn-music-player';
import PlayerControlButton from '../PlayerControlButton';
import styles from './playeControls.styles';

interface PlayerControlsProps {
  onShufflePress: () => void;
  shuffleMode: ShuffleMode | null;
  onRepeatPress: () => void;
  repeatMode: RepeatMode | null;
  onPreviousPress: () => void;
  onTogglePlayPress: () => void;
  onNextPress: () => void;
  isPlaying: boolean;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  onShufflePress,
  shuffleMode,
  onRepeatPress,
  repeatMode,
  onPreviousPress,
  onTogglePlayPress,
  onNextPress,
  isPlaying,
}) => {
  function getRepeatModeIcon() {
    switch (repeatMode) {
      case 'all':
      case 'none':
        return 'repeat';
      case 'one':
        return 'repeat-one';
      default:
        return 'repeat';
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onShufflePress} hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}>
        <Icon name="shuffle" size={30} color={shuffleMode === 'off' ? '#babcbf' : '#000'} />
      </TouchableOpacity>
      <View style={styles.playerControlsWrapper}>
        <PlayerControlButton onPress={onPreviousPress} iconName={'play-skip-back'} />
        <PlayerControlButton onPress={onTogglePlayPress} iconName={isPlaying ? 'pause' : 'play'} />
        <PlayerControlButton onPress={onNextPress} iconName={'play-skip-forward'} />
      </View>
      <TouchableOpacity onPress={onRepeatPress} hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}>
        <Icon name={getRepeatModeIcon()} size={30} color={repeatMode === 'none' ? '#d9d9db' : '#000'} />
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(PlayerControls);
