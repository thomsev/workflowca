import { isLoggedIn, profile } from './user';

describe('isLoggedIn', () => {
  it('should return true when a token is present in storage', () => {
    // Set up initial state in local storage
    localStorage.setItem('token', 'fake-token');

    // Assert that isLoggedIn returns true
    expect(isLoggedIn()).to.be.true;
  });

  it('should return false when no token is present in storage', () => {
    // Set up initial state in local storage
    localStorage.removeItem('token');

    // Assert that isLoggedIn returns false
    expect(isLoggedIn()).to.be.false;
  });
});

describe('profile', () => {
  it('should return the user profile when present in storage', () => {
    // Define test data
    const userProfile = {
      name: 'John Doe',
      email: 'user@example.com'
    };

    // Set up initial state in local storage
    localStorage.setItem('profile', JSON.stringify(userProfile));

    // Assert that profile returns the expected user profile
    expect(profile()).to.deep.equal(userProfile);
  });

  it('should return null when no user profile is present in storage', () => {
    // Set up initial state in local storage
    localStorage.removeItem('profile');

    // Assert that profile returns null
    expect(profile()).to.be.null;
  });
});
