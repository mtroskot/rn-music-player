import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  sliderWrapper: {
    flex: 0.75,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  slider: { width: '80%', height: 40 },
  volumeWrapper: {
    flex: 0.15,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default styles;
