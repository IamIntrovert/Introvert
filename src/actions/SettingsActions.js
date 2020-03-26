// @flow
import { SettingsActionTypes } from '../constants';
import { saveHelper } from '../common/utils';

const SOUND_STATE_TAG = 'SOUND_STATE_TAG';

export function setSoundStatePref(soundOn: boolean) {
  return (dispatch: Function) => {
    // Save sound
    saveHelper.saveFlag(SOUND_STATE_TAG, soundOn);

    dispatch({
      soundOn,
      type: SettingsActionTypes.SET_SOUND_STATE,
    });
  };
}

export function getSoundStatePref() {
  return async (dispatch: Function) => {
    const soundOn = await saveHelper.getFlag(SOUND_STATE_TAG);

    dispatch({
      soundOn,
      type: SettingsActionTypes.SET_SOUND_STATE,
    });
  };
}

export function loadAllSettings() {
  return async (dispatch: Function) => {
    const soundOn = await saveHelper.getFlag(SOUND_STATE_TAG);

    dispatch({
      type: SettingsActionTypes.LOAD_ALL_SETTINGS,
      settings: {
        soundOn,
      },
    });
  };
}
