export const timeout = delay =>
  new Promise(resolve => setTimeout(resolve, delay));

export const fork = fnGen =>
  function*({ dispatch }) {
    dispatch(fnGen);
  };
