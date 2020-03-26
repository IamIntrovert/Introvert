// @flow
import LaunchScreen from '../modules/LaunchScreen';
import OnBoardingScreen from '../modules/OnBoarding';
import DurationSetScreen from '../modules/DurationSet';
import SavedGalleryScreen from '../modules/SavedGallery';
import MeditationScreen from '../modules/MeditationScreen/index.ios';
import FailScreen from '../modules/FailScreen';
import DownloadPostersScreen from '../modules/DownloadPosters';
import BatteryLowModal
  from '../modules/MeditationScreen/screens/BatteryLowModal';

export default {
  LaunchScreen: { screen: LaunchScreen },
  OnBoardingScreen: { screen: OnBoardingScreen },
  SavedGalleryScreen: { screen: SavedGalleryScreen },
  DurationSetScreen: { screen: DurationSetScreen },
  MeditationScreen: { screen: MeditationScreen },
  FailScreen: { screen: FailScreen },
  DownloadPostersScreen: { screen: DownloadPostersScreen },
  BatteryLowModal: { screen: BatteryLowModal },
};
