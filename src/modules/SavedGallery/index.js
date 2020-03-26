// @flow
import React from 'react';
import { View, StyleSheet, LayoutAnimation, CameraRoll } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logger } from 'react-native-logger';

import { colors, images, ImageButton } from '../../common/ui';
import GridPicturesList from './components/GridPicturesList';
import HorizontalPicturesList from './components/HorizontalPicturesList';

import { GalleryActions } from '../../actions';
import groupByDateImages from '../../reducers/gallery/selectors';

type Props = {
  filesInfo: Array<FileInfo>,
  groupFilesInfo: Array<FileInfo>,
  loadAllImages: () => void,
  deleteImage: (fileName: string) => void,
  navigation: NavigationScreenProp<*>,
};

type State = {
  selectedName: string,
  gridMode: boolean,
};

const mapStateToProps = state => ({
  filesInfo: state.gallery.filesInfo,
  groupFilesInfo: groupByDateImages(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(
  GalleryActions,
  dispatch
);

@connect(mapStateToProps, mapDispatchToProps)
export default class SavedGalleryScreen extends React.Component<Props, State> {
  state = {
    selectedName: '',
    gridMode: true,
  };

  componentDidMount() {
    this.props.loadAllImages();
  }

  onImagePress = (selectedName: string) => {
    LayoutAnimation.linear();
    this.setState({
      selectedName,
      gridMode: !this.state.gridMode,
    });
  }

  onSelectedImageChanges = (selectedName: string) => {
    this.setState({ selectedName });
  }

  onDeleteImage = () => {
    const { filesInfo } = this.props;
    const { selectedName } = this.state;

    if (selectedName !== '') {
      const selectedIdx = filesInfo
        .findIndex(file => file.name === selectedName);
      if (selectedIdx !== -1 && filesInfo.length > 1) {
        const nextIdx = selectedIdx === (filesInfo.length - 1)
          ? selectedIdx - 1 : selectedIdx + 1;
        this.setState({ selectedName: filesInfo[nextIdx].name });
      } else {
        this.setState({ selectedName: '' });
      }

      this.props.deleteImage(selectedName);
    }
  }

  onExportToGallery = async () => {
    const { selectedName } = this.state;

    if (selectedName === '') return;

    try {
      await CameraRoll.saveToCameraRoll(`file://${selectedName}`, 'photo');
    } catch (err) {
      logger.log(err);
    }
  }

  render() {
    const { navigation } = this.props;
    const { gridMode, selectedName } = this.state;

    const itemAction = gridMode
      ? () => navigation.navigate('DownloadPostersScreen')
      : this.onExportToGallery;

    return (
      <View style={styles.container}>
        <View style={styles.navBar}>
          <ImageButton
            onPress={() => this.props.navigation.goBack()}
            source={images.closeIcon}
          />

          <View style={styles.rightNavItemsCont}>
            {!gridMode && (
              <ImageButton
                imageStyle={styles.trashIcon}
                onPress={this.onDeleteImage}
                source={images.eraseIcon}
                resizeMode="contain"
              />
            )}

            <ImageButton
              onPress={itemAction}
              source={gridMode ? images.printIcon : images.downloadIcon}
              resizeMode="contain"
            />
          </View>
        </View>

        {gridMode ? (
          <GridPicturesList
            filesInfo={this.props.groupFilesInfo}
            onImagePress={this.onImagePress}
          />
        ) : (
          <HorizontalPicturesList
            initSelectedName={selectedName}
            filesInfo={this.props.filesInfo}
            onImagePress={this.onImagePress}
            onSelectedImageChanges={this.onSelectedImageChanges}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.black,
    paddingTop: 24,
  },

  navBar: {
    height: 50,
    flexDirection: 'row',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
  },

  trashIcon: {
    marginRight: 30,
  },

  rightNavItemsCont: {
    flexDirection: 'row',
  },
});
