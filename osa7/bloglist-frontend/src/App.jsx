import { useState, useEffect, useRef } from "react"
import Blog from "./components/Blog"
import Togglable from "./components/Togglable"
import BlogForm from "./components/BlogForm"
import LoginForm from "./components/LoginForm"
import Notification from "./components/Notification"
import blogService from "./services/blogs"
import loginService from "./services/login"

import { useNotificationDispatcher } from "./contexts/NotificationContext"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  const dispatchNotification = useNotificationDispatcher()

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const fetchedBlogs = await blogService.getAll()
        const sortedBlogs = fetchedBlogs.sort((a, b) => b.likes - a.likes)
        setBlogs(sortedBlogs)
      } catch (error) {
        console.error("Error fetching blogs:", error)
      }
    }

    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

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

  const addBlog = async (blogObject) => {
    const returnedBlog = await blogService.create(blogObject)

    const completedBlog = {
      ...returnedBlog,
      user: user,
    }

    setBlogs(blogs.concat(completedBlog))
    blogFormRef.current.toggleVisibility()

    dispatchNotification({
      type: "SET_NOTIFICATION",
      payload: {
        text: `a new blog ${completedBlog.title} by ${completedBlog.author} added`,
        type: "success",
      },
    })
    setTimeout(() => {
      dispatchNotification({
        type: "CLEAR_NOTIFICATION",
      })
    }, 5000)
  }

  return (
    <div>
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
          <button onClick={() => window.localStorage.clear()}>logout</button>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              blogs={blogs}
              setBlogs={setBlogs}
              username={user.username}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
