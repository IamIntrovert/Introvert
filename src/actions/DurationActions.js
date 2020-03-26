// @flow
import { DurationActionTypes } from '../constants';

// eslint-disable-next-line
export function setDuration(duration: number) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: DurationActionTypes.SET_DURATION,
      payload: duration,
    });
  };
}
