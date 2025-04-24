import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="w-full overflow-x-hidden font-sans">
      {/* Hero Section */}
      <section className="relative min-h-screen w-full bg-[#fdf6f0] flex flex-col items-center justify-center text-center px-4 py-20">
        <nav className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">ThinkInk</Link>
          <div className="flex gap-8">
            <Link to="/about" className="hover:text-gray-600">About</Link>
            <Link to="/features" className="hover:text-gray-600">Features</Link>
            <Link to="/blogs" className="hover:text-gray-600">Blogs</Link>
            <Link to="/contact" className="hover:text-gray-600">Contact</Link>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-7xl md:text-8xl font-serif font-bold text-gray-800 tracking-tight">
              The strategy of
              <span className="block italic"> modern blogging</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              ThinkInk® 2024 - Where thoughts transform into impactful stories
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-serif font-bold mb-6">Discover Modern Writing Experience</h2>
              <p className="text-gray-600 text-lg">
                ThinkInk is more than just a blogging platform. It's a creative sanctuary where ideas flourish and stories come to life. Our platform combines elegant design with powerful writing tools to help you create content that matters.
              </p>
            </motion.div>
          </div>
          <div className="rounded-2xl overflow-hidden">
            <img 
              src="/images/writing-experience.jpg" 
              alt="Modern Writing Experience" 
              className="w-full h-[500px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-[#f6f1ff]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-center mb-16">Why Choose ThinkInk</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Rich Text Editor",
                description: "Advanced editing tools with markdown support and real-time preview"
              },
              {
                title: "AI-Powered Insights",
                description: "Get smart suggestions and analytics to improve your writing"
              },
              {
                title: "Global Community",
                description: "Connect with writers and readers from around the world"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-sm"
              >
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold mb-6">Start Your Writing Journey Today</h2>
          <p className="text-lg text-gray-300 mb-10">
            Join thousands of writers who have already found their voice on ThinkInk
          </p>
          <div className="flex gap-6 justify-center">
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 bg-white text-gray-900 font-medium rounded-full hover:bg-gray-100 transition duration-200"
              >
                Login
              </motion.button>
            </Link>
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 bg-[#4f46e5] text-white font-medium rounded-full hover:bg-indigo-600 transition duration-200"
              >
                Sign Up Free
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600">© 2024 ThinkInk. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-600 hover:text-gray-900">Privacy</Link>
            <Link to="/terms" className="text-gray-600 hover:text-gray-900">Terms</Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
