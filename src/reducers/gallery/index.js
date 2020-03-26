// @flow
import moment from 'moment';

import { GalleryActionTypes } from '../../constants';

type State = {
  filesInfo: Array<FileInfo>,
  isMakingPoster: boolean,
};

const initialState = {
  filesInfo: [],
  isMakingPoster: false,
};

export default function duration(
  state: State = initialState,
  action: ReduxAction
): State {
  switch (action.type) {
    case GalleryActionTypes.LOAD_SAVED_IMAGES:
      return {
        ...state,
        filesInfo: action.payload.sort((f1: FileInfo, f2: FileInfo) => {
          if (moment(f1.date).isSame(f2.date)) return 0;
          if (moment(f1.date).isBefore(f2.date)) return 1;

          return -1;
        }),
      };

    case GalleryActionTypes.DELETE_IMAGE:
      return {
        ...state,
        filesInfo: state.filesInfo.filter(i => i.name !== action.payload),
      };

    case GalleryActionTypes.TOGGLE_MAKING_POSTER:
      return {
        ...state,
        isMakingPoster: !state.isMakingPoster,
      };

    default:
      return state;
  }
}
