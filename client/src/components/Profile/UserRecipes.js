import React from 'react'
import { Query, Mutation } from 'react-apollo'
import {
  GET_USER_RECIPES,
  DELETE_USER_RECIPE,
  GET_ALL_RECIPIES,
  GET_CURRENT_USER
} from '../../queries'
import { Link } from 'react-router-dom'

const handleDelete = deleteUserRecipe =>
  window.confirm('Are you sure you want to delete this recipe?')
    ? deleteUserRecipe()
    : null

function UserRecipes({ username }) {
  return (
    <Query query={GET_USER_RECIPES} variables={{ username }}>
      {({ data: { getUserRecipes }, loading, error }) => {
        if (loading) return <div>Loading...</div>
        if (error) return <div>Error</div>
        return (
          <ul>
            <h3>Your Recipes:</h3>
            {!getUserRecipes.length ? (
              <p>
                <strong>You don\'t have any recipes yet</strong>
              </p>
            ) : (
              getUserRecipes.map(({ _id: id, name, likes }) => (
                <li key={id}>
                  <Link to={`/recipe/${id}`}>
                    <h4>{name}</h4>
                  </Link>
                  <p style={{ marginBottom: '0' }}>Likes: {likes}</p>
                  <Mutation
                    mutation={DELETE_USER_RECIPE}
                    variables={{ id }}
                    refetchQueries={() => [
                      { query: GET_ALL_RECIPIES },
                      { query: GET_CURRENT_USER }
                    ]}
                    update={(cache, { data: { deleteUserRecipe } }) => {
                      const { getUserRecipes } = cache.readQuery({
                        query: GET_USER_RECIPES,
                        variables: { username }
                      })
                      cache.writeQuery({
                        query: GET_USER_RECIPES,
                        variables: { username },
                        data: {
                          getUserRecipes: getUserRecipes.filter(
                            recipe => recipe._id !== deleteUserRecipe._id
                          )
                        }
                      })
                    }}
                  >
                    {(deleteUserRecipe, attrs = {}) => {
                      return (
                        <p
                          className="delete-button"
                          onClick={() => handleDelete(deleteUserRecipe)}
                        >
                          {attrs.loading ? 'deleting...' : 'X'}
                        </p>
                      )
                    }}
                  </Mutation>
                </li>
              ))
            )}
          </ul>
        )
      }}
    </Query>
  )
}

export default UserRecipes
