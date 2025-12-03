import {useEffect, useState} from "react";
import Post from "../Post";

export default function IndexPage() {
  const [posts,setPosts] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

  useEffect(() => {
    fetch(`${BASE_URL}/post`).then(response => {
      response.json().then(posts => {
        setPosts(posts);
      });
    });
  }, []);

  return (
    <>
      {posts.length > 0 && posts.map(post => (
        <Post {...post} key={post._id} />
      ))}
    </>
  );
}