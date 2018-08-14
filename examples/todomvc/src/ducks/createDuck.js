// createDuck this is a way to simplify reducers

const defineTypes = (name, types) =>
  types.reduce(
    (acc, type) => ({
      ...acc,
      [type]: `${name}/${type}`,
    }),
    {},
  );

const createLoader = ({ duck, fetch }) => (...args) =>
  function*() {
    yield duck.extendState({ isLoading: true });

    try {
      const result = yield fetch(...args);

      yield duck.extendState({
        result,
        error: undefined,
        isLoading: false,
        isLoaded: true,
      });

      return result;
    } catch (error) {
      yield duck.extendState({
        error,
        isLoading: false,
      });

      throw error;
    }
  };

const assignApiToDuck = (duck, api) =>
  Object.keys(api).reduce((acc, key) => {
    duck[key] = createLoader({ duck, fetch: api[key] });

    return duck;
  }, duck);

export default ({ name, initialState = {}, api = {} }) => {
  const types = defineTypes(name, [
    'EXTEND_STATE',
    'REPLACE_STATE',
    'RESET_STATE',
  ]);

  const duck = (state = initialState, action) => {
    switch (action.type) {
      case types.EXTEND_STATE:
        return {
          ...state,
          ...action.payload,
        };

      case types.REPLACE_STATE:
        return action.payload;

      case types.RESET_STATE:
        return initialState;

      default:
        return state;
    }
  };

  duck.extendState = (payload = {}) => ({
    type: types.EXTEND_STATE,
    payload,
  });

  duck.replaceState = payload => ({
    type: types.REPLACE_STATE,
    payload,
  });

  duck.resetState = () => ({
    type: types.RESET_STATE,
  });

  assignApiToDuck(duck, api);

  return duck;
};
