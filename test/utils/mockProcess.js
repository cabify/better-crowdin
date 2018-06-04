let originalProcess = null;

module.exports = {
  mock() {
    originalProcess = process;

    global.process = {
      exit: jest.fn(),
    };
  },
  unmock() {
    global.process = originalProcess;
    originalProcess = null;
  },
};
