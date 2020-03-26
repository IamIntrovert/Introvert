// @flow
import React from 'react';
import { AppRegistry } from 'react-native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import App from './src/App';
import reducers from './src/reducers';

const appReducer = combineReducers(reducers);
const store = createStore(appReducer, applyMiddleware(thunk));

const BlumApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent('Blum', () => BlumApp);
