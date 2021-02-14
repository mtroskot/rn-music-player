import { AppRegistry } from 'react-native';
import App from './src/AppAndroid';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
