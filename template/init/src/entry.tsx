import './interface';
import 'fetch-polyfill';
import * as React from 'react';
import ReactDOM = require('react-dom');
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
    // const { logger } = require('redux-logger');
    // middlewares.push(logger);
}

const createStoreArguments = [todoApp, {}/* {preloadedState} */, applyMiddleware(...middlewares)];

if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    createStoreArguments[2] = compose(applyMiddleware(...middlewares), window.__REDUX_DEVTOOLS_EXTENSION__());
}

commonService.store = createStore(todoApp, {}, createStoreArguments[2] as any);
commonService.store.asyncReducers = reducers;

if (module.hot) {
    // module.hot.accept();
}

ReactDOM.render(
    <RouteElements store={commonService.store} />,
    document.getElementsByTagName('main')[0]
);