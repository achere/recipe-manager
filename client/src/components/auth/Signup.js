import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Mutation } from 'react-apollo'
import { SIGNUP_USER } from '../../queries'
import Error from '../Error'

export class SignUp extends Component {
  state = { ...this.initialState }

  get initialState() {
    return {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: ''
    }
  }

  handleChange = ({ target: { name, value } }) =>
    this.setState({ [name]: value })

  handleSubmit = signUpUser => e => {
    e.preventDefault()
    signUpUser()
      .then(async ({ data: { signUpUser: { token } } }) => {
        localStorage.setItem('token', token)
        const { history, refetch } = this.props
        await refetch()
        this.setState({ ...this.initialState })
        history.push('/')
      })
      .catch(err => console.error(err))
  }

  validateForm = () => {
    const { username, email, password, passwordConfirmation } = this.state
    return (
      !username || !email || !password || !password === !passwordConfirmation
    )
  }

  render() {
    const { username, email, password, passwordConfirmation } = this.state
    return (
      <div className="App">
        <h2 className="App">Sign Up</h2>
        <Mutation
          mutation={SIGNUP_USER}
          variables={{ username, email, password }}
        >
          {(signUpUser, { data, loading, error }) => {
            return (
              <form className="form" onSubmit={this.handleSubmit(signUpUser)}>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={username}
                  onChange={this.handleChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={email}
                  onChange={this.handleChange}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={this.handleChange}
                />
                <input
                  type="password"
                  name="passwordConfirmation"
                  placeholder="Confirm password"
                  value={passwordConfirmation}
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

export default withRouter(SignUp)
