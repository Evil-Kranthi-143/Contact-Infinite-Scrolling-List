import './App.css';
import React, { useState, useEffect } from 'react';


const getUsers = async (page, results) => {
  const response = await fetch(`https://randomuser.me/api/?page=${page}&results=${results}`);
  const data = await response.json();
  return data.results;
};

const App = () => {
  const [userList, setUserList] = useState([]);
  const [page, setPage] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      loadMoreUsers();
    }
  }, [isLoggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();

    // Code for verifying the right or wrong creditinals

    if (username === 'foo' && password === 'bar') {
      setIsLoggedIn(true);
    } else {
      setLoginError("Check Your Credentials and Try again. :)");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserList([]);
    setPage(1);
  };

  const loadMoreUsers = async () => {
    setIsLoading(true);
    const newUsers = await getUsers(page, 200);
    setUserList((prevUserList) => [...prevUserList, ...newUsers]);
    setPage((prevPage) => prevPage + 1);
    setIsLoading(false);
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      loadMoreUsers();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      {isLoggedIn ? (
        <>
          <h1>Welcome to my Contact List</h1>
          <div className='logout'>
            <button onClick={handleLogout} ><span>Logout</span></button>
          </div>
          <ul>
            {userList.map((user) => (
              <li key={user.login.uuid}>
                <img src={user.picture.thumbnail} alt="User Thumbnail" />
                {`${user.name.first} ${user.name.last}`}
              </li>
            ))}
          </ul>
          {isLoading && <p> Wait Contacts Loading....</p>}
        </>
      ) : (
        <form onSubmit={handleLogin}>
          <h1>Login</h1>
          <label>
            <span>UserName :  </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <br />
          <label>
          <span>Password : </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <br />
          <button type="submit">Login</button>
          {
            <p className='Error'>{loginError}</p>
          }
        </form>
      )}
    </div>
  );
};

export default App;