import { useState, useEffect, useRef } from "react"
import Blog from "./components/Blog"
import Togglable from "./components/Togglable"
import BlogForm from "./components/BlogForm"
import LoginForm from "./components/LoginForm"
import Notification from "./components/Notification"
import blogService from "./services/blogs"
import loginService from "./services/login"

import { updateBlogLikes } from "./requests"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { useNotificationDispatcher } from "./contexts/NotificationContext"

import { Table, Button } from "react-bootstrap"

const App = () => {
  const queryClient = useQueryClient()
  const dispatchNotification = useNotificationDispatcher()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  const updateBlogMutation = useMutation({
    mutationFn: updateBlogLikes,
    onSuccess: queryClient.invalidateQueries({ queryKey: ["blogs"] }),
  })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const {
    data: blogs = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const fetchedBlogs = await blogService.getAll()
      return fetchedBlogs.sort((a, b) => b.likes - a.likes)
    },
  })

  if (isLoading) {
    return <div>Loading blogs...</div>
  }

  if (error) {
    return <div>Error fetching blogs: {error.message}</div>
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername("")
      setPassword("")
    } catch (exception) {
      dispatchNotification({
        type: "SET_NOTIFICATION",
        payload: {
          text: "wrong username or password",
          type: "error",
        },
      })
      setTimeout(() => {
        dispatchNotification({
          type: "CLEAR_NOTIFICATION",
        })
      }, 5000)
    }
  }

  return (
    <div className="container">
      <Notification />

      {!user && (
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      )}

      {user && (
        <div>
          <h2>blogs</h2>
          {user.name} logged in
          <Button onClick={() => window.localStorage.clear()}>logout</Button>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm blogFormRef={blogFormRef} />
          </Togglable>
          <Table style={{ margin: "20px" }} hover>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id}>
                  <Blog
                    // key={blog.id}
                    blog={blog}
                    updateBlogMutation={updateBlogMutation}
                    username={user.username}
                  />
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  )
}

export default App
