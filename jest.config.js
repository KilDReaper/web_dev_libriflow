const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  roots: ['<rootDir>'],
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^react$': '<rootDir>/node_modules/react',
    '^react-dom$': '<rootDir>/node_modules/react-dom',
    '^react-dom/(.*)$': '<rootDir>/node_modules/react-dom/$1',
    '^react/(.*)$': '<rootDir>/node_modules/react/$1',
    '^react/jsx-runtime$': '<rootDir>/node_modules/react/jsx-runtime.js',
  },
  collectCoverageFrom: [
    'app/_components/AdminDashboardContent.tsx',
    'app/_components/BackButton.tsx',
    'app/_components/Sidebar.tsx',
    'app/public/_components/Header.tsx',
    'app/public/_components/ThemeToogle.tsx',
    'app/page.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
