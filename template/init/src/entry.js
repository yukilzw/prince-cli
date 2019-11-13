import 'core-js/es6/set';
import 'core-js/es6/map';
import 'core-js/es6/promise';
import 'fetch-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import RouteElements from './route/router';
import reducers from '@common/reducers';
import { commonService } from '@common/service';

import '@common/less/common.less';

const todoApp = combineReducers(reducers);
const middlewares = [thunkMiddleware, commonService.reducersStorage];
const preloadedState = JSON.parse(localStorage.getItem('princeReducersData')) || {};

if (DEBUG === 1) {
    const { logger } = require('redux-logger');

    middlewares.push(logger);
}

const createStoreArguments = [todoApp, {}/* {preloadedState} */, applyMiddleware(...middlewares)];

if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    createStoreArguments[2] = compose(applyMiddleware(...middlewares), window.__REDUX_DEVTOOLS_EXTENSION__());
}

commonService.store = createStore(...createStoreArguments);
commonService.store.asyncReducers = reducers;

if (module.hot) {
    // module.hot.accept();
}

render(
    <RouteElements store={commonService.store} />,
    document.getElementsByTagName('main')[0]
);