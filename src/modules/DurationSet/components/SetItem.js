// @flow
import React from 'react';
import { View, Dimensions, StyleSheet, Text } from 'react-native';

import { colors } from '../../../common/ui';

const itemWidth = Dimensions.get('window').width / 2;

type Props = {
  style: ?Object,
  value: number,
  selected: boolean,
};

export default function SetItem({
  style,
  value,
  selected,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.text, selected ? styles.selectedText : null]}>
        {value}
      </Text>
    </View>
  );
}

SetItem.defaultProps = {
  style: null,
};

const styles = StyleSheet.create({
  container: {
    width: itemWidth,
    height: 200,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    color: colors.dark1,
    fontSize: 130,
    fontWeight: '100',
    fontFamily: 'IBMPlexMono-ExtraLight',
  },

  selectedText: {
    color: colors.white,
  },
});
