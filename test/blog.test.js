const request = require('supertest');
const { app } = require('../index');

let authToken;

const loginAndRetrieveToken = async (username, password) => {
    try {
      const loginResponse = await request(app)
        .post('/api/login')
        .send({
          username,
          password,
        });
  
      if (loginResponse.status === 200) {
        return loginResponse.body.token;
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  };
  

describe('Blog API', () => {
  beforeAll(async () => {
    authToken = await loginAndRetrieveToken('testuser6', 'testpassword');
  });


  it('should create new blog', async () => {
    const blogPayload = {
      title: 'Nodejs',
      content: 'Nodejs is a single-threaded language',
      author: 'Rajendra',
    };

    const loginResponse = await request(app)
      .post('/api/addBlog')
      .set('Authorization', `Bearer ${authToken}`)
      .send(blogPayload);

    expect(loginResponse.status).toBe(201);
    expect(loginResponse.body).toHaveProperty('success', true);
    expect(loginResponse.body).toHaveProperty('message', 'Blog created successfully');
    expect(loginResponse.body).toHaveProperty('savedPost');
  });
});
