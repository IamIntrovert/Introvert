// @flow
import React from 'react';
import { View, StyleSheet } from 'react-native';
import _ from 'lodash';

import PageIndicatorItem from './PageIndicatorItem';

const PAGES_COUNT = 4;

type Props = {
  style?: Object,
  selectedIdx?: number,
};

export default function PageIndicator(props: Props) {
  return (
    <View style={[styles.container, props.style]}>
      {_.range(PAGES_COUNT).map(i => (
        <PageIndicatorItem
          selected={i === props.selectedIdx}
          key={i}
        />
      ))}
    </View>
  );
}

PageIndicator.defaultProps = {
  style: null,
  selectedIdx: 0,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    height: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
