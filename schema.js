exports.typeDefs = `

type Recipe {
  _id: ID
  name: String!
  imageUrl: String!
  category: String!
  description: String!
  instructions: String!
  createdDate: String
  likes: Int
  username: String
}

type User {
  _id: ID
  username: String! @unique
  password: String!
  email: String!
  joinDate: String
  favorites: [Recipe]
}

type Token {
  token: String!
}

type Query {
  getAllRecipes: [Recipe]
  getCurrentUser: User
  getRecipe(id: ID!): Recipe
  searchRecipes(searchTerm: String): [Recipe]
  getUserRecipes(username: String!): [Recipe]
}

type Mutation {
  addRecipe(
      name: String!,
      imageUrl: String!,
      category: String!,
      description: String!,
      instructions: String!,
      username: String
    ): Recipe

  signInUser (
    username: String!,
    password: String!
  ): Token
  
  signUpUser(
    username: String!,
    email: String!,
    password: String!
  ): Token
  
  deleteUserRecipe(id: ID!): Recipe
  
  likeRecipe(id: ID!, username: String!): Recipe
  
  unlikeRecipe(id: ID!, username: String!): Recipe
}

`
