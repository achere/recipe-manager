import React, { useState, useLayoutEffect } from 'react'
import { Query } from 'react-apollo'
import posed from 'react-pose'
import './App.css'
import { GET_ALL_RECIPIES } from '../queries'
import RecipeItem from './Recipe/RecipeItem'
import Spinner from './Spinner'

const RecipeList = posed.ul({
  shown: {
    x: '0%',
    staggerChildren: 100
  },
  hidden: {
    x: '-100%'
  }
})

const App = () => {
  const [animated, setAnimated] = useState(false)

  useLayoutEffect(() => {
    setTimeout(() => {
      setAnimated(true)
    }, 200)
  })

  return (
    <div className="App">
      <h1 className="main-title">
        Find Recipes You <strong>Love</strong>
      </h1>
      <Query query={GET_ALL_RECIPIES}>
        {({ data: { getAllRecipes }, loading, error }) => {
          if (loading) return <Spinner />
          if (error) return <div>Error</div>
          return (
            <RecipeList className="cards" pose={animated ? 'shown' : 'hidden'}>
              {getAllRecipes.map(({ _id: id, name, imageUrl, category }) => (
                <RecipeItem
                  key={id}
                  id={id}
                  name={name}
                  imageUrl={imageUrl}
                  category={category}
                />
              ))}
            </RecipeList>
          )
        }}
      </Query>
    </div>
  )
}

export default App
