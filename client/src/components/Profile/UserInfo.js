import React from 'react'
import { Link } from 'react-router-dom'

function UserInfo({ session }) {
  const { username, email, joinDate, favorites } = session.getCurrentUser
  return (
    <>
      <h3>User Info</h3>
      <p>Username: {username}</p>
      <p>Email: {email}</p>
      <p>Join Date: {new Date(joinDate).toLocaleDateString()}</p>
      <ul>
        <h3>{username}'s Favorites:</h3>
        {favorites.length ? (
          favorites.map(({ _id: id, name }) => (
            <li key={id}>
              <Link to={`/recipe/${id}`}>{name}</Link>
            </li>
          ))
        ) : (
          <p>You haven't added anything to favorites yet</p>
        )}
      </ul>
    </>
  )
}

export default UserInfo
