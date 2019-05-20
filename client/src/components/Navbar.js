import React from 'react'
import { NavLink } from 'react-router-dom'
import Signout from './auth/Signout'

function Navbar({ session }) {
  return (
    <nav>
      {session && session.getCurrentUser ? (
        <NavbarAuth session={session} />
      ) : (
        <NavbarUnauth />
      )}
    </nav>
  )
}

const NavbarAuth = ({ session }) => (
  <>
    <ul>
      <li>
        <NavLink to="/" exact>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/search">Search</NavLink>
      </li>
      <li>
        <NavLink to="/recipe/add">Add Recipe</NavLink>
      </li>
      <li>
        <NavLink to="/profile">Profile</NavLink>
      </li>
      <li>
        <Signout />
      </li>
    </ul>
    <h2>
      Welcome, <strong>{session.getCurrentUser.username}!</strong>
    </h2>
  </>
)

const NavbarUnauth = () => (
  <ul>
    <li>
      <NavLink to="/" exact>
        Home
      </NavLink>
    </li>
    <li>
      <NavLink to="/search">Search</NavLink>
    </li>
    <li>
      <NavLink to="/signin">Sing In</NavLink>
    </li>
    <li>
      <NavLink to="/signup">Sign Up</NavLink>
    </li>
  </ul>
)

export default Navbar
