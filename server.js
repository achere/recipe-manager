const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const cors = require('cors')

require('dotenv').config({ path: 'variables.env' })

const User = require('./models/User')
const Recipe = require('./models/Recipe')

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log('db connected')
  })
  .catch(e => {
    console.error(e)
  })

const { makeExecutableSchema } = require('graphql-tools')
const { graphiqlExpress, graphqlExpress } = require('apollo-server-express')
const { typeDefs } = require('./schema')
const { resolvers } = require('./resolvers')

const schema = makeExecutableSchema({ typeDefs, resolvers })

const app = express()

app.use(cors({ origin: 'http://localhost:3000', credentials: true }))

app.use(async (req, res, next) => {
  const token = req.headers.authorization
  if (token !== 'null') {
    try {
      const currentUser = await jwt.verify(token, process.env.SECRET)
      req.currentUser = currentUser
    } catch (e) {
      console.error(e)
    }
  }
  next()
})

// app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(({ currentUser }) => ({
    schema,
    context: { Recipe, User, currentUser }
  }))
)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
  app.get('*', (_req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  )
}

const PORT = process.env.PORT || 4444

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`)
})
