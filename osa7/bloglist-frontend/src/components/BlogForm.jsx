import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import blogService from "../services/blogs"
import { useNotificationDispatcher } from "../contexts/NotificationContext"
import { Button } from "react-bootstrap"

const BlogForm = ({ blogFormRef }) => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatcher()

  const [newBlogTitle, setNewBlogTitle] = useState("")
  const [newBlogAuthor, setNewBlogAuthor] = useState("")
  const [newBlogURL, setNewBlogURL] = useState("")

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] })
      dispatch({
        type: "SET_NOTIFICATION",
        payload: {
          text: `a new blog ${data.title} by ${data.author} added`,
          type: "success",
        },
      })
      setTimeout(() => {
        dispatch({
          type: "CLEAR_NOTIFICATION",
        })
      }, 5000)
    },
  })

  const onCreate = (event) => {
    event.preventDefault()

    const blogData = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogURL,
      likes: 0,
    }

    newBlogMutation.mutate(blogData)

    setNewBlogTitle("")
    setNewBlogAuthor("")
    setNewBlogURL("")
    blogFormRef.current.toggleVisibility()
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={onCreate}>
        <div style={{ marginTop: "10px" }}>
          title:
          <input
            data-testid="titleInput"
            id="titleInput"
            value={newBlogTitle}
            onChange={(e) => setNewBlogTitle(e.target.value)}
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          author:
          <input
            data-testid="authorInput"
            id="authorInput"
            value={newBlogAuthor}
            onChange={(e) => setNewBlogAuthor(e.target.value)}
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          url:
          <input
            data-testid="urlInput"
            id="urlInput"
            value={newBlogURL}
            onChange={(e) => setNewBlogURL(e.target.value)}
          />
        </div>
        <Button
          style={{ marginTop: "10px" }}
          data-testid="submitBlogButton"
          id="submitBlogButton"
          type="submit"
        >
          create
        </Button>
      </form>
    </>
  )
}

export default BlogForm
