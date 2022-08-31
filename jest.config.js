module.exports = {
  preset: 'ts-jest',
  testPathIgnorePatterns: [
    './src/__tests__/__helpers__/',
    './src/__tests__/__data__/'
  ],
  modulePathIgnorePatterns: ['/dist/'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
}
