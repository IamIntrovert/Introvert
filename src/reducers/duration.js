// @flow
import { DurationActionTypes } from '../constants';

type State = {
  duration: number;
};

const initialState = {
  duration: 0,
};

export default function duration(
  state: State = initialState,
  action: ReduxAction
): State {
  switch (action.type) {
    case DurationActionTypes.SET_DURATION:
      return {
        ...state,
        duration: action.payload,
      };

    default:
      return state;
  }
}
