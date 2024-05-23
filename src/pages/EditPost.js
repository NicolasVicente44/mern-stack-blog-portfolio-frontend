import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }

    fetch(`https://mern-blog-backend-fd7k.onrender.com/post/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Post not found");
        }
        return response.json();
      })
      .then((postInfo) => {
        setTitle(postInfo.title);
        setContent(postInfo.content);
        setSummary(postInfo.summary);
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
        setRedirect(true);
      });
  }, [id]);

  async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("id", id);
    if (files?.[0]) {
      data.set("file", files?.[0]);
    }
    const response = await fetch(
      "https://mern-blog-backend-fd7k.onrender.com/post",
      {
        method: "PUT",
        body: data,
        credentials: "include",
      }
    );
    if (response.ok) {
      setRedirect(true);
    }
  }

  async function deletePost() {
    try {
      const response = await fetch(
        `https://mern-blog-backend-fd7k.onrender.com/post/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (response.ok) {
        setRedirect(true);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }

  if (!id) {
    return null;
  }

  if (redirect) {
    return <Navigate to="/" />; // Redirect to home page
  }

  return (
    <div>
      <form onSubmit={updatePost}>
        <input
          type="title"
          placeholder={"Title"}
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
        />
        <input
          type="summary"
          placeholder={"Summary"}
          value={summary}
          onChange={(ev) => setSummary(ev.target.value)}
        />
        <input type="file" onChange={(ev) => setFiles(ev.target.files)} />
        <Editor onChange={setContent} value={content} />
        <button type="submit" style={{ marginTop: "5px" }}>
          Update post
        </button>
      </form>
      <button onClick={deletePost} style={{ marginTop: "5px" }}>
        Delete post
      </button>
    </div>
  );
}
