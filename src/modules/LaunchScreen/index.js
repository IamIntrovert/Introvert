// @flow
import React from 'react';
import { StyleSheet, ImageBackground } from 'react-native';

import { CommonActions } from '../../actions';
import { images } from '../../common/ui';

const SHOW_TIMEOUT = 3000;

type Props = {
  navigation: NavigationScreenProp<*>,
};

export default class LaunchScreen extends React.Component<Props> {
  showTimer: TimeoutID;

  componentDidMount() {
    this.showTimer = setTimeout(async () => {
      if (await CommonActions.isFirstRun()) {
        this.props.navigation.navigate('OnBoardingScreen', { isAbout: false });
      } else {
        this.props.navigation.navigate('DurationSetScreen');
      }
    }, SHOW_TIMEOUT);
  }

  componentWillUnmount() {
    clearTimeout(this.showTimer);
  }

  render() {
    return (
      <ImageBackground
        style={styles.container}
        source={images.launchBackground}
        resizeMode="cover"
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
