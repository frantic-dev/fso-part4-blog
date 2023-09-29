const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const app = require('../app')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
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
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('should successfully create new user', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'californi',
      name: 'bobby John',
      password: 'paranoia',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain(newUser.username)
  })

  test('should not create new user when missing a username', async () => {
    const usersAtStart = await helper.usersInDb()

    const user = {
      name: 'bobby John',
      password: 'paranoia',
    }

    await api.post('/api/users').send(user).expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
  
  test('should not create new user when missing a password', async () => {
    const usersAtStart = await helper.usersInDb()

    const user = {
      username: 'californi',
      name: 'bobby John',
    }

    await api.post('/api/users').send(user).expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('should not create new user when username is less than 3 characters long', async () => {
    const usersAtStart = await helper.usersInDb()

    const user = {
      username: 'ca',
      name: 'bobby John',
      password: 'paranoia',
    }

    await api.post('/api/users').send(user).expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
  test('should not create new user when password is less than 3 characters long', async () => {
    const usersAtStart = await helper.usersInDb()

    const user = {
      username: 'californi',
      name: 'bobby John',
      password: 'pa',
    }

    await api.post('/api/users').send(user).expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('should not create new user when username is not unique', async () => {
    const usersAtStart = await helper.usersInDb()

    const user = {
      username: 'root',
      name: 'bobby John',
      password: 'paranoia'
    }

    await api.post('/api/users').send(user).expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
  
  
})

afterAll(async () => {
  await mongoose.connection.close()
})
