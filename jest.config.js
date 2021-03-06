module.exports = {
  globals: {
    'ts-jest': {
      'tsConfig': 'tsconfig.json',
    },
  },

  testEnvironment: 'node',

  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
  ],

  // A map from regular expressions to module names that allow to stub out resources with a single module
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },

  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },

  // Coverage
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'src/**/**/*.{ts,tsx}',
    '!src/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 70,
      lines: 80,
      statements: -10,
    },
  },
}