const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs.map(blog => blog.likes)
  return likes.reduce((a,b) => a + b, 0)
}

const favoriteBlog = (blogs) => { 
  const sortedBlogs = blogs.sort((a,b) => b.likes - a.likes)
  console.log(sortedBlogs)
  return sortedBlogs[0]
}

module.exports = {
  dummy, totalLikes, favoriteBlog
}