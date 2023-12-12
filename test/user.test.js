const request = require('supertest');
const { app, closeServer } = require('../index');
let authToken;
let createdUser;

describe('User API', () => {

  it('should create a new user', async () => {
    const userCredentials = {
      username: 'testuser54',
      password: 'testpassword',
    };

    const response = await request(app)
      .post('/api/signup')
      .send(userCredentials);

    // Check if the 'user' property is present in the response
    if (response.body.user && response.body.user._id) {
      // Store the created user information
      createdUser = {
        userId: response.body.user._id,
        username: userCredentials.username,
        password: userCredentials.password,
      };

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User created successfully');
    }
  });

  it('should login the created user', async () => {
    const loginResponse = await request(app)
      .post('/api/login')
      .send({
        username: createdUser.username,
        password: createdUser.password,
      });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('success', true);
    expect(loginResponse.body).toHaveProperty('message', 'User logged in successfully');
    expect(loginResponse.body).toHaveProperty('user');
    expect(loginResponse.body).toHaveProperty('token');

    // Store the authentication token
    authToken = loginResponse.body.token;
  });

  it('should delete the created user', async () => {
    const deleteResponse = await request(app)
      .delete('/api/deleteUser')
      .set({ Authorization: authToken })
      .send({ userId: createdUser.userId });

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.success).toBe(true);
    expect(deleteResponse.body.message).toBe('User deleted successfully');
    expect(deleteResponse.body.user).toHaveProperty('_id');
    expect(deleteResponse.body.user).toHaveProperty('username');
    expect(deleteResponse.body.user).toHaveProperty('createdAt');
  });

});
