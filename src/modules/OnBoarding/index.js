// @flow
import React from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity, Image, ScrollView, Dimensions,
} from 'react-native';
import _ from 'lodash';

import { colors, images, ImageButton } from '../../common/ui';
import PageIndicator from './components/PageIndicator';
import Ethos from './components/Ethos';
import { CommonActions } from '../../actions';

const MSG_TEXT = [
  'Use Introvert whenever you need to direct your attention away from '
    + 'the everyday noise of your phone.',
  'The moment you turn on Introvert a generative algorithm will begin '
    + 'to form an unique artwork.',
  'The pattern so far developed is destroyed if the app is closed '
    + 'before the chosen time is up.',
  'Introvert will capture time spent uninterrupted and turn it into an '
    + 'artwork from where clues such as the time of the day of the '
    + 'artwork being made can be read.',
];

const IMAGES = [
  images.info1,
  images.info2,
  images.info3,
  images.info4,
];
const PAGES_COUNT = 4;
const PAGE_W = Dimensions.get('window').width;

type Props = {
  navigation: NavigationScreenProp<*>,
};

type State = {
  pageIdx: number,
};

export default class OnBoarding extends React.Component<Props, State> {
  horizScrollView: ScrollView;

  state = {
    pageIdx: 0,
  };

  onNextPage = () => {
    const { pageIdx } = this.state;
    if (pageIdx === PAGES_COUNT - 1) {
      this.onEndOnBoarding();
    } else {
      this.horizScrollView.scrollTo({
        y: 0,
        x: (pageIdx + 1) * PAGE_W,
        animated: true,
      });
      this.setState({ pageIdx: pageIdx + 1 });
    }
  };

  onPrevPage = () => {
    const { pageIdx } = this.state;
    if (pageIdx === 0) return;

    this.horizScrollView.scrollTo({
      y: 0,
      x: (pageIdx - 1) * PAGE_W,
      animated: true,
    });
    this.setState({ pageIdx: pageIdx - 1 });
  };

  onEndOnBoarding = async () => {
    await CommonActions.saveInstallationFlag(true);
    this.props.navigation.replace('DurationSetScreen');
  };

  onCloseScreenPress = () => {
    this.props.navigation.goBack();
  }

  onHorizontalScrollEnd = ({ nativeEvent }: OnScrollEvent) => {
    const nextPage = nativeEvent.contentOffset.x / PAGE_W;
    if (nextPage > this.state.pageIdx) {
      this.onNextPage();
    } else if (nextPage < this.state.pageIdx) {
      this.onPrevPage();
    }
  };

  renderCloseButton() {
    const { params } = this.props.navigation.state;

    if (!params.isAbout) {
      return (
        <TouchableOpacity
          style={styles.startBtn}
          onPress={this.onEndOnBoarding}
        >
          <Text style={styles.btnText}>Start</Text>
        </TouchableOpacity>
      );
    }

    return (
      <ImageButton
        onPress={this.onCloseScreenPress}
        source={images.closeIcon}
      />
    );
  }

  renderPages() {
    return (
      <React.Fragment>
        <ScrollView
          horizontal
          pagingEnabled
          onMomentumScrollEnd={this.onHorizontalScrollEnd}
          // eslint-disable-next-line no-return-assign
          ref={r => this.horizScrollView = r}
        >
          {_.range(0, 4).map((_item, idx) => (
            <View
              style={styles.helpPageCont}
              key={`${Math.random() * 100000}`}
            >
              <Image
                style={styles.aboutPic}
                source={IMAGES[idx]}
                resizeMode="cover"
              />

              <Text style={styles.messageText}>
                {MSG_TEXT[idx]}
              </Text>
            </View>
          ))}
        </ScrollView>

        <PageIndicator
          style={styles.pageIndicator}
          selectedIdx={this.state.pageIdx}
        />
      </React.Fragment>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          {this.renderCloseButton()}
        </View>

        <ScrollView>
          <Text style={styles.contentTitleText}>How does it work?</Text>

          {this.renderPages()}
          <Ethos />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    paddingTop: 32,
    paddingBottom: 28,
  },

  header: {
    width: '100%',
    paddingHorizontal: 24,
  },

  startBtn: {
    marginLeft: 8,
    alignSelf: 'flex-end',
  },

  contentTitleText: {
    color: colors.white,
    fontSize: 20,
    fontFamily: 'IBMPlexMono-Medium',
    marginTop: 16,
    marginLeft: 32,
    marginBottom: 24,
  },

  helpPageCont: {
    paddingHorizontal: 32,
    width: PAGE_W,
  },

  pageIndicator: {
    paddingHorizontal: 32,
    marginTop: 16,
    marginBottom: 32,
  },

  aboutPic: {
    minHeight: 250,
    height: '20%',
    width: '100%',
    marginBottom: 32,
  },

  messageText: {
    color: colors.subText,
    fontSize: 14,
    lineHeight: 26,
    fontFamily: 'IBMPlexMono',
  },

  btnText: {
    fontSize: 19,
    color: colors.white,
    fontFamily: 'IBMPlexMono-Medium',
  },
});
