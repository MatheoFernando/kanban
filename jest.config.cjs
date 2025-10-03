module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\.(t|j)sx?$': ['@swc/jest', {
      jsc: {
        transform: {
          react: {
            runtime: 'automatic'
          }
        }
      }
    }],
    '^.+\.m?js$': 'babel-jest',
  },
  moduleNameMapper: {
    '\.(css|less|scss)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/test/jest.setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(driver.js|.*\.mjs$|@dnd-kit|@xyflow|framer-motion))'
  ],
}
