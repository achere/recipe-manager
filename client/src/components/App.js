import React from 'react'
import { Query } from 'react-apollo'
import './App.css'
import { GET_ALL_RECIPIES } from '../queries'
import RecipeItem from './Recipe/RecipeItem'

const App = () => (
  <div className="App">
    <Query query={GET_ALL_RECIPIES}>
      {({ data: { getAllRecipes }, loading, error }) => {
        if (loading) return <div>Loading...</div>
        if (error) return <div>Error</div>
        return (
          <ul>
            {getAllRecipes.map(({ _id: id, name, category }) => (
              <RecipeItem key={id} id={id} name={name} category={category} />
            ))}
          </ul>
        )
      }}
    </Query>
  </div>
)

export default App
