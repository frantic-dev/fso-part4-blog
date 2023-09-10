const mostBlogs = require('../utils/list_helper').mostBlogs

describe('most blogs', () => {
  const blogs = [
    {
      author: "Michael Chan",
      blogs: 7,
    },
    {
      author: "Edsger W. Dijkstra",
      blogs: 5,
    },
    {
      author: "Edsger W. Dijkstra",
      blogs: 12,
    },
    {
      author: "Robert C. Martin",
      blogs: 10,
    },
    {
      author: "Robert C. Martin",
      blogs: 5,
    },
    {
      author: "Robert C. Martin",
      blogs: 2,
    }  
  ]
  const blogs2 = [
    {
      author: "Michael Chan",
      blogs: 7,
    },
    {
      author: "Edsger W. Dijkstra",
      blogs: 5,
    },
    {
      author: "Edsger W. Dijkstra",
      blogs: 12,
    },
    {
      author: "Robert C. Martin",
      blogs: 10,
    },
    {
      author: "Robert C. Martin",
      blogs: 12,
    },
    {
      author: "Robert C. Martin",
      blogs: 2,
    }  
  ]
  test('when one author with the most blogs', () => {
    expect(
      mostBlogs(blogs)

    ).toEqual({
      author: "Edsger W. Dijkstra",
      blogs: 12,
    })
  })

  test('when more than one author with the most blogs', () => {
    expect(
      mostBlogs(blogs2)
    ).toEqual({
      author: "Robert C. Martin",
      blogs: 12,
    })
  })
  
})
