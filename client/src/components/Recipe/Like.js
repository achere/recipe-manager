import React, { useState } from 'react'
import withSession from '../withSession'
import { Mutation } from 'react-apollo'
import {
  LIKE_RECIPE,
  GET_RECIPE,
  UNLIKE_RECIPE,
  GET_CURRENT_USER
} from '../../queries'

const updateLike = id => (cache, { data: { likeRecipe } }) => {
  const { getRecipe } = cache.readQuery({
    query: GET_RECIPE,
    variables: { id }
  })
  cache.writeQuery({
    query: GET_RECIPE,
    variables: { id },
    data: { getRecipe: { ...getRecipe, likes: likeRecipe.likes + 1 } }
  })
}

const updateUnlike = id => (cache, { data: { unlikeRecipe } }) => {
  const { getRecipe } = cache.readQuery({
    query: GET_RECIPE,
    variables: { id }
  })
  cache.writeQuery({
    query: GET_RECIPE,
    variables: { id },
    data: {
      getRecipe: { ...getRecipe, likes: unlikeRecipe.likes - 1 }
    }
  })
}

function Like({ session, id, refetch }) {
  const [liked, setLiked] = useState(
    () =>
      (session &&
        session.getCurrentUser &&
        session.getCurrentUser.favorites.findIndex(f => f._id === id) > -1) ||
      false
  )

  const [username] = useState(() =>
    session && session.getCurrentUser ? session.getCurrentUser.username : ''
  )

  return (
    <Mutation
      mutation={UNLIKE_RECIPE}
      variables={{ id, username }}
      update={updateUnlike(id)}
      refetchQueries={() => [
        { query: GET_CURRENT_USER, variables: { username } }
      ]}
    >
      {unlikeRecipe => (
        <Mutation
          mutation={LIKE_RECIPE}
          variables={{ id, username }}
          update={updateLike(id)}
          refetchQueries={() => [
            { query: GET_CURRENT_USER, variables: { username } }
          ]}
        >
          {likeRecipe =>
            username ? (
              <button
                className="like-button"
                onClick={() => {
                  liked ? unlikeRecipe() : likeRecipe()
                  setLiked(!liked)
                  refetch()
                }}
              >
                {liked ? 'Unlike' : 'Like'}
              </button>
            ) : null
          }
        </Mutation>
      )}
    </Mutation>
  )
}

export default withSession(Like)
