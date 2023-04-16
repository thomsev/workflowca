import { register } from './register';

describe('register', () => {
  it('should register a new user with valid data', () => {
    // Define test data
    const name = 'John Doe';
    const email = 'user@example.com';
    const password = 'password123';
    const avatar = null;

    // Stub the API request
    cy.intercept('POST', '/social/auth/register', (req) => {
      expect(req.body).to.deep.equal({ name, email, password, avatar });
      req.reply((res) => {
        expect(res.statusCode).to.equal(200);
        res.send({
          message: 'User registered successfully'
        });
      });
    }).as('registerRequest');

    // Call the register function
    register(name, email, password, avatar);

    // Assert that the register request was made and returned a success message
    cy.wait('@registerRequest').then(() => {
      cy.get('@registerRequest').should((interception) => {
        expect(interception.response.body.message).to.equal('User registered successfully');
      });
    });
  });

  it('should fail to register a new user with invalid data', () => {
    // Define test data
    const name = '';
    const email = 'invalid-email';
    const password = 'short';
    const avatar = 'invalid-image-url';

    // Stub the API request
    cy.intercept('POST', '/social/auth/register', (req) => {
      expect(req.body).to.deep.equal({ name, email, password, avatar });
      req.reply((res) => {
        expect(res.statusCode).to.equal(400);
        res.send({
          error: 'Invalid request data'
        });
      });
    }).as('registerRequest');

    // Call the register function
    cy.wrap(register(name, email, password, avatar)).should('be.rejectedWith', 'Bad Request');

    // Assert that the register request was made and no user was registered
    cy.wait('@registerRequest').then(() => {
      expect(localStorage.getItem('token')).to.be.null;
      expect(localStorage.getItem('profile')).to.be.null;
    });
  });
});
