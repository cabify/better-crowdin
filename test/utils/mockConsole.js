const originalConsole = console;

let cache = [];

module.exports = {
  mockConsole() {
    console.log = (...args) => {
      cache.push(args.join(''));
    };
    console.error = (...args) => {
      cache.push(args.join(''));
    };
  },
  unmockConsole() {
    cache = [];
    console = originalConsole; // eslint-disable-line
  },
  getLog() {
    return cache;
  },
};
