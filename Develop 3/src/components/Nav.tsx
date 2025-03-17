import React from 'react';
import { NavLink } from 'react-router-dom';
import './Nav.css'; // Optional: for styling

const Nav: React.FC = () => {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/" end>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/saved-candidates">
            Potential Candidates
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
