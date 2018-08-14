let id = 0;

const getNextKey = () => {
  id += 1;

  return `__id${id}`;
};

const bindActionCreator = (actionCreator, dispatch) => (...args) =>
  dispatch(actionCreator(...args));

export default (createP, createRunner, { withAction } = {}) => {
  const key = getNextKey();

  return pFn => (...pArgs) => {
    const p = createP(pFn, ...pArgs);

    const fn = actionCreator => (...args) =>
      function*({ context, dispatch }) {
        let { [key]: run } = context;

        if (!run) {
          run = createRunner({ dispatch, p });

          context[key] = run;
        }

        const action = withAction
          ? bindActionCreator(actionCreator, dispatch)
          : undefined;

        return yield run({ action, args });
      };

    return withAction ? fn : fn();
  };
};
