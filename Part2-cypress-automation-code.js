// File structure:
// cypress/
//   integration/
//     auth/
//       signup.spec.js
//       signin.spec.js
//       signout.spec.js
//   fixtures/
//     users.json
//   support/
//     commands.js
//     index.js

// cypress/fixtures/users.json
{
  "validUser": {
    "email": "vishwanthcheruku17@gmail.com",
    "password": "Vishwanth@17"
  },
  "newUser": {
    "email": "cherukuvishwanth@gmail.com",
    "password": "SecurePassword123!"
  },
  "invalidEmails": [
    "not-an-email",
    "missing@domain",
    "@nodomain.com",
    "spaces in@email.com",
    ""
  ],
  "invalidPasswords": [
    "",
    "short",
    "nouppercase123",
    "NOLOWERCASE123",
    "NoNumbers"
  ]
}

// cypress/support/commands.js
// Custom commands for authentication operations

Cypress.Commands.add('navigateToSignUp', () => {
  cy.visit('/');
  cy.get('[data-cy=signup-link]').click();
  cy.url().should('include', '/signup');
});

Cypress.Commands.add('navigateToSignIn', () => {
  cy.visit('/');
  cy.get('[data-cy=signin-link]').click();
  cy.url().should('include', '/signin');
});

Cypress.Commands.add('signUp', (email, password) => {
  cy.navigateToSignUp();
  cy.get('[data-cy=email-input]').type(email);
  cy.get('[data-cy=password-input]').type(password);
  cy.get('[data-cy=signup-button]').click();
});

Cypress.Commands.add('signIn', (email, password) => {
  cy.navigateToSignIn();
  cy.get('[data-cy=email-input]').type(email);
  cy.get('[data-cy=password-input]').type(password);
  cy.get('[data-cy=signin-button]').click();
});

Cypress.Commands.add('signOut', () => {
  cy.get('[data-cy=user-menu]').click();
  cy.get('[data-cy=signout-button]').click();
});

// cypress/integration/auth/signup.spec.js
describe('Sign Up Functionality', () => {
  beforeEach(() => {
    // Clear cookies and localStorage to ensure clean state
    cy.clearCookies();
    cy.clearLocalStorage();
    // Navigate to signup page before each test
    cy.navigateToSignUp();
  });

  it('should allow a new user to sign up successfully (SU-001)', () => {
    cy.fixture('users').then((users) => {
      // Generate a unique email to avoid conflicts
      const uniqueEmail = `test_${Date.now()}@example.com`;
      
      // Fill in the sign up form
      cy.get('[data-cy=email-input]').type(uniqueEmail);
      cy.get('[data-cy=password-input]').type(users.newUser.password);
      cy.get('[data-cy=signup-button]').click();
      
      // Assert user is redirected to dashboard
      cy.url().should('include', '/dashboard');
      
      // Assert success message is displayed
      cy.get('[data-cy=success-message]').should('be.visible');
      cy.get('[data-cy=success-message]').should('contain', 'Account created successfully');
    });
  });

  it('should prevent sign up with existing email (SU-002)', () => {
    cy.fixture('users').then((users) => {
      // First create a user
      cy.signUp(users.validUser.email, users.validUser.password);
      
      // Sign out if we were signed in
      cy.signOut();
      
      // Now try to create another user with the same email
      cy.navigateToSignUp();
      cy.get('[data-cy=email-input]').type(users.validUser.email);
      cy.get('[data-cy=password-input]').type(users.validUser.password);
      cy.get('[data-cy=signup-button]').click();
      
      // Assert error message is displayed
      cy.get('[data-cy=error-message]').should('be.visible');
      cy.get('[data-cy=error-message]').should('contain', 'Email already in use');
    });
  });

  it('should validate email format (SU-003)', () => {
    cy.fixture('users').then((users) => {
      users.invalidEmails.forEach((invalidEmail) => {
        cy.get('[data-cy=email-input]').clear().type(invalidEmail);
        cy.get('[data-cy=password-input]').clear().type(users.validUser.password);
        cy.get('[data-cy=signup-button]').click();
        
        // Assert validation error message is displayed
        cy.get('[data-cy=email-error]').should('be.visible');
        cy.get('[data-cy=email-error]').should('contain', 'valid email');
      });
    });
  });

  it('should validate password requirements (SU-004)', () => {
    cy.fixture('users').then((users) => {
      users.invalidPasswords.forEach((invalidPassword) => {
        cy.get('[data-cy=email-input]').clear().type(users.newUser.email);
        cy.get('[data-cy=password-input]').clear().type(invalidPassword);
        cy.get('[data-cy=signup-button]').click();
        
        // Assert validation error message is displayed
        cy.get('[data-cy=password-error]').should('be.visible');
      });
    });
  });

  it('should require all fields to be filled (SU-005)', () => {
    // Try to submit with empty fields
    cy.get('[data-cy=signup-button]').click();
    
    // Assert validation error messages are displayed
    cy.get('[data-cy=email-error]').should('be.visible');
    cy.get('[data-cy=password-error]').should('be.visible');
  });
});

// cypress/integration/auth/signin.spec.js
describe('Sign In Functionality', () => {
  beforeEach(() => {
    // Clear cookies and localStorage to ensure clean state
    cy.clearCookies();
    cy.clearLocalStorage();
    // Navigate to signin page before each test
    cy.navigateToSignIn();
  });

  // Setup - Create a test user that we can use for sign in tests
  before(() => {
    cy.fixture('users').then((users) => {
      // Visit the signup page and create a test user
      cy.navigateToSignUp();
      cy.get('[data-cy=email-input]').type(users.validUser.email);
      cy.get('[data-cy=password-input]').type(users.validUser.password);
      cy.get('[data-cy=signup-button]').click();
      
      // Sign out to prepare for sign in tests
      cy.signOut();
    });
  });

  it('should allow a user to sign in with valid credentials (SI-001)', () => {
    cy.fixture('users').then((users) => {
      cy.get('[data-cy=email-input]').type(users.validUser.email);
      cy.get('[data-cy=password-input]').type(users.validUser.password);
      cy.get('[data-cy=signin-button]').click();
      
      // Assert user is redirected to dashboard
      cy.url().should('include', '/dashboard');
      
      // Assert user is signed in
      cy.get('[data-cy=user-menu]').should('be.visible');
    });
  });

  it('should show an error for incorrect password (SI-002)', () => {
    cy.fixture('users').then((users) => {
      cy.get('[data-cy=email-input]').type(users.validUser.email);
      cy.get('[data-cy=password-input]').type('WrongPassword123!');
      cy.get('[data-cy=signin-button]').click();
      
      // Assert error message is displayed
      cy.get('[data-cy=error-message]').should('be.visible');
      cy.get('[data-cy=error-message]').should('contain', 'incorrect');
      
      // Assert user is not redirected to dashboard
      cy.url().should('include', '/signin');
    });
  });

  it('should show an error for non-existent user (SI-003)', () => {
    cy.get('[data-cy=email-input]').type('nonexistent@example.com');
    cy.get('[data-cy=password-input]').type('AnyPassword123!');
    cy.get('[data-cy=signin-button]').click();
    
    // Assert error message is displayed
    cy.get('[data-cy=error-message]').should('be.visible');
    cy.get('[data-cy=error-message]').should('contain', 'user not found');
    
    // Assert user is not redirected to dashboard
    cy.url().should('include', '/signin');
  });

  it('should validate required fields (SI-004)', () => {
    // Try to submit with empty fields
    cy.get('[data-cy=signin-button]').click();
    
    // Assert validation error messages are displayed
    cy.get('[data-cy=email-error]').should('be.visible');
    cy.get('[data-cy=password-error]').should('be.visible');
  });
});

// cypress/integration/auth/signout.spec.js
describe('Sign Out Functionality', () => {
  beforeEach(() => {
    // Clear cookies and localStorage to ensure clean state
    cy.clearCookies();
    cy.clearLocalStorage();
    
    // Sign in before each test
    cy.fixture('users').then((users) => {
      cy.signIn(users.validUser.email, users.validUser.password);
      // Verify we're on the dashboard
      cy.url().should('include', '/dashboard');
    });
  });

  it('should allow a user to sign out (SO-001)', () => {
    // Perform sign out
    cy.signOut();
    
    // Assert user is redirected to sign in page
    cy.url().should('include', '/signin');
    
    // Assert sign in button is visible, indicating we're logged out
    cy.get('[data-cy=signin-button]').should('be.visible');
  });

  it('should prevent access to protected pages after sign out (SO-002)', () => {
    // Sign out
    cy.signOut();
    
    // Try to access dashboard directly
    cy.visit('/dashboard');
    
    // Assert user is redirected to sign in page
    cy.url().should('include', '/signin');
    
    // Assert sign in form is visible
    cy.get('[data-cy=signin-form]').should('be.visible');
  });
});

// cypress.json configuration file
{
  "baseUrl": "https://xaltsocnportal.web.app",
  "viewportWidth": 1280,
  "viewportHeight": 720,
  "defaultCommandTimeout": 10000,
  "pageLoadTimeout": 30000,
  "video": false,
  "screenshotOnRunFailure": true,
  "screenshotsFolder": "cypress/screenshots",
  "trashAssetsBeforeRuns": true
}

// package.json excerpt
{
  "name": "xalts-qa-automation",
  "version": "1.0.0",
  "description": "Automated tests for XALTS blockchain portal",
  "scripts": {
    "test": "cypress run",
    "test:open": "cypress open",
    "test:auth": "cypress run --spec 'cypress/integration/auth/*'"
  },
  "dependencies": {
    "cypress": "^12.14.0"
  }
}