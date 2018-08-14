import isGenerator from 'is-generator';
import createPBinder from './createPBinder';

const createTestItems = ({ withAction = true } = {}) => {
  const pFn = jest.fn().mockImplementationOnce(() => 'pFn');
  const createP = jest.fn().mockImplementationOnce(() => 'createP');
  const createRunner = jest.fn().mockImplementationOnce(() => 'createRunner');
  const params = { withAction };
  const action = jest.fn().mockImplementationOnce(
    () =>
      function*() {
        return yield 'result';
      },
  );

  const bindFn = createPBinder(createP, createRunner, params);

  const wrapper = bindFn(pFn);
  const wrapperWithArgs = wrapper('pArg1', 'pArg2', 'pArg3');

  let wrappedAction = null;
  let fnGen = null;

  if (withAction) {
    wrappedAction = wrapperWithArgs(action);
    fnGen = wrappedAction('arg1', 'arg2', 'arg3');
  } else {
    fnGen = wrapperWithArgs('arg1', 'arg2', 'arg3');
  }

  const genHelpers = {
    dispatch: jest.fn().mockImplementationOnce(() => 'dispatch'),
    context: {},
  };

  const gen = fnGen(genHelpers);

  return {
    action,
    bindFn,
    createP,
    createRunner,
    fnGen,
    gen,
    genHelpers,
    pFn,
    params,
    wrappedAction,
    wrapper,
    wrapperWithArgs,
  };
};

describe('check types', () => {
  test('createPBinder should be a function', () => {
    expect(typeof createPBinder).toBe('function');
  });

  test('withAction = true', () => {
    const {
      bindFn,
      fnGen,
      gen,
      wrappedAction,
      wrapper,
      wrapperWithArgs,
    } = createTestItems({
      withAction: true,
    });

    expect(typeof bindFn).toBe('function');
    expect(typeof wrapper).toBe('function');
    expect(typeof wrapperWithArgs).toBe('function');
    expect(typeof wrappedAction).toBe('function');
    expect(typeof fnGen).toBe('function');
    expect(isGenerator(gen)).toBe(true);
  });

  test('withAction = false', () => {
    const { bindFn, wrapper, wrapperWithArgs, fnGen, gen } = createTestItems({
      withAction: false,
    });

    expect(typeof bindFn).toBe('function');
    expect(typeof wrapper).toBe('function');
    expect(typeof wrapperWithArgs).toBe('function');
    expect(typeof fnGen).toBe('function');
    expect(isGenerator(gen)).toBe(true);
  });
});
