// @flow
import React from 'react';
import {
  InteractionManager, Dimensions, ScrollView, View, StyleSheet,
  LayoutAnimation,
} from 'react-native';
import { range, round } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DeviceInfo from 'react-native-device-info';

import { DurationActions, SettingsActions } from '../../actions';
import { colors, images, ImageButton } from '../../common/ui';
import SetItem from './components/SetItem';
import RoundButton from './components/RoundButton';

const ITEM_W = Dimensions.get('window').width / 2;
const DUR_ITEMS_COUNT = 11;

type Props = {
  duration: number,
  loadAllSettings: () => void,
  setDuration: (duration: number) => void,
  navigation: NavigationScreenProp<*>,
}

type State = {
  currentDuration: number,
  startOffset: number,
};

const mapStateToProps = ({ duration }) => ({
  duration: duration.duration,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  ...DurationActions,
  ...SettingsActions,
}, dispatch);

@connect(mapStateToProps, mapDispatchToProps)
export default class DurationSetScreen extends React.Component<Props, State> {
  $scroll: ScrollView;

  state = {
    currentDuration: 10,
    startOffset: 0,
  };

  componentDidMount() {
    this.props.loadAllSettings();
  }

  onScroll = ({ nativeEvent: { contentOffset: { x } } }: OnScrollEvent) => {
    LayoutAnimation.linear();
    this.setState({
      currentDuration: Math.round((x / ITEM_W) * 5) + 10,
    });
  };

  onScrollBeginDrag = ({ nativeEvent: { contentOffset } }: OnScrollEvent) => {
    LayoutAnimation.linear();
    this.setState({ startOffset: contentOffset.x });
  };

  onScrollEndDrag = ({ nativeEvent }: OnScrollEvent) => {
    const { contentOffset } = nativeEvent;
    const { startOffset } = this.state;

    if (!this.$scroll) return;

    const diffOffset = contentOffset.x - startOffset;
    if (Math.abs(diffOffset) >= ITEM_W / 2) {
      let offset = 0;
      if (diffOffset > 0) {
        offset = (Math.floor(contentOffset.x / ITEM_W) + 1) * ITEM_W;
      } else {
        offset = Math.floor(contentOffset.x / ITEM_W) * ITEM_W;
      }

      if (offset < 0 || offset >= (DUR_ITEMS_COUNT * (ITEM_W - 1))) return;

      this.$scroll.scrollTo({ x: offset, y: 0, animated: true });
    } else {
      this.$scroll.scrollTo({ x: startOffset, y: 0, animated: true });
    }
  };

  onStartPress = async () => {
    this.props.setDuration(this.state.currentDuration * 60);

    const batteryLevel = await DeviceInfo.getBatteryLevel() * 100;
    if (batteryLevel > 20) {
      InteractionManager.runAfterInteractions(() =>
        this.props.navigation.navigate('MeditationScreen'));
    } else {
      this.props.navigation.navigate('BatteryLowModal', {
        level: round(batteryLevel, 2),
      });
    }
  };

  renderItem = (item: number) => {
    const { currentDuration } = this.state;

    return (
      <SetItem
        key={item}
        value={item}
        selected={item === currentDuration}
      />
    );
  }

  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.navBar}>
          <ImageButton
            onPress={() =>
              navigation.navigate('OnBoardingScreen', { isAbout: true })}
            imageStyle={styles.aboutIcon}
            source={images.infoIcon}
          />

          <ImageButton
            onPress={() => navigation.navigate('SavedGalleryScreen')}
            imageStyle={styles.galleryIcon}
            source={images.gridIcon}
          />
        </View>
        <View style={styles.content}>
          <View style={styles.scrollContainer}>
            <ScrollView
              horizontal
              // eslint-disable-next-line no-return-assign
              ref={r => this.$scroll = r}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              onScroll={this.onScroll}
              onScrollEndDrag={this.onScrollEndDrag}
              onScrollBeginDrag={this.onScrollBeginDrag}
              scrollEventThrottle={16}
            >
              {range(10, 61, 5).map(this.renderItem)}
            </ScrollView>
          </View>

          <RoundButton onPressIn={this.onStartPress} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
    paddingVertical: 24,
  },

  navBar: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },

  galleryIcon: {
    width: 42,
    height: 32,
  },

  aboutIcon: {
    width: 32,
    height: 22,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingBottom: '12%',
  },

  scrollContainer: {
    height: 200,
  },

  scrollContent: {
    paddingHorizontal: ITEM_W / 2,
    backgroundColor: colors.black,
  },
});
