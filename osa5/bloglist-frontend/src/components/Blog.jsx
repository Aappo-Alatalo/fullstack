import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, blogs, setBlogs}) => {
  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: likes + 1,
    }

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      // This is the fix for 5.9*
      const completedBlog = {
        ...returnedBlog,
        user: blog.user
      }

      const updatedBlogs = blogs.map(b => b.id === blog.id ? completedBlog : b)
      const sortedBlogs = updatedBlogs.sort((a, b) => b.likes - a.likes)
      setLikes(likes + 1)
      setBlogs(sortedBlogs)
    } catch (error) {
      console.log(error)
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
        <button onClick={toggleVisibility}>hide</button>
        <p>{blog.url}</p>
        <p>{likes} <button onClick={handleLike}>like</button></p>
        <p>{blog.user.name}</p>
      </div>
    </div>
  )
}

export default Blog