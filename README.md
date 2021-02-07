# rn-music-player

Music player for playing music from iOS's Music Library

## Installation

```sh
npm install rn-music-player
```

### iOS

```sh
npm install react-native-swift
react-native swiftify
```

Add to your info.plist
```
  <key>NSAppleMusicUsageDescription</key>
  <string>{/*description*/}</string>
```
Min supported iOS version 10.3

### Android
coming soon...

## Usage

```js
import MusicPlayer, { MusicPlayerEvents } from 'rn-music-player';
import type { PlayerState } from 'rn-music-player';

// ...
useEffect(() => {
  MusicPlayer.play();
  MusicPlayerEvents.addListener('onSongChange', (playerState: PlayerState) => {
    // handle song change
  });
  return () => {
    MusicPlayerEvents.removeAllListeners('onSongChange');
  };
}, []);
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
