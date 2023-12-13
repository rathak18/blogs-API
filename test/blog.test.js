const request = require('supertest');
const { app } = require('../index');

let authToken;
let createdBlog;

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

  it('should create a new blog', async () => {
    const blogPayload = {
      title: 'Nodejs',
      content: 'Nodejs is a single-threaded language',
      author: 'Rajendra',
    };

    const blogResponse = await request(app)
      .post('/api/addBlog')
      .set('Authorization', `Bearer ${authToken}`)
      .send(blogPayload);

    // Check if the 'savedPost' property is present in the response
    if (blogResponse.body.savedPost && blogResponse.body.savedPost._id) {
      // Store the created blog information
      createdBlog = {
        postId: blogResponse.body.savedPost._id,
      };
    }

    expect(blogResponse.status).toBe(201);
    expect(blogResponse.body).toHaveProperty('success', true);
    expect(blogResponse.body).toHaveProperty('message', 'Blog created successfully');
    expect(blogResponse.body).toHaveProperty('savedPost');
  });

  it('should remove the created blog', async () => {
    const blogPayload = {
      postId: createdBlog.postId, // Assuming createdBlog.postId is initialized correctly
    };
  
    const blogResponse = await request(app)
      .delete(`/api/deleteBlog/${blogPayload.postId}`) // Update the endpoint and use DELETE method
      .set('Authorization', `Bearer ${authToken}`)
      .send(blogPayload);
  
    // Check for a 200 status and a message indicating successful deletion
    expect(blogResponse.status).toBe(200);
    expect(blogResponse.body).toHaveProperty('message', 'Post deleted successfully');
  });
  
  
});
