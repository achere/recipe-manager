import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import CKEditor from 'react-ckeditor-component'
import { ADD_RECIPE, GET_ALL_RECIPIES, GET_USER_RECIPES } from '../../queries'
import Error from '../Error'
import withAuth from '../withAuth'

class AddRecipe extends Component {
  state = { ...this.initialState }

  get initialState() {
    return {
      name: '',
      imageUrl: '',
      description: '',
      category: 'Breakfast',
      instructions: '',
      username: ''
    }
  }

  static getDerivedStateFromProps({ session: { getCurrentUser } }) {
    return getCurrentUser ? { username: getCurrentUser.username } : null
  }

  isFormInvalid = () => {
    const { name, imageUrl, description, category, instructions } = this.state
    return !name || !imageUrl || !description || !category || !instructions
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

  handleEditorChange = e => this.setState({ instructions: e.editor.getData() })

  render() {
    const {
      name,
      imageUrl,
      description,
      category,
      instructions,
      username
    } = this.state
    return (
      <Mutation
        mutation={ADD_RECIPE}
        variables={{
          name,
          imageUrl,
          description,
          category,
          instructions,
          username
        }}
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
                <input
                  name="imageUrl"
                  type="text"
                  placeholder="Recipe image URL"
                  value={imageUrl}
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
                <label htmlFor="instructions">Add instructions</label>
                <CKEditor
                  name="instructions"
                  content={instructions}
                  events={{ change: this.handleEditorChange }}
                />
                <button
                  disabled={loading || this.isFormInvalid()}
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
