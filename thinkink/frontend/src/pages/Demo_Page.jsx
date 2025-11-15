import { useState, useEffect } from "react";
import { getAllPosts } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


document.documentElement.style.scrollBehavior = 'smooth';

const Dashboard = () => {
    const [post, setPosts] = useState([]);
    //const [filteredPosts, setFilteredPosts]=useState([]); //for searching

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getAllPosts();
                setPosts(data);
                setFilteredPosts(data);
            } catch (error) {
                console.error("Error fetching posts:", error)
            }
        };
        fetchPosts();
    }, []);


return(
    <motion.div
    initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-900 pt-24 pb-12 px-8"
      >
        {/*Header section*/}
        <div>
            <motion.h1 
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              className="text-4xl font-bold text-white mb-2"
            >
              <p className="text-gray-300">
                {user?.username ? `Welcome back, ${user.username}!` : 'Welcome to ThinkInk!'}
              </p>
            </motion.h1>
            <motion.h2 
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-400"
            >
              {user?.username ? 'Share your thoughts with the world!' : 'Join our community and start sharing!'}
            </motion.h2>
          </div>
      </motion.div>
)
}