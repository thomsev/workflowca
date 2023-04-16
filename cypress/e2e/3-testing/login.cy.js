import { login } from './login';

describe('login', () => {
  it('should log in with valid credentials', () => {
    // Define test data
    const email = 'user@example.com';
    const password = 'password123';

    // Stub the API request
    cy.intercept('POST', '/social/auth/login', (req) => {
      expect(req.body).to.deep.equal({ email, password });
      req.reply((res) => {
        expect(res.statusCode).to.equal(200);
        res.send({
          accessToken: 'fake-token',
          name: 'John Doe',
          email: email
        });
      });
    }).as('loginRequest');

    // Call the login function
    login(email, password);

    // Assert that the login request was made and token/profile were saved to storage
    cy.wait('@loginRequest').then(() => {
      expect(localStorage.getItem('token')).to.equal('fake-token');
      expect(localStorage.getItem('profile')).to.deep.equal({
        name: 'John Doe',
        email: email
      });
    });
  });

  it('should fail to log in with invalid credentials', () => {
    // Define test data
    const email = 'user@example.com';
    const password = 'invalid-password';

    // Stub the API request
    cy.intercept('POST', '/social/auth/login', (req) => {
      expect(req.body).to.deep.equal({ email, password });
      req.reply((res) => {
        expect(res.statusCode).to.equal(401);
        res.send({
          error: 'Invalid email or password'
        });
      });
    }).as('loginRequest');

    // Call the login function
    cy.wrap(login(email, password)).should('be.rejectedWith', 'Unauthorized');

    // Assert that the login request was made and no token/profile were saved to storage
    cy.wait('@loginRequest').then(() => {
      expect(localStorage.getItem('token')).to.be.null;
      expect(localStorage.getItem('profile')).to.be.null;
    });
  });
});
