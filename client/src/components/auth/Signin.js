import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Mutation } from 'react-apollo'
import { SIGNIN_USER } from '../../queries'
import Error from '../Error'

class SignIn extends Component {
  state = { ...this.initialState }

  get initialState() {
    return {
      username: '',
      password: ''
    }
  }

  handleChange = ({ target: { name, value } }) =>
    this.setState({ [name]: value })

  handleSubmit = signInUser => e => {
    e.preventDefault()
    signInUser()
      .then(async ({ data: { signInUser: { token } } }) => {
        localStorage.setItem('token', token)
        const { history, refetch } = this.props
        await refetch()
        this.setState({ ...this.initialState })
        history.push('/')
      })
      .catch(err => console.error(err))
  }

  validateForm = () => {
    const { username, password } = this.state
    return !username || !password
  }

  render() {
    const { username, password } = this.state
    return (
      <div className="App">
        <h2 className="App">Sign In</h2>
        <Mutation mutation={SIGNIN_USER} variables={{ username, password }}>
          {(signInUser, { loading, error }) => {
            return (
              <form className="form" onSubmit={this.handleSubmit(signInUser)}>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={username}
                  onChange={this.handleChange}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={this.handleChange}
                />
                <button
                  type="submit"
                  className="button-primary"
                  disabled={loading || this.validateForm()}
                >
                  Submit
                </button>
                {error && <Error error={error} />}
              </form>
            )
          }}
        </Mutation>
      </div>
    )
  }
}

export default withRouter(SignIn)
