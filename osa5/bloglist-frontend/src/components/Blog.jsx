import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ blog, blogs, setBlogs, username, handleLike }) => {
  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const defaultHandleLike = async () => {
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

  const handleRemove = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        const returnedBlog = await blogService.remove(blog.id)
        console.log(returnedBlog)

        setBlogs(blogs.filter(b => b.id !== blog.id))

      } catch (error) {
        console.error('Error deleting blog:', error)
      }
    }
  }

  const isCreator = blog.user.username === username

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div data-testid='blog' style={blogStyle}>
      {blog.title} {blog.author}
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
        <button onClick={toggleVisibility}>hide</button>
        <p>{blog.url}</p>
        <p>{likes} <button onClick={handleLike || defaultHandleLike}>like</button></p>
        <p>{blog.user.name}</p>
        <p>{isCreator ? <button data-testid='removeButton' onClick={handleRemove}>remove</button> : null}</p>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  blogs: PropTypes.array.isRequired,
  setBlogs: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  handleLike: PropTypes.func
}

export default Blog