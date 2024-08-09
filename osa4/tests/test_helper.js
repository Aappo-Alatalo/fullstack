const Blog = require('../models/blog')

const initBlogs = [
    {
      title: 'HTML is easy actually',
      author: 'easy, actually',
      url: 'localhost-4040404',
      likes: 10
    },
    {
      title: 'CSS is my favourite, here is why.',
      author: 'frontendninja',
      url: 'localhost-5202023',
      likes: 2
    },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initBlogs, blogsInDb
}