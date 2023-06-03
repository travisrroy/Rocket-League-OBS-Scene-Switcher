/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transformIgnorePatterns: [
    "node_modules/(?!variables/.*)"
  ],
  testMatch: [
    '**/__tests__/**/?(*.)(spec|test).(js|ts)',
    '**/?(*.)(spec|test).(js|ts)'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/Archive/',
    '<rootDir>/build/'
  ],
  reporters: [
    "default",
    [
      "./node_modules/jest-html-reporter",
      {
        "pageTitle": "Test Report"
      }
    ]
  ],
  collectCoverage: true
};