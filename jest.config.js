module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '\\.(mp4|wav)$': '<rootDir>/__tests__/mediaMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  testMatch: ['**/*.test.ts?(x)'],
};
