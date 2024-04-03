module.exports = {
  preset: 'react-native',

  setupFiles: [],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
};
