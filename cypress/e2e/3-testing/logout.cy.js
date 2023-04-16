import { logout } from './logout';

describe('logout', () => {
  it('should remove token and profile from storage', () => {
    // Set up initial state in local storage
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('profile', JSON.stringify({
      name: 'John Doe',
      email: 'user@example.com'
    }));

    // Call the logout function
    logout();

    // Assert that token and profile were removed from storage
    expect(localStorage.getItem('token')).to.be.null;
    expect(localStorage.getItem('profile')).to.be.null;
  });
});
