import { AppRegistry, YellowBox } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";

YellowBox.ignoreWarnings([
  "Warning: componentWillMount is deprecated",
  "Warning: componentWillUpdate is deprecated",
  "Warning: componentWillReceiveProps is deprecated",
  "TTS",
  "Touch"
]);

AppRegistry.registerComponent(appName, () => App);
