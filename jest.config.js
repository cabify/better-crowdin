const path = require('path');

module.exports = {
  rootDir: path.resolve('./'),
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^config$': '<rootDir>/src/config/test.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/jest/globalMocks/fileMock.js',
    '^.*\\.scss$': '<rootDir>/jest/globalMocks/styleMock.js',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  globals: {},
  testMatch: ['**/test/**/*?(*.)(Test).(js|ts|tsx)'],
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
  },
  coverageReporters: ['text', 'html'],
  coveragePathIgnorePatterns: ['/node_modules/', '/test/'],
};
