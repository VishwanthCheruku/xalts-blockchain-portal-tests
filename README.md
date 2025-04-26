# XALTS Blockchain Portal Test Automation

This repository contains automated test cases for the XALTS blockchain portal web application (xaltsocnportal.web.app). The automation suite uses Cypress to test the core user authentication flows including Sign Up, Sign In, and Sign Out functionalities.

## Project Overview

The XALTS blockchain portal is a standard CRUD web application that allows users to:
- Create requests to add nodes to existing blockchains
- Initiate requests to create new private blockchains

This test automation project focuses on validating the user authentication features with plans to expand to full application testing.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/VishwanthCheruku/xalts-blockchain-portal-cypress-tests.git
cd xalts-blockchain-portal-tests
```

2. Install dependencies:
```bash
npm install
```

## Configuration

The test configuration is defined in `cypress.config.js`. The main configuration parameter is the `baseUrl` which is set to `https://xaltsocnportal.web.app`. Update this if you're testing against a different environment.

## Test Data

Test data is stored in `cypress/fixtures/users.json`. You'll need to modify this file to include valid test user credentials:

```json
{
  "validUser": {
    "email": "your-test-user@example.com",
    "password": "YourTestPassword"
  },
  "newUser": {
    "email": "new-user@example.com",
    "password": "NewUserPassword"
  }
}
```

## Test Structure

```
cypress/
├── e2e/                  # Test files
│   └── auth/             # Authentication tests
│       ├── signup.cy.js  # Sign up tests
│       ├── signin.cy.js  # Sign in tests
│       └── signout.cy.js # Sign out tests
├── fixtures/             # Test data
│   └── users.json        # User data for tests
└── support/              # Support files
    └── commands.js       # Custom commands
```

## Running Tests

### Open Cypress Test Runner
To open the Cypress Test Runner for interactive testing:
```bash
npm run cy:open
```

### Run All Tests in Headless Mode
To run all tests in headless mode:
```bash
npm run cy:run
```

### Run Only Authentication Tests
To run only the authentication tests:
```bash
npm run test:auth
```

## Test Cases

### Sign Up Tests
- SU-01: Successfully signs up with valid data
- SU-02: Displays error when signing up with existing email
- SU-03: Displays error when signing up with invalid email format
- SU-04: Displays error when signing up with weak password
- SU-05: Displays errors when submitting empty form

### Sign In Tests
- SI-01: Successfully signs in with valid credentials
- SI-02: Displays error when signing in with incorrect password
- SI-03: Displays error when signing in with non-existent email
- SI-04: Displays errors when submitting empty form

### Sign Out Tests
- SO-01: Successfully signs out

## Extending the Test Suite

This project currently focuses on authentication. To extend the tests to cover other functionality:

1. Create new test files in the `cypress/e2e/` directory
2. Add new custom commands in `cypress/support/commands.js` as needed
3. Add new test data in `cypress/fixtures/` as needed

## Troubleshooting

### Common Issues

1. **Selector Issues**: If tests fail due to element not found errors, you may need to update the selectors in the test files to match the actual application HTML structure.

2. **Timing Issues**: For operations that take longer to complete, you might need to increase the `defaultCommandTimeout` in `cypress.config.js`.

3. **Authentication Issues**: Make sure the test user credentials in `users.json` are valid and have the necessary permissions.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
