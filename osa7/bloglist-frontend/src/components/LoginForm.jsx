import PropTypes from "prop-types"
import { Form, Button } from "react-bootstrap"

const LoginForm = ({
  handleLogin,
  username,
  setUsername,
  password,
  setPassword,
}) => (
  <div>
    <h2>Log in to application</h2>
    <Form onSubmit={handleLogin}>
      <Form.Group>
        <Form.Label>username:</Form.Label>
        <input
          data-testid="usernameInput"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>password:</Form.Label>
        <input
          data-testid="passwordInput"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </Form.Group>
      <Button data-testid="submitButton" type="submit">
        login
      </Button>
    </Form>
  </div>
)

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
}

export default LoginForm
