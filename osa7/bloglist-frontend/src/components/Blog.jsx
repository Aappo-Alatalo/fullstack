import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import blogService from "../services/blogs"
import PropTypes from "prop-types"

const Blog = ({ blog, updateBlogMutation, username }) => {
  const queryClient = useQueryClient()

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? "none" : "" }
  const showWhenVisible = { display: visible ? "" : "none" }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = async () => {
    updateBlogMutation.mutate(blog)
  }

  const deleteBlogMutation = useMutation({
    mutationFn: (blogId) => blogService.remove(blogId),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["blogs"] })
    },
  })

  const handleRemove = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        // Call the mutate function from the mutation
        await deleteBlogMutation.mutateAsync(blog.id)
      } catch (error) {
        console.error("Error deleting blog:", error)
      }
    }
  }

  const isCreator = blog.user.username === username

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div data-testid="blog" style={blogStyle}>
      {blog.title} {blog.author}
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
        <button onClick={toggleVisibility}>hide</button>
        <p>{blog.url}</p>
        <p>
          {blog.likes} <button onClick={handleLike}>like</button>
        </p>
        <p>{blog.user.name}</p>
        <p>
          {isCreator ? (
            <button data-testid="removeButton" onClick={handleRemove}>
              remove
            </button>
          ) : null}
        </p>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  handleLike: PropTypes.func,
}

export default Blog
