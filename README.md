# redux-action-generators
You can use it instead redux-thunk to make your code cleaner


### Simple example.

redux-thunk:

```js
const INCREMENT_COUNTER = 'INCREMENT_COUNTER';

const increment => () => ({
  type: INCREMENT_COUNTER
})

const incrementAsync = () => {
  return dispatch => {
    setTimeout(() => {
      dispatch(increment());
    }, 1000);
  };
}
```

redux-action-generators:

```js
const INCREMENT_COUNTER = 'INCREMENT_COUNTER';

const increment => () => ({
  type: INCREMENT_COUNTER
})

const incrementAsync = () => function* ({ timeout }) {
  yield timeout(1000);
  yield increment();
}
```

### Or more real example:

redux-thunk:
```js
const makeSandwichesForEverybody = () => (dispatch, getState) => {
  if (!getState().sandwiches.isShopOpen) {
    return Promise.resolve();
  }

  return dispatch(
    makeASandwichWithSecretSauce('My Grandma')
  ).then(() =>
    Promise.all([
      dispatch(makeASandwichWithSecretSauce('Me')),
      dispatch(makeASandwichWithSecretSauce('My wife'))
    ])
  ).then(() =>
    dispatch(makeASandwichWithSecretSauce('Our kids'))
  ).then(() =>
    dispatch(getState().myMoney > 42 ?
      withdrawMoney(42) :
      apologize('Me', 'The Sandwich Shop')
    )
  );
};
```

redux-action-generators:
```js
const makeSandwichesForEverybody = () => function* ({ getState }) {
  if (!getState().sandwiches.isShopOpen) {
    return; // even if we're returning 'undefined' dispatch(makeSandwichesForEverybody()) will return a promise with resolved 'undeinfed' value
  }

  yield makeASandwichWithSecretSauce('My Grandma');
  yield [makeASandwichWithSecretSauce('Me'), makeASandwichWithSecretSauce('My wife')];
  yield makeASandwichWithSecretSauce('Our kids');

  if (getState().myMoney > 42) {
    yield withdrawMoney(42):
  } else {
    yield apologize('Me', 'The Sandwich Shop');
  }
};
```


### How to configure store with redux-action-generators?

Simplest way:
```js
import { applyMiddleware, createStore } from 'redux';
import { createGeneratorMiddleware } from 'redux-action-generators';
import rootReducer from './rootReducer';

const middlewares = applyMiddleware(createGeneratorMiddleware());
const store = createStore(rootReducer, undefined, middlewares);
```

With `api` helper and `catchError` function:

```js
import { applyMiddleware, createStore } from 'redux';
import { createGeneratorMiddleware } from 'redux-action-generators';
import rootReducer from './rootReducer';
import createApi from './createApi'; // const api = createApi() - api.loadSomeItems() xhr or any other data loaders

const initialState = {}
const helpers = { api: createApi() }; // optional
const catchError = error => console.error(error); // optional, we can catch here all error and use, for example, some api to store it
const middlewares = applyMiddleware(createGeneratorMiddleware(helpers, catchError));

const store = createStore(rootReducer, initialState, middlewares);
```

### What are helpers?

You can configure helpers when create the store and pass there everything what you need when you will use the action.
This is very similar with `thunk.withExtraArgument` (https://github.com/reduxjs/redux-thunk)

### How to use helpers?

```js
const someAction = () => function* ({ api }) {
  yield api.loadSomeItems(); // api.loadSomeItems() returns promise
}
```

### How to use catch errors?

```js
const someAction = () => function* ({ api }) {
  try {
    yield api.loadSomeItems();
  } (error) {
    // handle error logic
    console.log(error);
  }
}
```
even if you will not use try-catch construction you can catch this error with `catchError` function that you can define when create the store.

All uncaught errors will be there.

## License

MIT
