import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPost, updatePost } from "../services/api";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [postData, setPostData] = useState({ title: "", content: "" });

  useEffect(() => {
    const fetchPost = async () => {
      const res = await getPost(id);
      setPostData({ title: res.data.title, content: res.data.content });
    };
    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updatePost(id, postData);
    navigate(`/posts/${id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="title"
        value={postData.title}
        onChange={handleChange}
        placeholder="Title"
        className="border p-2 w-full"
      />
      <textarea
        name="content"
        value={postData.content}
        onChange={handleChange}
        placeholder="Content"
        className="border p-2 w-full h-40"
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
    </form>
  );
}
