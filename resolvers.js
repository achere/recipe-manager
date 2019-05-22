const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const createToken = ({ username, email }, secret, expiresIn) => {
  return jwt.sign({ username, email }, secret, { expiresIn })
}

exports.resolvers = {
  Query: {
    getAllRecipes: async (_root, _args, { Recipe }) =>
      await Recipe.find().sort({ createdDate: 'desc' }),

    getRecipe: async (_root, { id }, { Recipe }) => await Recipe.findById(id),

    searchRecipes: async (_root, { searchTerm }, { Recipe }) =>
      searchTerm
        ? await Recipe.find(
            { $text: { $search: searchTerm } },
            { score: { $meta: 'textScore' } }
          ).sort({ score: { $meta: 'textScore' } })
        : await Recipe.find().sort({ likes: 'desc', createdDate: 'desc' }),

    getUserRecipes: async (_root, { username }, { Recipe }) =>
      await Recipe.find({ username }).sort({ createdDate: 'desc' }),

    getCurrentUser: async (_root, _args, { currentUser, User }) => {
      if (!currentUser) {
        return null
      }
      const user = await User.findOne({
        username: currentUser.username
      }).populate({ path: 'favorites', model: 'Recipe' })
      return user
    }
  },
  Mutation: {
    addRecipe: async (
      _root,
      { name, imageUrl, category, description, instructions, username },
      { Recipe }
    ) => {
      const newRecipe = await new Recipe({
        name,
        imageUrl,
        category,
        description,
        instructions,
        username
      }).save()
      return newRecipe
    },

    deleteUserRecipe: async (_root, { id }, { Recipe }) =>
      await Recipe.findByIdAndRemove(id),

    likeRecipe: async (_root, { id, username }, { Recipe, User }) => {
      await User.findOneAndUpdate(
        { username },
        { $addToSet: { favorites: id } }
      )
      return Recipe.findByIdAndUpdate(id, { $inc: { likes: 1 } })
    },

    unlikeRecipe: async (_root, { id, username }, { Recipe, User }) => {
      await User.findOneAndUpdate({ username }, { $pull: { favorites: id } })
      return Recipe.findByIdAndUpdate(id, { $inc: { likes: -1 } })
    },

    signInUser: async (_root, { username, password }, { User }) => {
      const user = await User.findOne({ username })
      if (!user) throw new Error('User not found')
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) throw new Error('Invalid password')
      return { token: createToken(user, process.env.SECRET, '1hr') }
    },

    signUpUser: async (_root, { username, email, password }, { User }) => {
      const user = await User.findOne({ username })
      if (user) throw new Error('Username already exists')
      const newUser = await new User({ username, email, password }).save()
      return { token: createToken(newUser, process.env.SECRET, '1hr') }
    }
  }
}
