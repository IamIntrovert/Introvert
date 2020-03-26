// @flow
import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { Logger } from 'react-native-logger';

import { colors, images, ImageButton } from '../../../common/ui';

type Props = {
  style: ?Object,
};

export default class Ethos extends React.Component<Props> {
  static defaultProps = {
    style: null,
  };

  onLinkPress = async () => {
    try {
      await Linking.openURL('www.iamintrovert.co');
    } catch (err) {
      Logger.error(err);
    }
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Text style={styles.titleText}>Ethos</Text>
        <Text style={styles.messageText}>
          Attention, the ability to pay it and where it is directed, is the most
          valuable tool, the most accurate compass in navigating through
          reality.
        </Text>

        <Text style={styles.messageText}>
          Ultimately it will dictate whether one feels in charge of ones´
          reality or helplessly drowned in a ceaseless stream of noise.
        </Text>

        <Text style={styles.messageText}>
          Are you still paying attention? You can turn off the noise.
        </Text>

        <View style={styles.linkCont}>
          <ImageButton
            imageStyle={styles.linkIcon}
            source={images.linkIcon}
            onPress={this.onLinkPress}
          />

          <Text
            style={styles.linkText}
            onPress={this.onLinkPress}
          >
            www.iamintrovert.co
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 32,
    paddingBottom: 24,
  },

  titleText: {
    color: colors.white,
    fontSize: 20,
    fontFamily: 'IBMPlexMono-Medium',
    marginBottom: 16,
  },

  messageText: {
    color: colors.subText,
    fontFamily: 'IBMPlexMono',
    fontSize: 13,
    lineHeight: 22,
    marginBottom: 16,
  },

  linkCont: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },

  linkIcon: {
    width: 25,
    height: 25,
  },

  linkText: {
    color: colors.subText,
    fontFamily: 'IBMPlexMono',
    fontSize: 13,
    marginLeft: 8,
  },
});
