// @flow
import React from 'react';
import {
  ActivityIndicator, View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { GalleryActions } from '../../actions';

import { colors, images, ImageButton } from '../../common/ui';
import EmptyState from './components/EmptyState';
import PicturesGrid from './components/PicturesGrid';

const MAX_PICS = 30;

type Props = {
  style: Object,
  filesInfo: Array<FileInfo>,
  isMakingPoster: boolean,
  makePoster: (files: Array<FileInfo>) => void,
  navigation: NavigationScreenProp<*>,
};

const mapStateToProps = ({ gallery }) => ({
  filesInfo: gallery.filesInfo,
  isMakingPoster: gallery.isMakingPoster,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(
  GalleryActions,
  dispatch
);

@connect(mapStateToProps, mapDispatchToProps)
export default class DownloadPosters extends React.Component<Props> {
  static defaultProps = {
    style: null,
  };

  onGetPosters = () => {
    this.props.makePoster(this.props.filesInfo);
  };

  renderDownloadBtn() {
    if (this.props.isMakingPoster) {
      return <ActivityIndicator size="small" color={colors.white} />;
    }

    return this.props.filesInfo.length >= MAX_PICS ? (
      <TouchableOpacity
        onPress={this.onGetPosters}
      >
        <Text style={styles.downloadText}>Download</Text>
      </TouchableOpacity>
    ) : null;
  }

  render() {
    const { filesInfo, style } = this.props;

    return (
      <View style={[styles.container, style]}>
        <View style={styles.navBar}>
          <ImageButton
            onPress={() => this.props.navigation.goBack()}
            source={images.closeBackOpIcon}
          />
        </View>

        {filesInfo.length < MAX_PICS ? (
          <EmptyState imagesCount={filesInfo.length} />
        ) : (
          <PicturesGrid
            style={styles.galleryView}
            filesInfo={filesInfo.slice(0, MAX_PICS)}
          />
        )}

        <View style={styles.footer}>
          {this.renderDownloadBtn()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.dark2,
    paddingHorizontal: 32,
  },

  navBar: {
    height: 135,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },

  galleryView: {
    width: '100%',
  },

  footer: {
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },

  downloadText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: 'IBMPlexMono-Medium',
  },
});
