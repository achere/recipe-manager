import React from 'react'
import ReactDOM from 'react-dom'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import './index.css'
import App from './components/App'
import SignIn from './components/auth/Signin'
import SignUp from './components/auth/Signup'
import Search from './components/Recipe/Search'
import AddRecipe from './components/Recipe/AddRecipe'
import Profile from './components/Profile/Profile'
import withSession from './components/withSession'
import Navbar from './components/Navbar'
import RecipePage from './components/Recipe/RecipePage'

const client = new ApolloClient({
  uri: 'https://react-graphql-apollo-recipe.herokuapp.com/graphql',
  fetchOptions: {
    credentials: 'include'
  },
  request: operation => {
    const authorization = localStorage.getItem('token')
    operation.setContext({
      headers: {
        authorization
      }
    })
  },
  onError: ({ networkError }) => {
    if (networkError) {
      console.error(networkError)
    }
  }
})

const Root = ({ refetch, session }) => (
  <Router>
    <>
      <Navbar session={session} />
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/signin" render={() => <SignIn refetch={refetch} />} />
        <Route path="/signup" render={() => <SignUp refetch={refetch} />} />
        <Route path="/search" component={Search} />
        <Route path="/profile" render={() => <Profile session={session} />} />
        <Route
          path="/recipe/add"
          render={() => <AddRecipe session={session} refetch={refetch} />}
        />
        <Route path="/recipe/:id" component={RecipePage} />
        <Redirect to="/" />
      </Switch>
    </>
  </Router>
)

const RootWithSession = withSession(Root)

ReactDOM.render(
  <ApolloProvider client={client}>
    <RootWithSession />
  </ApolloProvider>,
  document.getElementById('root')
)
