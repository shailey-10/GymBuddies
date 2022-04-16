import React, {useContext} from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";

import './NavLinks.css'

const NavLinks = props => {

    const auth = useContext(AuthContext);
    return <ul className = "nav-links">
        <li>
            <NavLink to = '/' exact> Home </NavLink>
        </li>
        <li>
            <NavLink to = '/users-in-gym'> Users In Gym</NavLink>
        </li>
        {auth.isLoggedIn && <li>
            <NavLink to = '/feed'> Feed</NavLink>
        </li>}
        {auth.isLoggedIn && <li>
            <NavLink to = {`/${auth.userId}/posts`}> My Posts</NavLink>
        </li>}
        {auth.isLoggedIn && <li>
            <NavLink to = '/post/new'> Add Post</NavLink>
        </li>}
        {auth.isLoggedIn && <li>
            <NavLink to = {`checkin/${auth.userId}`}> Checkin</NavLink>
        </li>}
        {!auth.isLoggedIn && <li>
            <NavLink to = '/auth'> Authenticate</NavLink>
        </li>}
        {auth.isLoggedIn && <li>
            <button onClick = {auth.logout}> Logout</button>
            </li>}
    </ul>
}

export default NavLinks;