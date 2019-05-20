import React, { Component } from 'react'
import { ADD_RECIPE, GET_ALL_RECIPIES, GET_USER_RECIPES } from '../../queries'
import { Mutation } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import Error from '../Error'
import withAuth from '../withAuth'

class AddRecipe extends Component {
  state = { ...this.initialState }

  get initialState() {
    return {
      name: '',
      description: '',
      category: 'Breakfast',
      instructions: '',
      username: ''
    }
  }

  static getDerivedStateFromProps({ session: { getCurrentUser } }) {
    return getCurrentUser ? { username: getCurrentUser.username } : null
  }

  validateForm = () => {
    const { name, description, category, instructions } = this.state
    return !name || !description || !category || !instructions
  }

  handleSubmit = addRecipe => e => {
    e.preventDefault()
    addRecipe().then(async ({ data }) => {
      this.setState({ ...this.initialState })
      await this.props.refetch()
      this.props.history.push('/')
    })
  }

  updateCache = (cache, { data: { addRecipe } }) => {
    try {
      const { getAllRecipes } = cache.readQuery({ query: GET_ALL_RECIPIES })
      cache.writeQuery({
        query: GET_ALL_RECIPIES,
        data: { getAllRecipes: [addRecipe, ...getAllRecipes] }
      })
    } catch (e) {}
  }

  handleChange = ({ target: { name, value } }) =>
    this.setState({ [name]: value })

  render() {
    const { name, description, category, instructions, username } = this.state
    return (
      <Mutation
        mutation={ADD_RECIPE}
        variables={{ name, description, category, instructions, username }}
        refetchQueries={() => [
          { query: GET_USER_RECIPES, variables: { username } }
        ]}
        update={this.updateCache}
      >
        {(addRecipe, { data, loading, error }) => {
          return (
            <div className="App">
              <h2>Add a Recipe</h2>
              <form className="form" onSubmit={this.handleSubmit(addRecipe)}>
                <input
                  name="name"
                  type="text"
                  placeholder="Recipe name"
                  value={name}
                  onChange={this.handleChange}
                />
                <select
                  name="category"
                  onChange={this.handleChange}
                  value={category}
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>
                <input
                  name="description"
                  type="text"
                  placeholder="Recipe description"
                  value={description}
                  onChange={this.handleChange}
                />
                <textarea
                  name="instructions"
                  placeholder="Recipe instructions"
                  value={instructions}
                  onChange={this.handleChange}
                />
                <button
                  disabled={loading || this.validateForm()}
                  type="submit"
                  className="button-primary"
                >
                  Submit
                </button>
                {error && <Error error={error} />}
              </form>
            </div>
          )
        }}
      </Mutation>
    )
  }
}

export default withAuth(session => session && session.getCurrentUser)(
  withRouter(AddRecipe)
)
