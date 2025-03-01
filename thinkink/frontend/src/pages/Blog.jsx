import { useParams } from "react-router-dom";

export default function Blog() {
  const { id } = useParams();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Blog ID: {id}</h1>
      <p>Fetch and display blog content here...</p>
    </div>
  );
}
