// thes functions are kind of async api handlers.
// It can be any type of data providers.

let state = [
  {
    text: 'Use Redux',
    completed: false,
    id: 0,
  },
];

const getState = () => state;
const hasError = probability => Math.random() < probability;
const HttpError = function({ text, statusCode }) {
  this.text = text;
  this.statusCode = statusCode;
};

const endpoint = (fn = getState, errorProbability = 0) => (...args) => {
  const result = fn(...args);

  state = result;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (hasError(errorProbability)) {
        reject(
          new HttpError({ text: 'Error on the server!', statusCode: 500 }),
        );
      } else {
        resolve(result);
      }
    }, 100);
  });
};

export const addTodo = endpoint(({ text }) => [
  ...state,
  {
    id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
    completed: false,
    text,
  },
]);

export const deleteTodo = endpoint(({ id }) =>
  state.filter(todo => todo.id !== id),
);

export const editTodo = endpoint(({ id, text, completed }) =>
  state.map(todo => {
    if (todo.id === id) {
      todo = {
        ...todo,
        id: id || todo.id,
        text: text || todo.text,
        completed: completed || todo.completed,
      };
    }

    return todo;
  }),
);

export const completeTodo = endpoint(({ id }) =>
  state.map(
    todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo),
  ),
);

export const completeAllTodos = endpoint(() => {
  const areAllMarked = state.every(todo => todo.completed);

  return state.map(todo => ({
    ...todo,
    completed: !areAllMarked,
  }));
});

export const loadTodos = endpoint(undefined, 0.5);
