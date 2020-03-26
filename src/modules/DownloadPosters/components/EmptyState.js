// @flow
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { colors } from '../../../common/ui';

type Props = {
  style?: ?Object;
  imagesCount: number;
};

export default function EmptyState({ style, imagesCount }: Props) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.headerText}>{imagesCount} / 30</Text>
      <Text style={styles.messageText}>
        Collect 30 artworks and you can download it in a poster format.
      </Text>
    </View>
  );
}

EmptyState.defaultProps = {
  style: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: colors.black,
  },

  headerText: {
    color: colors.white,
    fontSize: 24,
    fontFamily: 'IBMPlexMono-Medium',
    textAlign: 'center',
    marginBottom: '30%',
  },

  messageText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: 'IBMPlexMono',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 32,
  },
});
