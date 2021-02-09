# rn-music-player

Music player for playing music from iOS's & Android Music Library.
Premium Apple Music will be added this week.
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
coming implementation soon...

Add to your AndroidManifest
```
  <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

## Usage

```js
import MusicPlayer, { MusicPlayerEvents, AppleMusicRequests, IPlayerState } from 'rn-music-player';

// ...
useEffect(() => {
  MusicPlayer.play();
  MusicPlayerEvents.addListener('onSongChange', (playerState: IPlayerState) => {
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
