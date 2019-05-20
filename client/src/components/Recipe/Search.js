import React, { Component } from 'react'
import { ApolloConsumer } from 'react-apollo'
import { SEARCH_RECIPES } from '../../queries'
import SearchItem from './SearchItem'

class Search extends Component {
  state = {
    searchResults: []
  }

  handleChange = ({ searchRecipes: searchResults }) =>
    this.setState({ searchResults })

  render() {
    return (
      <ApolloConsumer>
        {client => (
          <div className="App">
            <input
              type="search"
              placeholder="Search for Recipes"
              onChange={async event => {
                event.persist()
                const { data } = await client.query({
                  query: SEARCH_RECIPES,
                  variables: { searchTerm: event.target.value }
                })
                this.handleChange(data)
              }}
            />

            <ul>
              {this.state.searchResults.map(({ _id: id, name, likes }) => (
                <SearchItem key={id} id={id} name={name} likes={likes} />
              ))}
            </ul>
          </div>
        )}
      </ApolloConsumer>
    )
  }
}

export default Search
