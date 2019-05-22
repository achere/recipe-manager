import { gql } from 'apollo-boost'
import { recipeFragments } from './fragments'

export const GET_ALL_RECIPIES = gql`
  query getAllRecipes {
    getAllRecipes {
      _id
      name
      imageUrl
      category
    }
  }
`

export const ADD_RECIPE = gql`
  mutation addRecipe(
    $name: String!
    $imageUrl: String!
    $category: String!
    $description: String!
    $instructions: String!
    $username: String
  ) {
    addRecipe(
      name: $name
      imageUrl: $imageUrl
      category: $category
      description: $description
      instructions: $instructions
      username: $username
    ) {
      ...CompleteRecipe
    }
  }
  ${recipeFragments.recipe}
`

export const GET_RECIPE = gql`
  query getRecipe($id: ID!) {
    getRecipe(id: $id) {
      ...CompleteRecipe
    }
  }
  ${recipeFragments.recipe}
`

export const SEARCH_RECIPES = gql`
  query searchRecipes($searchTerm: String) {
    searchRecipes(searchTerm: $searchTerm) {
      _id
      name
      likes
    }
  }
`

export const GET_USER_RECIPES = gql`
  query getUserRecipes($username: String!) {
    getUserRecipes(username: $username) {
      _id
      name
      likes
    }
  }
`

export const DELETE_USER_RECIPE = gql`
  mutation deleteUserRecipe($id: ID!) {
    deleteUserRecipe(id: $id) {
      _id
      name
    }
  }
`

export const LIKE_RECIPE = gql`
  mutation likeRecipe($id: ID!, $username: String!) {
    likeRecipe(id: $id, username: $username) {
      ...LikeRecipe
    }
  }
  ${recipeFragments.like}
`

export const UNLIKE_RECIPE = gql`
  mutation unlikeRecipe($id: ID!, $username: String!) {
    unlikeRecipe(id: $id, username: $username) {
      ...LikeRecipe
    }
  }
  ${recipeFragments.like}
`

export const GET_CURRENT_USER = gql`
  query getCurrentUser {
    getCurrentUser {
      username
      joinDate
      email
      favorites {
        _id
        name
      }
    }
  }
`

export const SIGNIN_USER = gql`
  mutation signInUser($username: String!, $password: String!) {
    signInUser(username: $username, password: $password) {
      token
    }
  }
`

export const SIGNUP_USER = gql`
  mutation signUpUser($username: String!, $email: String!, $password: String!) {
    signUpUser(username: $username, email: $email, password: $password) {
      token
    }
  }
`
