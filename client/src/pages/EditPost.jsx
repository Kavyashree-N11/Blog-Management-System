import {useEffect, useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import ReactQuill from "react-quill-new"; 
import 'react-quill-new/dist/quill.snow.css'; 

export default function EditPost() {

  const {id} = useParams();
  const [title,setTitle] = useState('');
  const [summary,setSummary] = useState('');
  const [content,setContent] = useState('');
  const [cover, setCover] = useState('');
  const [redirect,setRedirect] = useState(false);
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

  useEffect(() => {
    fetch(`${BASE_URL}/post/${id}`).then(response => {
      response.json().then(postInfo => {
        setTitle(postInfo.title);
        setContent(postInfo.content);
        setSummary(postInfo.summary);
        setCover(postInfo.cover);
      });
    });
  }, []);

  async function updatePost(ev) {
    ev.preventDefault();
    const data = { id, title, summary, content, cover };
    
    await fetch(`${BASE_URL}/post`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {'Content-Type':'application/json'},
      credentials: 'include',
    });
    setRedirect(true);
  }

  if (redirect) {
    return <Navigate to={'/post/'+id} />
  }

  return (
    <form onSubmit={updatePost}>
      <input type="title" placeholder={'Title'} value={title} onChange={ev => setTitle(ev.target.value)} />
      <input type="summary" placeholder={'Summary'} value={summary} onChange={ev => setSummary(ev.target.value)}/>
      <input type="text" placeholder={'Image URL'} value={cover} onChange={ev => setCover(ev.target.value)} style={{marginBottom:'5px'}}/>
      <ReactQuill value={content} onChange={setContent} modules={modules} />
      <button style={{marginTop:'5px'}}>Update post</button>
    </form>
  );
}