import React from 'react';
import { Link } from 'react-router-dom';

function Links() {
  return (
    <div className=''>
      <Link to='/admin/categories' className='btn  m-2 link-admin'>
        Categories
      </Link>
      <Link to='/admin/games/matchingGame' className='btn  m-2 link-admin'>
        matching Game
      </Link>
      <Link to='/admin/users' className='btn  m-2 link-admin'>
        Users
      </Link>
    </div>
  );
}

export default Links;
