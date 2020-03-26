// @flow
import { SettingsActionTypes } from '../actions';

export type SetSoundStateAction = {|
  type: SettingsActionTypes.SET_SOUND_STATE,
  soundOn: boolean,
|};

export type LoadAllSettingsAction = {|
  type: SettingsActionTypes.LOAD_ALL_SETTINGS,
  settings: {|
    soundOn: boolean,
  |},
|};

export type SettingsAction =
| SetSoundStateAction
| LoadAllSettingsAction;
