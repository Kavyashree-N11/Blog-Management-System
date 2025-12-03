import {format} from "date-fns";
import {Link} from "react-router-dom";

export default function Post({_id, title, summary, cover, content, createdAt, author}) {

  // This function replaces broken images with a default one automatically
  const addDefaultSrc = (ev) => {
    ev.target.src = 'https://images.unsplash.com/photo-1499750310159-5b9887039e54?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
  }

  return (
    <div className="post">
      
      {/* 1. IMAGE SECTION (Left Side) */}
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img 
            src={cover} 
            alt="Cover" 
            onError={addDefaultSrc} 
          />
        </Link>
      </div>

      {/* 2. TEXT SECTION (Right Side) */}
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        
        <p className="info">
          <a className="author">{author.username}</a>
          {/* This formats the date nicely, e.g., "Dec 3, 2025 15:30" */}
          <time>{format(new Date(createdAt), 'MMM d, yyyy HH:mm')}</time>
        </p>
        
        <p className="summary">{summary}</p>
      </div>

    </div>
  );
}