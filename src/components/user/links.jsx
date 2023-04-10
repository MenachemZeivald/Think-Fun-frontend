import React from 'react';
import { Link } from 'react-router-dom';
import useLogout from '../../hooks/useLogout';

function Links() {
  const logout = useLogout();

  const signOut = async () => {
    await logout();
  };
  return (
    <div className='container'>
      <br /> <br />
      <h1 className='display-1'>links</h1>
      <br /> <br /> <br />
      <br />
      <div className=''>
        <h6 className='display-5'>Public</h6>
        <Link to='/login' className='btn btn-dark m-2'>
          login
        </Link>
      </div>
      <br /> <br /> <br />
      <br />
      <div className=''>
        <h6 className='display-6'>Privet</h6>
        <Link to='/helloUser' className='btn btn-dark m-2'>
          helloUser
        </Link>
        <Link to='/admin/categories' className='btn btn-dark m-2'>
          Categories
        </Link>
        <Link to='/admin/games/matchingGame' className='btn btn-dark m-2'>
          Memory Game
        </Link>
        <Link to='/admin/users' className='btn btn-dark m-2'>
          Users
        </Link>
      </div>
      <br /> <br /> <br />
      <br />
      <div className=''>
        <button className='btn btn-danger m-2' onClick={signOut}>
          logout
        </button>
      </div>
    </div>
  );
}

export default Links;
