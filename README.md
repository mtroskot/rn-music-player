# rn-music-player

Music player for playing music from iOS's & Android Music Library and Premium Apple Music.
More features are yet to come.

## Installation

```sh
npm install rn-music-player
```

### iOS

```sh
$ npm install react-native-swift
$ react-native swiftify
$ cd ios && pod install
$ react-native run-ios
```

Add to your info.plist

```
  <key>NSAppleMusicUsageDescription</key>
  <string>{/*description*/}</string>
```

Set Swift version to 4.2 or higher.

Min supported iOS version 10.3

### Android
```sh
$ react-native run-android
```

Add to your AndroidManifest

```
  <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

## Supported Features

An [Example](./example) project was developed to exercise and test all functionality within this library. If you are curious about how to use something, or need to compare your application setup to something that works, check there first.
<img src="https://user-images.githubusercontent.com/26821326/107419983-b1204000-6b18-11eb-80b1-cf31c899242a.png" width="400"/>

## Features

The following table shows the platform support for various functionality within this library.

| Feature                        | iOS | Android |
| :----------------------------- | :-: | :-----: |
| `currentSongTitle`             | ✅  |   ✅    |
| `getCurrentPlaybackRate`       | ✅  |   ✅    |
| `getPlaybackDuration`          | ✅  |   ✅    |
| `getPlaybackTime`              | ✅  |   ✅    |
| `getPlayerState`               | ✅  |   ❌    |
| `getRepeatMode`                | ✅  |   ✅    |
| `getShuffleMode`               | ✅  |   ❌    |
| `isPlaying`                    | ✅  |   ✅    |
| `isPreparedToPlay`             | ✅  |   ❌    |
| `next`                         | ✅  |   ✅    |
| `play`                         | ✅  |   ✅    |
| `playAppleMusicSongById`       | ✅  |   ❌    |
| `playLocalSongById`            | ✅  |   ❌    |
| `setAppleMusicQueue`           | ✅  |   ❌    |
| `setLocalMusicQueue`           | ✅  |   ❌    |
| `pause`                        | ✅  |   ✅    |
| `prepareToPlay`                | ✅  |   ❌    |
| `previous`                     | ✅  |   ✅    |
| `setPlaybackTime`              | ✅  |   ✅    |
| `setRepeatMode`                | ✅  |   ✅    |
| `setShuffleMode`               | ✅  |   ❌    |
| `skipToBeginning`              | ✅  |   ✅    |
| `stop`                         | ✅  |   ✅    |
| `checkIfPremiumApple`          | ✅  |   ❌    |
| `getStoreFrontCountryCode`     | ✅  |   ❌    |
| `requestUserToken`             | ✅  |   ❌    |
| `requestAuthorization`         | ✅  |   ❌    |
| `getAuthorizationStatus`       | ✅  |   ❌    |
| `getUserPlaylists`             | ✅  |   ❌    |
| `getUserSongs`                 | ✅  |   ✅    |
| `getVolume`                    | ✅  |   ✅    |
| `setVolume`                    | ✅  |   ✅    |
| `initializeMusicPlayerAndroid` | ❌  |   ✅    |

### Event listeners

You can listen to MusicPlayerEvents events (Currently iOS only).

| MusicPlayerEvents           |
| --------------------------- |
| **`onPlay`**                |
| **`onPause`**               |
| **`onNext`**                |
| **`onStop`**                |
| **`onPrevious`**            |
| **`onSongChange`**          |
| **`systemVolumeDidChange`** |

### Apple Music API Requests

The module also exports **AppleMusicRequests**, which contains predefined requests to fetch data from [Apple Music API](https://developer.apple.com/documentation/applemusicapi/).
**AppleMusicRequests** functions return plain JavaScript objects which can be than used to make http requests with any library of your choice.

| AppleMusicRequests                       |
| ---------------------------------------- |
| **`fetchGenresRequest`**                 |
| **`fetchSongByIdRequest`**               |
| **`fetchAlbumByIdRequest`**              |
| **`fetchArtistByIdRequest`**             |
| **`fetchAlbumsAndSongsTopChartRequest`** |
| **`searchRequest`**                      |
| **`getUserPlaylistsRequest`**            |
| **`getPlaylistInfoRequest`**             |
| **`getMultiplePlaylistInfoRequest`**     |

## Good To Know

In order to make Apple Music Requests you need to have a Developer Token. [Read more about it here](https://developer.apple.com/documentation/applemusicapi/getting_keys_and_creating_tokens)
After that you can use [this script](https://github.com/pelauimagineering/apple-music-token-generator) to generate the JWT token for you.

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
