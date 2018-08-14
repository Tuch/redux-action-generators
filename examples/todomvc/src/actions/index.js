import { todosDuck, uiDuck } from '../ducks';

const getTodos = (state, { completed }) =>
  state.todos.result.filter(todo => todo.completed === completed);
const areAllMarked = state => state.todos.result.every(todo => todo.completed);

export const loadTodos = () =>
  function*() {
    yield todosDuck.loadTodos();
  };

export const addTodo = text =>
  function*() {
    yield todosDuck.addTodo({ text });
  };

export const deleteTodo = id =>
  function*() {
    yield todosDuck.deleteTodo({ id });
  };

export const editTodo = (id, text) =>
  function*() {
    yield todosDuck.editTodo({ id, text });
  };

export const completeTodo = id =>
  function*() {
    yield todosDuck.completeTodo({ id });
  };

export const completeAllTodos = () =>
  function*({ getState, timeout }) {
    let completed = areAllMarked(getState());
    const todos = getTodos(getState(), { completed });

    completed = !completed;

    for (let i = 0; i < todos.length; i++) {
      const { id } = todos[i];

      yield todosDuck.editTodo({ id, completed });
      yield timeout(10);
    }
  };

export const clearCompleted = () =>
  function*({ timeout, getState }) {
    const todos = getTodos(getState(), { completed: true });

    for (let i = 0; i < todos.length; i++) {
      const { id } = todos[i];

      yield todosDuck.deleteTodo({ id });
      yield timeout(30);
    }
  };

export const setVisibilityFilter = filter =>
  function*() {
    yield uiDuck.extendState({ visibilityFilter: filter });
  };
