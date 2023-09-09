const favoriteBlog = require("../utils/list_helper").favoriteBlog

describe("favorite blog", ()=> {
  const blogs = [
    {
      title: "React patterns",
      author: "Michael Chan",
      likes: 7,
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      likes: 5,
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    },
    {
      title: "First class tests",
      author: "Robert C. Martin",
      likes: 10,
    },
    {
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      likes: 0,
    },
    {
      title: "Type wars",
      author: "Robert C. Martin",
      likes: 2,
    }  
  ]
  const blogs2 = [
    {
      title: "React patterns",
      author: "Michael Chan",
      likes: 7,
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      likes: 5,
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    },
    {
      title: "First class tests",
      author: "Robert C. Martin",
      likes: 14,
    },
    {
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      likes: 0,
    },
    {
      title: "Type wars",
      author: "Robert C. Martin",
      likes: 14,
    }  
  ]
  test("list with one favorite blog", ()=>{
    expect(favoriteBlog(blogs)).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    })
  })
  test("list with more than one favorite blog", ()=>{
    expect(favoriteBlog(blogs2)).toEqual({
      title: "First class tests",
      author: "Robert C. Martin",
      likes: 14,
    })
  })
})