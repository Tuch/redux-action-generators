import { combineReducers } from 'redux';
import createDuck from './createDuck';
import * as api from '../api';

export const SHOW_ALL = 'show_all';
export const SHOW_COMPLETED = 'show_completed';
export const SHOW_ACTIVE = 'show_active';

export const todosDuck = createDuck({
  name: 'TODOS',
  initialState: { result: [], error: undefined },
  api,
}); // API duck
export const uiDuck = createDuck({
  name: 'UI',
  initialState: { visibilityFilter: SHOW_ALL },
}); // UI duck

export default combineReducers({
  todos: todosDuck,
  ui: uiDuck,
});
