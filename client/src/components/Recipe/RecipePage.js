import React from 'react'
import { withRouter } from 'react-router-dom'
import { Query } from 'react-apollo'
import { GET_RECIPE } from '../../queries'
import Like from './Like'

function RecipePage({
  match: {
    params: { id }
  }
}) {
  return (
    <Query query={GET_RECIPE} variables={{ id }}>
      {({ data, loading, error }) => {
        if (loading) return <div>Loading...</div>
        if (error) return <div>Error</div>
        const {
          name,
          category,
          description,
          instructions,
          likes,
          username
        } = data.getRecipe
        return (
          <div className="App">
            <h2>{name}</h2>
            <p>
              Category: <strong>{category}</strong>
            </p>
            <p>Description: {description}</p>
            <p>Instructions: {instructions}</p>
            <p>Likes: {likes}</p>
            <p>
              Created by: <strong>{username}</strong>
            </p>
            <Like id={id} />
          </div>
        )
      }}
    </Query>
  )
}

export default withRouter(RecipePage)
