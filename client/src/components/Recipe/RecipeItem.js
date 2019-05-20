import React from 'react'
import { Link } from 'react-router-dom'

function RecipeItem({ id, name, category }) {
  return (
    <li>
      <Link to={`/recipe/${id}`}>
        <h4>{name}</h4>
      </Link>
      <p>
        <strong>{category}</strong>
      </p>
    </li>
  )
}

export default RecipeItem
