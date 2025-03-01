import { useEffect, useState } from "react";

export default function Home() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    console.log("Fetch blogs from backend here");
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">All Blogs</h1>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {blogs.map((blog) => (
          <div key={blog.id} className="p-4 border rounded-lg shadow">
            <h2 className="text-xl font-semibold">{blog.title}</h2>
            <p>{blog.content.slice(0, 100)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}
