// @flow
import { SettingsActionTypes } from '../constants';

type State = {
  soundOn: boolean,
};

const initialState = {
  soundOn: true,
};

export default function duration(
  state: State = initialState,
  action: SettingsAction
): State {
  switch (action.type) {
    case SettingsActionTypes.SET_SOUND_STATE:
      return {
        ...state,
        soundOn: action.soundOn,
      };

    case SettingsActionTypes.LOAD_ALL_SETTINGS:
      return {
        ...state,
        settings: {
          ...action.settings,
        },
      };

    default:
      return state;
  }
}
