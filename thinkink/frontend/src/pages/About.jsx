import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const About = () => {
  const features = [
    {
      title: "Rich Text Editor",
      description: "Create beautiful posts with our advanced markdown editor and real-time preview",
      icon: "✍️"
    },
    {
      title: "Cloud Storage",
      description: "Seamlessly upload and manage images with Cloudinary integration",
      icon: "☁️"
    },
    {
      title: "AI Assistant",
      description: "Get AI-powered content suggestions and summaries for your posts",
      icon: "🤖"
    },
    {
      title: "Social Features",
      description: "Like, comment, and bookmark posts to engage with the community",
      icon: "❤️"
    },
    {
      title: "Smart Search",
      description: "Find content easily with our powerful search functionality",
      icon: "🔍"
    },
    {
      title: "User Dashboard",
      description: "Manage your posts and track your content's performance",
      icon: "📊"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12 px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-white mb-6">About ThinkInk</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A modern MERN-powered blogging platform that empowers writers to share their stories with the world.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <div className="bg-gray-800 rounded-3xl p-12">
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              ThinkInk is more than just a blogging platform. It's a creative sanctuary where ideas flourish and stories come to life. 
              Our platform combines elegant design with powerful writing tools to help you create content that matters.
            </p>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Platform Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-indigo-500 transition-colors"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-20"
        >
          <div className="bg-gray-800 rounded-3xl p-12">
            <h2 className="text-3xl font-bold text-white mb-6">Built with Modern Technology</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Frontend</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• React.js for dynamic user interface</li>
                  <li>• Tailwind CSS for modern styling</li>
                  <li>• Framer Motion for smooth animations</li>
                  <li>• Context API for state management</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Backend</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Node.js and Express.js server</li>
                  <li>• MongoDB for flexible data storage</li>
                  <li>• JWT for secure authentication</li>
                  <li>• Cloudinary for image management</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Start Writing?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our community of writers and share your stories with the world. Start your writing journey today!
          </p>
          <div className="flex gap-6 justify-center">
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition duration-200"
              >
                Get Started
              </motion.button>
            </Link>
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 bg-gray-800 text-white font-medium rounded-full hover:bg-gray-700 transition duration-200"
              >
                Contact Us
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About; 