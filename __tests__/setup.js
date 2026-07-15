jest.mock('react-native-video', () => {
  const React = require('react');
  const {View} = require('react-native');
  return props => React.createElement(View, props);
});

jest.mock(
  '@react-native-async-storage/async-storage',
  () => ({
    getItem: jest.fn(async () => null),
    setItem: jest.fn(async () => undefined),
    removeItem: jest.fn(async () => undefined),
    clear: jest.fn(async () => undefined),
  }),
);
