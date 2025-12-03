import {Link} from "react-router-dom";
import {useContext, useEffect} from "react";
import {UserContext} from "./UserContext";

export default function Header() {
  const {userInfo, setUserInfo} = useContext(UserContext);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

  useEffect(() => {
    fetch(`${BASE_URL}/profile`, {credentials:'include'}).then(response => {
       response.json().then(userInfo => {
         setUserInfo(userInfo);
       });
    });
  }, []);

  function logout() {
    fetch(`${BASE_URL}/logout`, {
        method: 'POST', 
        credentials: 'include'
    }).then(() => {
        setUserInfo(null);
    });
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">MyBlog</Link>
      <nav>
        {username && (
          <>
            <Link to="/create">Create New Post</Link>
            <a onClick={logout}>Logout ({username})</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}