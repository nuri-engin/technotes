import { useEffect, useState } from 'react';

import MainLayout from './containers/MainLayout';
import './App.css';

function App() {
  const [getToken, setToken] = useState();
  const [getPosts, setPosts] = useState();

  const PORT = 4000;
  const BASE_URL = `http://localhost:${PORT}/api`
  
  const ENDPOINT_URL = {
    login: `${BASE_URL}/accounts/authenticate`,
    getAllPosts: `${BASE_URL}/posts`
  };

  const ENDPOINT_BODY = {
    login: {
      "email": "msesafa.engin@gmail.com",
      "password": "safa123"
    }
  };

  // Example POST method implementation:
  async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });

    return response.json(); // parses JSON response into native JavaScript objects
  }

  useEffect(()=> {
    postData(ENDPOINT_URL.login, ENDPOINT_BODY.login, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getToken
      }
    })
      .then(data => {
        if (data.jwtToken) {
          setToken(data.jwtToken); // JSON data parsed by `data.json()` call

          fetch(ENDPOINT_URL.getAllPosts, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + data.jwtToken
            },
          })
            .then(response => response.json())
            .then(data => setPosts(data));
        }
      });
  }, []);

  return (
    <div className="App">
      <MainLayout posts={getPosts} />
    </div>
  );
}

export default App;
