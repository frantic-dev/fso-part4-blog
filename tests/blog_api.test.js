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

  expect(response.body).toHaveLength(helper.initialBlogs.length)
}, 100000)

test('should verify the existence of id property', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body

  for (const blog of blogs) {
    expect(blog.id).toBeDefined()
  }
})

test('should add a valid blog', async () => {
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
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const urls = blogsAtEnd.map(r => r.url)
  expect(urls).toContain('newblog.net')
})

test('should default number of likes to zero if the likes property is missing', async () => {
  const blogMissingLikes = {
    title: 'blog missing the likes',
    author: 'me again',
    url: 'blogwithnolikes.com',
  }

  await api
    .post('/api/blogs')
    .send(blogMissingLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  expect(blogsAtEnd[helper.initialBlogs.length].likes).toEqual(0)
})

test('should not add a blog missing the title', async () => {
  const blogMissingTitle = {
    author: 'me otra vez',
    url: 'blogmissingtitle.net',
    likes: 345,
  }

  await api.post('/api/blogs').send(blogMissingTitle).expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('should not add a blog missing the url', async () => {
  const blogMissingUrl = {
    title: 'blog missing the url',
    author: 'me encore',
    likes: 1,
  }

  await api.post('/api/blogs').send(blogMissingUrl).expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('should delete blog', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

  const urls = blogsAtEnd.map(blog => blog.url)

  expect(blogsAtEnd).not.toContain(blogToDelete.url)
})

afterAll(async () => {
  await mongoose.connection.close()
})
