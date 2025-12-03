import ReactQuill from "react-quill-new";
import 'react-quill-new/dist/quill.snow.css'; 
import {useState} from "react";
import {Navigate} from "react-router-dom";

export default function CreatePost() {
  const [title,setTitle] = useState('');
  const [summary,setSummary] = useState('');
  const [content,setContent] = useState('');
  const [cover, setCover] = useState(''); 
  const [redirect, setRedirect] = useState(false);
  
  // FIXED: Ensure BASE_URL is defined
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  async function createNewPost(ev) {
    ev.preventDefault();
    const data = { title, summary, content, cover };
    
    // Add Credentials include to send cookies
    const response = await fetch(`${BASE_URL}/post`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', 
    });
    
    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }

  return (
    <form onSubmit={createNewPost}>
      <input type="title" placeholder={'Title'} value={title} onChange={ev => setTitle(ev.target.value)} />
      <input type="summary" placeholder={'Summary'} value={summary} onChange={ev => setSummary(ev.target.value)}/>
      <input type="text" placeholder={'Image URL'} value={cover} onChange={ev => setCover(ev.target.value)} style={{marginBottom:'5px'}}/>
      
      <ReactQuill value={content} onChange={setContent} modules={modules} />
      
      <button style={{marginTop:'5px'}}>Create post</button>
    </form>
  );
}