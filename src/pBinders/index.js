import createPBinder from '../createPBinder';

export const bindDebounce = createPBinder(
  (fn, ...args) => fn(call => call(), ...args),
  ({ p }) => ({ action, args }) => p(() => action(...args)),
  { withAction: true },
);

export const bindThrottle = createPBinder(
  (fn, ...args) => fn(call => call(), ...args),
  ({ p }) => ({ action, args }) => p(() => action(...args)),
  { withAction: true },
);

export const bindLimit = createPBinder(
  (fn, ...args) => fn(...args),
  ({ p }) => ({ action, args }) => p(() => action(...args)),
  { withAction: true },
);

export const bindSome = createPBinder(
  (fn, ...args) => promises => fn(promises, ...args),
  ({ p, dispatch }) => ({ args: [fnGens] }) => p(fnGens.map(dispatch)),
  { withAction: false },
);
