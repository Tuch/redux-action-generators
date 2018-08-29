import React from 'react';
import { render } from 'react-dom';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import { createGeneratorMiddleware } from 'redux-action-generators';
import App from './components/App';
import rootReducer from './ducks';
import { loadTodos } from './actions';
import 'todomvc-app-css/index.css';
import './styles.css';

const middlewares = applyMiddleware(createGeneratorMiddleware());
const store = createStore(rootReducer, undefined, middlewares);

const renderApp = render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);

store.dispatch(loadTodos()).then(renderApp, renderApp);
