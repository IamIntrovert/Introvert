// @flow
import React, { Component } from 'react';
import { StyleSheet, SectionList, Text } from 'react-native';

import { colors } from '../../../common/ui';
import ScrollGridCell from './ScrollGridCell';

type Props = {
  style: ?Object,
  filesInfo: Array<FileInfo>,
  onImagePress: (fileName: string) => void,
};

export default class GridPicturesList extends Component<Props> {
  static defaultProps = {
    style: null,
  };

  shouldComponentUpdate(newProps: Props) {
    return newProps.filesInfo !== this.props.filesInfo;
  }

  renderSectionHeader = ({ section }: { section: { title: string }}) => (
    <Text style={styles.sectionTitle}>
      {section.title}
    </Text>
  );

  // eslint-disable-next-line react/no-unused-prop-types
  renderItem = ({ item }: { item: Array<FileInfo> }) => (
    <ScrollGridCell
      filesInfo={item}
      onImagePress={this.props.onImagePress}
    />
  );

  render() {
    const { filesInfo, style } = this.props;

    return (
      <SectionList
        style={[styles.container, style]}
        contentContainerStyle={styles.listContent}
        renderItem={this.renderItem}
        keyExtractor={(file: FileInfo) =>
          `${file.name}${Math.random() * 100000}`}
        renderSectionHeader={this.renderSectionHeader}
        sections={filesInfo}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: colors.black,
  },

  listContent: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },

  sectionTitle: {
    color: colors.white,
    backgroundColor: colors.black,
    fontSize: 19,
    fontFamily: 'IBMPlexMono-Medium',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
