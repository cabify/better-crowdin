const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname),
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'json'],
  moduleDirectories: ['lib'],
  globals: {},
  testMatch: ['**/test/**/*?(*.)(Test).(js|ts|tsx)'],
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
  },
  coverageReporters: ['text', 'html'],
  coveragePathIgnorePatterns: ['/node_modules/', '/test/'],
};
