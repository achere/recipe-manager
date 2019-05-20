import React from 'react'
import { ApolloConsumer } from 'react-apollo'
import { withRouter } from 'react-router-dom'

const handleSignOut = (client, history) => () => {
  localStorage.removeItem('token')
  client.resetStore()
  history.push('/')
}

function Signout({ history }) {
  return (
    <ApolloConsumer>
      {client => {
        return (
          <button onClick={handleSignOut(client, history)}>Sign Out</button>
        )
      }}
    </ApolloConsumer>
  )
}

export default withRouter(Signout)
