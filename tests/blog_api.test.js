const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
}, 100000)

test('should return blogs as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('get correct amount of blog posts', async () => {
  const response = await api.get('/api/blogs')
  console.log(response.body)

  expect(response.body).toHaveLength(helper.initialBlogs.length)
}, 100000)

test('should verify the existence of id property', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body

  for (const blog of blogs) {
    expect(blog.id).toBeDefined()
  }
})

test.only('should add a valid blog', async () => {
  const newBlog = {
    title: 'new blog',
    author: 'me',
    url: 'newblog.net',
    likes: 45454,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  console.log(blogsAtEnd);
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const urls = blogsAtEnd.map(r => r.url)
  expect(urls).toContain('newblog.net')
})

afterAll(async () => {
  await mongoose.connection.close()
})
