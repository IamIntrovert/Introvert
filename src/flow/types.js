// @flow
// eslint-disable-next-line no-unused-vars
import type { NavigationScreenProp } from 'react-navigation';

export type FileInfo = {
  name: string,
  size: number,
  location: string,
  date: Date,
};

// Events
export type ContentOffset = {
  x: number,
  y: number,
};

export type ContentInset = {
  bottom: number,
  top: number,
  left: number,
  right: number,
};

export type LayoutMeasurement = {
  height: number,
  width: number,
};

export type ContentSize = {
  height: number,
  width: number,
};

export type OnScrollEvent = {
  nativeEvent: {
    zoomScale: number,
    contentInset: ContentInset,
    contentOffset: ContentOffset,
    layoutMeasurement: LayoutMeasurement,
    contentSize: ContentSize,
  },
};

export type OnLayoutEvent = {
  nativeEvent: {
    target: number;
    layout: {
      width: number;
      height: number;
      x: number;
      y: number;
    };
  };
};

export type PanGestureEvent = {
  stateID: number,
  moveX: number,
  moveY: number,
  x0: number,
  y0: number,
  dx: number,
  dy: number,
  vx: number,
  vy: number,
  numberActiveTouches: number,
  _accountsForMovesUpTo: number,
};

export type ReduxAction = {
  type: string,
  payload: any,
};

export type AppStateType = 'active' | 'inactive' | 'background';
