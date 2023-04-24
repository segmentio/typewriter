module.exports = {
  preset: 'ts-jest',
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
  modulePathIgnorePatterns: ['/dist/'],
  setupFilesAfterEnv: ['./jest.setup.js'],
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
