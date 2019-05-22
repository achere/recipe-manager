import React from 'react'
import { withRouter } from 'react-router-dom'
import { Query } from 'react-apollo'
import { GET_RECIPE } from '../../queries'
import Like from './Like'
import Spinner from '../Spinner'

function RecipePage({
  match: {
    params: { id }
  },
  refetch
}) {
  return (
    <Query query={GET_RECIPE} variables={{ id }}>
      {({ data, loading, error }) => {
        if (loading)
          return (
            <div className="App">
              <Spinner />
            </div>
          )
        if (error) return <div className="App">Error</div>
        const {
          name,
          imageUrl,
          category,
          description,
          instructions,
          likes,
          username
        } = data.getRecipe
        return (
          <div className="App">
            <div
              className="recipe-image"
              style={{
                background: `url(${imageUrl}) center center / cover no-repeat`
              }}
            />
            <div className="recipe">
              <div className="recipe-header">
                <h2 className="recipe-name">
                  <strong>{name}</strong>
                </h2>
                <h5>
                  <strong>{category}</strong>
                </h5>
                <p>
                  Created by <strong>{username}</strong>
                </p>
                <p>
                  {likes}{' '}
                  <span role="img" aria-label="heart">
                    💙
                  </span>
                </p>
              </div>
              <blockquote className="recipe-description">
                {description}
              </blockquote>
              <h3 className="recipe-instructions__title">Instructions</h3>
              <div
                className="recipe-instructions"
                dangerouslySetInnerHTML={{ __html: instructions }}
              />
              <Like id={id} refetch={refetch} />
            </div>
          </div>
        )
      }}
    </Query>
  )
}

export default withRouter(RecipePage)
