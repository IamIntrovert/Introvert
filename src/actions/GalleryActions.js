// @flow
import RNFetchBlob from 'rn-fetch-blob';
import RNImageProcessor from 'react-native-image-processor';
import moment from 'moment';

import { GalleryActionTypes } from '../constants';
import { saveHelper } from '../common/utils';
import { colors } from '../common/ui';

export function loadAllImages() {
  return async (dispatch: Dispatch) => {
    const filesInfo = await saveHelper.loadAllImages();

    // Test if images exists and if not delete them and store files;
    const filesExistResults = await Promise.all(filesInfo.map(
      async file => RNFetchBlob.fs.exists(file.name)
    ));
    const existingFiles = filesInfo.filter((_, idx) => filesExistResults[idx])
      .sort((f1: FileInfo, f2: FileInfo) => {
        if (moment(f1.date).isSame(f2.date)) return 0;
        if (moment(f1.date).isBefore(f2.date)) return 1;

        return -1;
      });

    saveHelper.saveAllImages(existingFiles);

    dispatch({
      type: GalleryActionTypes.LOAD_SAVED_IMAGES,
      payload: existingFiles,
    });
  };
}

export function deleteImage(fileName: string) {
  return async (dispatch: Dispatch, getState: Function) => {
    dispatch({
      type: GalleryActionTypes.DELETE_IMAGE,
      payload: fileName,
    });

    const { gallery: { filesInfo } } = getState();
    saveHelper.saveAllImages(filesInfo);
    await RNFetchBlob.fs.unlink(`file://${fileName}`);
  };
}

export function makePoster(files: Array<FileInfo>) {
  return async (dispatch: Dispatch) => {
    dispatch({ type: GalleryActionTypes.TOGGLE_MAKING_POSTER });

    const posterOptions = {
      columnsCount: 5,
      imgCellW: 300,
      imgCellH: 300,
      startX: 210,
      startY: 354,
      horSpace: 140,
      vertSpace: 200,
    };

    const posterName = `poster_${moment().format('YYYYMMDD_HHmmss')}`;
    await RNImageProcessor.drawMosaicImage(
      files.map(f => f.name),
      posterName,
      colors.black,
      posterOptions
    );
    RNImageProcessor.saveToGallery(posterName, 'png');
    dispatch({ type: GalleryActionTypes.TOGGLE_MAKING_POSTER });
  };
}
