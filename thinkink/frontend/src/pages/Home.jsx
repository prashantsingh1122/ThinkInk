import { Link } from "react-router-dom";

export default function Home() {

  let counter = 10;
  const Advalue = () => {
    console.log("Clicked", counter);
    counter = counter + 1;
  };
  const removeValue = () => {
    console.log("clicked", counter);
    counter = counter - 1;
  }

    return (
      <div className="h-screen flex flex-col  items-center justify-center bg-red-100 text-center p-6">
        <h1 className="text-6xl font-bold text-pink-800 mb-4">THINKINK</h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome to My Blog</h2>
        <p className="text-lg text-gray-600 mb-6">Share your thoughts, explore ideas, and connect with others.</p>

        <div className="flex space-x-4">
          <Link to="/login">
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
              Login
            </button>
          </Link>
          <Link to="/signup">
            <button className="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition">
              Sign Up
            </button>
          </Link>
        </div>
        <h3>Counter Value is {counter}</h3>
        <button className="bg-yellow-500 text-black p-2 rounded-lg hover:bg-yellow-100"
          onClick={Advalue}>Click to Add </button>
        <br />
        <button className="bg-red-500 text-black p-2 rounded-lg hover:bg-red-100"
          onClick={removeValue}
        >Removeby1</button>
      </div>

    );
  }
