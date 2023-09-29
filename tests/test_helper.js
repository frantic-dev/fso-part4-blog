const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'workout',
    author: 'David Rob ',
    url: 'google.com',
    likes: 2738,
  },
  {
    title: 'health',
    author: 'Monica Stephan ',
    url: 'youtube.com',
    likes: 4211,
  },
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
}
