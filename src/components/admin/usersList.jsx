import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivet';
import { useLocation, useNavigate } from 'react-router-dom';

export default function UsersList() {
  const axiosPrivate = useAxiosPrivate();
  const nav = useNavigate();
  const location = useLocation();

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sort, setShort] = useState('');
  const [reverse, setReverse] = useState(false);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getUsers();
  }, [sort, page, perPage, reverse, search]);

  let isMounted = true;
  const controller = new AbortController();
  const getUsers = async (page) => {
    try {
      const response = await axiosPrivate.get(`/users/allUsers/?perPage=${perPage}&page=${page}&sort=${sort}&reverse=${reverse}&s=${search}`, {
        signal: controller.signal,
      });
      isMounted && setUsers(response.data);
      // console.log(response.data);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      nav('/login', { state: { from: location }, replace: true });
    }
  };

  const changeRole = async (e, _id) => {
    let newRole = e.target.value;
    let url = `/users/role/?user_id=${_id}&role=${newRole}`;
    try {
      const response = await axiosPrivate.patch(url, {
        signal: controller.signal,
      });
      console.log(response.data);
      if (response.data.modifiedCount == 1) {
        getUsers();
      }
    } catch (err) {
      if (err.response.status === 401) {
        console.log(err.response.data);
      } else {
        console.error(err);
        nav('/login', { state: { from: location }, replace: true });
      }
    }
  };

  useEffect(() => {
    count();
  }, [perPage]);

  const count = async () => {
    let url = `/users/count/?perPage=${perPage}`;
    try {
      const response = await axiosPrivate.get(url);
      // console.log(response.data);
    } catch (err) {
      console.log(err);
      //alert("There problem , come back late");
    }
  };

  return isLoading ? (
    <img src='https://img.pikbest.com/png-images/20190918/cartoon-snail-loading-loading-gif-animation_2734139.png!bw700' />
  ) : (
    <div className='categories-container'>
      <div className='center-container'>
        <div className='text-container'>
          <h1>List of Users</h1>
        </div>
        <div className='sort-container'>
          <div className='select-container'>
            <select className='form-select' onChange={(e) => setShort(e.target.value)}>
              <option value=''>sort by</option>
              <option value='_id'>date</option>
              <option value='email'>email</option>
              <option value='name'>name</option>
            </select>
          </div>
          <div className='select-container'>
            <select className='form-select' onChange={(e) => setPerPage(e.target.value)}>
              <option value=''>how much</option>
              <option value='5'>5</option>
              <option value='10'>10</option>
              <option value='15'>15</option>
              <option value='20'>20</option>
              <option value='50'>50</option>
            </select>
          </div>
          <div className='search-container'>
            <input placeholder='search user...' className='form-control search' type='text' onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className='form-check form-switch revers-container'>
            <input className='form-check-input' type='checkbox' id='reverse' onChange={() => setReverse((prev) => !prev)} checked={reverse} />
            <label className='form-check-label' htmlFor='reverse' style={{ color: 'black' }}>
              Reverse
            </label>
          </div>
        </div>
        <div className='table-container'>
          <table className='table table-striped table-hover'>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item, i) => {
                return (
                  <tr key={item._id}>
                    <td>{i + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>
                      <select className='form-select' onChange={(e) => changeRole(e, item._id)}>
                        {/* <option value="">chose role</option> */}
                        <option value={item.role}>{item.role}</option>
                        <option value={item.role === 'admin' ? 'user' : item.role === 'user' ? 'admin' : 'user'}>
                          {item.role === 'admin' ? 'user' : item.role === 'user' ? 'admin' : 'user'}
                        </option>
                        <option value={item.role === 'admin' || item.role === 'user' ? 'block' : 'admin'}>
                          {item.role === 'admin' || item.role === 'user' ? 'block' : 'admin'}
                        </option>
                      </select>
                    </td>
                    <td>{item.date_created.substring(0, 10)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
