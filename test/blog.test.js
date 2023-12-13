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

  it('should get all blog posts', async () => {
    const response = await request(app)
      .get('/api/getAllBlogs')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Blogs fetched successfully');
    expect(response.body).toHaveProperty('posts');
    //expect(response.body.posts).toHaveLength(/* Set the expected length based on your test data */);
  });
  

  it('should return 404 if no blogs are found within the specified date range', async () => {
    // Set an invalid user ID to simulate no blogs found for that user
    const invalidUserId = 'invalid_user_id';
  
    const fromDate = '2020-01-01';
    const toDate = '2020-12-31';
  
    const response = await request(app)
      .get('/api/getAllBlogsDatewise')
      .set('Authorization', `Bearer ${authToken}`) // Use the valid user's token
      .send({ fromDate, toDate, userId: invalidUserId }); // Use send to set the request body
  
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'No blogs found within the specified date range');
  });

  it('should return 404 if no blogs match the specified criteria', async () => {
    const invalidFilter = {
      // Provide invalid filter criteria that are unlikely to match any blogs
      title: '"title": "Noiod"',
      content: 'InvalidContentThatShouldNotExist',
      author: 'InvalidAuthorThatShouldNotExist',
    };
  
    const response = await request(app)
      .get('/api/getAllBlogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(invalidFilter);
  
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Blogs not available');
  });
  
  
});
