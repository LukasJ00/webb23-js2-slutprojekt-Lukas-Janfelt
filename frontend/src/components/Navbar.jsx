import React from 'react';
import { Link } from 'react-router-dom';


function Navbar({ cartItemCount }) {
  return (
    <nav className='navbar'>
      <ul>
        <li>
          <Link to="/">Produkter</Link>
        </li>
        <li>
          <Link to="/cart">Kundvagnen {cartItemCount > 0 && `(${cartItemCount})`}</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
