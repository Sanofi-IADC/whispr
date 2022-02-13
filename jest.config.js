module.exports = {
  moduleFileExtensions: [
    'js',
    'json',
    'ts',
  ],
  testMatch: ['**/tests/unit/**/*.spec.(ts|js)|**/__tests__/*.(ts|js)'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testPathIgnorePatterns: ['/dist/', 'node_modules'],
  collectCoverage: true,
  collectCoverageFrom: ['**/src/**/*.{js,ts}'],
  coverageDirectory: 'tests/unit/coverage',
  testEnvironment: 'node',
  "verbose": true
};
