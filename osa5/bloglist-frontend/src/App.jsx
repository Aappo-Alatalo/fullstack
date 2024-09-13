import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ message, type }) => {
  if (message === null || type === null) {
    return null
  }

  return (
    <div className={type}>
      {message}
    </div>
  )
}

const LoginForm = ({ handleLogin, username, setUsername, password, setPassword}) => (
  <div>
    <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
      <button type="submit">login</button>
    </form>      
  </div>
)

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
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
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } 
    catch (exception) {
      setNotificationMessage('wrong username or password')
      setNotificationType('error')
      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationType(null)
      }, 5000)
    }
  }

  const addBlog = async (blogObject) => {
    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))

    setNotificationMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
    setNotificationType('success')
    setTimeout(() => {
      setNotificationMessage(null)
      setNotificationType(null)
    }, 5000)

    blogFormRef.current.toggleVisibility()
  }

  return (
    <div>
      <Notification message={notificationMessage} type={notificationType} />

      {!user && 
        <LoginForm 
        handleLogin={handleLogin}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        />
      }

      {user && <div>
        <h2>blogs</h2>

        {user.name} logged in
        <button onClick={() => window.localStorage.clear()}>logout</button>

        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>

        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
        </div>
      }
    </div>
  )
}

export default App