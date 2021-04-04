module.exports = {
    roots: ['<rootDir>/src'],
    testEnvironment: 'node',
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    testMatch: ['**/__tests__/**/*.(e2e|unit).test.ts'],
};
