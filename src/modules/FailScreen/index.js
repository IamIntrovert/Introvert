// @flow
import React, { Component } from 'react';
import {
  View, StyleSheet, Text, ImageBackground, TouchableWithoutFeedback,
} from 'react-native';
import _ from 'lodash';

import { colors, ColorProgress, images, ImageButton } from '../../common/ui';

const QUOTES = [
  {
    author: 'New Philosopher, Jessa Gamble',
    text: '“Every great work of culture, be it a scientific ' +
          'breakthrough or a literary masterpiece, was achieved ' +
          'by a person who, at minimum, was able to pay attention.“',
  },
  {
    author: 'Wired 1197, Michael H. Goldhaber',
    text: '“The currency of the New Economy won\'t be money, but ' +
          'attention – A radical theory of value.“',
  },
  {
    author: 'Aeon, Tom Chatfield',
    text: '“If contentment and a sense of control are partial measures ' +
    'of success, many of us are selling ourselves far too cheap“',
  },
  {
    author: 'Simone Weil',
    text: '“L’attention est la forme la plus rare et la plus pure '
      + 'de la générosité.”',
  },
  {
    author: 'Susan Sontag',
    text: '“Attention is vitality. It connects you with others. It makes '
      + 'you eager. Stay eager.”',
  },
];

type Props = {
  navigation: NavigationScreenProp<*>,
};

export default class FailScreen extends Component<Props> {
  onClose() {
    this.props.navigation.pop(2);
  }

  render() {
    const { params } = this.props.navigation.state;
    const quote = QUOTES[_.random(0, QUOTES.length - 1)];

    return (
      <TouchableWithoutFeedback onPress={() => this.onClose()}>
        <View style={styles.container}>
          <ImageBackground
            style={styles.headerCont}
            source={images.failBackground}
            resizeMode="cover"
          >
            <View style={styles.navBar}>
              <ImageButton
                onPress={() => this.onClose()}
                source={images.closeBackOpIcon}
              />
            </View>
          </ImageBackground>

          <View style={styles.content}>
            <Text style={styles.headerText}>The artwork was destroyed.</Text>

            <Text style={styles.messageText}>
              {quote.text}
            </Text>

            <Text style={styles.authorNameText}>
              {quote.author}
            </Text>
          </View>

          <ColorProgress
            style={styles.progress}
            maxValue={params.maxDuration}
            value={params.currDuration}
            backgroundColor={colors.timeLineBackground}
            fillColor={colors.failTimeLineFront}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: 'space-between',
    paddingBottom: 32,
  },

  headerCont: {
    width: '100%',
    height: '50%',
    paddingTop: 32,
    paddingLeft: 24,
  },

  navBar: {
    height: 50,
    alignSelf: 'stretch',
  },

  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },

  headerText: {
    fontSize: 19,
    fontFamily: 'IBMPlexMono-Medium',
    color: colors.white,
  },

  messageText: {
    fontSize: 13,
    lineHeight: 24,
    fontFamily: 'IBMPlexMono-Italic',
    fontStyle: 'italic',
    color: colors.subText,
    marginTop: 32,
  },

  authorNameText: {
    fontSize: 13,
    lineHeight: 24,
    fontFamily: 'IBMPlexMono',
    color: colors.subText,
    marginTop: 20,
    marginLeft: 16,
  },

  progress: {
    paddingHorizontal: 24,
  },
});
