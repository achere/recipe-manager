import React from 'react'
import { Link } from 'react-router-dom'
import posed from 'react-pose'

const RecipeItem = posed.li({ shown: { opacity: 1 }, hidden: { opacity: 0 } })

export default ({ id, name, imageUrl, category }) => {
  return (
    <RecipeItem
      className="card"
      style={{ background: `url(${imageUrl}) center center / cover no-repeat` }}
    >
      <span className={category}>{category}</span>
      <div className="card-text">
        <Link to={`/recipe/${id}`}>
          <h4>{name}</h4>
        </Link>
      </div>
    </RecipeItem>
  )
}
