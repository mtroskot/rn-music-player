import React from 'react';
import { TouchableOpacity } from 'react-native';
import styles from './playerControlButton.styles';
import Icon from 'react-native-vector-icons/Ionicons';

interface PlayerControlButtonProps {
  onPress: () => void;
  iconName: string;
  iconColor?: string;
  iconSize?: number;
}

const PlayerControlButton: React.FC<PlayerControlButtonProps> = ({ onPress, iconSize, iconColor, iconName }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Icon name={iconName} size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
};
PlayerControlButton.defaultProps = {
  iconColor: '#000',
  iconSize: 30,
};

export default React.memo(PlayerControlButton);
