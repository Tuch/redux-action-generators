import isGenerator from 'is-generator';
import { fork, timeout } from './helpers';

const noop = () => {};

const isPromise = val => val && typeof val.then === 'function';

const createToPromise = dispatch => {
  const toPromise = value => {
    if (!value) {
      return Promise.resolve(value);
    }

    if (isPromise(value)) {
      return value;
    }

    if (Array.isArray(value)) {
      return Promise.all(value.map(toPromise));
    }

    value = dispatch(value);

    if (isPromise(value)) {
      return value;
    }

    return Promise.resolve(value);
  };

  return toPromise;
};

const yieldGen = (toPromise, gen, { done, value }) => {
  if (done) {
    return Promise.resolve(value);
  }

  return toPromise(value).then(
    result => yieldGen(toPromise, gen, gen.next(result)),
    err => yieldGen(toPromise, gen, gen.throw(err)),
  );
};

const executeGen = (toPromise, gen) =>
  new Promise(resolve => {
    resolve(yieldGen(toPromise, gen, gen.next()));
  });

const createExecuter = (dispatch, catchError = noop) => {
  const catchedErrors = new WeakMap();
  const toPromise = createToPromise(dispatch);

  return gen =>
    executeGen(toPromise, gen).catch(err => {
      if (!catchedErrors[err]) {
        catchedErrors[err] = true;

        catchError(err);
      }

      return Promise.reject(err);
    });
};

export default (helpers = {}, catchError = noop) => store => {
  const { getState, dispatch } = store;
  const execute = createExecuter(dispatch, catchError);
  const context = {};

  helpers = {
    context,
    dispatch,
    fork,
    getState,
    timeout,
    ...helpers,
  };

  return next => action => {
    if (typeof action === 'function') {
      // we can't check for generator functions here,
      // because it can be transpiled code
      const gen = action(helpers);

      if (!isGenerator(gen)) {
        // eslint-disable-next-line no-console
        console.error(
          'Thunk middlewares are forbidden! Please check following action:',
          action,
        );
      }

      return execute(gen);
    }

    return next(action);
  };
};
