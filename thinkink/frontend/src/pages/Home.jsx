import { useEffect } from "react";

function Home() {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        console.log("Fetching blogs from backend here");
    }
    , []);
    return (
        <div classname="p-10">
            <h1 className="text-3xl font-bolditalic">Blog ID</h1>
            <p >Fetch and display blog content Here</p>
        </div>
    );
}