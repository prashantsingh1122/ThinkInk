import { useState } from "react";

function App() {
  const [aiArticle, setAiArticle] = useState(null);

  // Mock AI Article generator function
  const generateAIArticle = () => {
    setAiArticle("Here are the generated article suggestions for you.");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* ------ Navbar ------ */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-800">ThinkInk</h1>
        <div className="space-x-4">
          <a href="#" className="text-gray-800 hover:text-blue-600">Home</a>
          <a href="#" className="text-gray-700 hover:text-pink-500">Create Post</a>
        </div>
      </nav>




      {/* ------ Main Content ------ */}
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h2 className="text-3xl font-semibold text-center">Welcome to ThinkInk</h2>
        <p className="text-center text-gray-600 mt-2">
          Share your thoughts, write blogs, and let AI assist your writing.
        </p>

        {/* ------ AI Article Generator ------ */}
        <div className="text-center mt-6">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            onClick={generateAIArticle}
          >
            Generate AI Article
          </button>
        </div>

        {/* ------ Display AI Article ------ */}
        {aiArticle && (
          <div className="mt-6 bg-white p-4 rounded shadow-md">
            <h3 className="text-xl font-semibold">AI Generated Article</h3>
            <p className="text-gray-700 mt-2">{aiArticle}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
