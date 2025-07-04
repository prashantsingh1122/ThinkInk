import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { FaPenFancy, FaCloudUploadAlt, FaUserShield, FaHeart, FaComments, FaBookmark, FaSearch, FaRobot, FaEdit, FaUserCircle, FaRocket } from "react-icons/fa";

document.documentElement.style.scrollBehavior = 'smooth';

export default function Home() {
  const splineRef = useRef(null);

  useEffect(() => {
    // Load Spline script
    const loadSplineScript = () => {
      if (!document.querySelector('script[src*="spline-viewer"]')) {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://unpkg.com/@splinetool/viewer@1.10.22/build/spline-viewer.js';
        script.onload = () => {
          // Create spline-viewer element after script loads
          if (splineRef.current) {
            const splineViewer = document.createElement('spline-viewer');
            splineViewer.setAttribute('url', 'https://prod.spline.design/W8hjIOo3glPvZ1fW/scene.splinecode');
            splineViewer.style.width = '100%';
            splineViewer.style.height = '100%';
            splineViewer.style.background = 'transparent';
            splineRef.current.appendChild(splineViewer);
            
            // Hide "Built with Spline" watermark
            setTimeout(() => {
              const watermark = splineViewer.shadowRoot?.querySelector('.spline-watermark');
              if (watermark) {
                watermark.style.display = 'none';
                watermark.style.visibility = 'hidden';
                watermark.style.opacity = '0';
                watermark.style.position = 'absolute';
                watermark.style.left = '-9999px';
                watermark.style.top = '-9999px';
              }
              
              // Also try to hide any other potential watermark elements
              const allElements = splineViewer.shadowRoot?.querySelectorAll('*');
              if (allElements) {
                allElements.forEach(element => {
                  if (element.textContent?.includes('Spline') || 
                      element.className?.includes('watermark') ||
                      element.id?.includes('watermark')) {
                    element.style.display = 'none';
                    element.style.visibility = 'hidden';
                    element.style.opacity = '0';
                  }
                });
              }
            }, 1000);
          }
        };
        document.head.appendChild(script);
      } else {
        // Script already exists, create viewer immediately
        if (splineRef.current) {
          const splineViewer = document.createElement('spline-viewer');
          splineViewer.setAttribute('url', 'https://prod.spline.design/W8hjIOo3glPvZ1fW/scene.splinecode');
          splineViewer.style.width = '100%';
          splineViewer.style.height = '100%';
          splineViewer.style.background = 'transparent';
          splineRef.current.appendChild(splineViewer);
          
          // Hide "Built with Spline" watermark
          setTimeout(() => {
            const watermark = splineViewer.shadowRoot?.querySelector('.spline-watermark');
            if (watermark) {
              watermark.style.display = 'none';
              watermark.style.visibility = 'hidden';
              watermark.style.opacity = '0';
              watermark.style.position = 'absolute';
              watermark.style.left = '-9999px';
              watermark.style.top = '-9999px';
            }
            
            // Also try to hide any other potential watermark elements
            const allElements = splineViewer.shadowRoot?.querySelectorAll('*');
            if (allElements) {
              allElements.forEach(element => {
                if (element.textContent?.includes('Spline') || 
                    element.className?.includes('watermark') ||
                    element.id?.includes('watermark')) {
                  element.style.display = 'none';
                  element.style.visibility = 'hidden';
                  element.style.opacity = '0';
                }
              });
            }
          }, 1000);
        }
      }
    };

    loadSplineScript();

    // Cleanup function
    return () => {
      if (splineRef.current) {
        splineRef.current.innerHTML = '';
      }
    };
  }, []);

  const features = [
    {
      icon: <FaPenFancy className="w-8 h-8" />,
      title: "Create & Publish Posts",
      description: "Express yourself with our powerful rich text editor. Format your content, add media, and publish your thoughts instantly to reach your audience."
    },
    {
      icon: <FaCloudUploadAlt className="w-8 h-8" />,
      title: "Seamless Image Uploads",
      description: "Enhance your posts with high-quality images. Our Cloudinary integration ensures fast, reliable, and secure image hosting with automatic optimization."
    },
    {
      icon: <FaUserShield className="w-8 h-8" />,
      title: "Enterprise-Grade Security",
      description: "Your data is protected with industry-standard JWT authentication, secure password hashing, and encrypted sessions. Your privacy is our priority."
    },
    {
      icon: <FaHeart className="w-8 h-8" />,
      title: "Interactive Like System",
      description: "Build engagement with our intuitive like system. Show appreciation for posts you love and track your most popular content in real-time."
    },
    {
      icon: <FaComments className="w-8 h-8" />,
      title: "Rich Commenting System",
      description: "Foster meaningful discussions with our threaded commenting system. Reply to comments, mention users, and build a vibrant community around your content."
    },
    {
      icon: <FaBookmark className="w-8 h-8" />,
      title: "Smart Bookmarking",
      description: "Never lose track of your favorite content. Save posts to your personal collection, organize them with tags, and access them anytime, anywhere."
    },
    {
      icon: <FaSearch className="w-8 h-8" />,
      title: "Advanced Search",
      description: "Find exactly what you're looking for with our powerful search engine. Filter by title, content, author, or tags to discover relevant posts instantly."
    },
    {
      icon: <FaRobot className="w-8 h-8" />,
      title: "AI-Powered Assistance",
      description: "Leverage cutting-edge AI to enhance your writing. Generate content summaries, create outlines, and get smart suggestions to improve your posts."
    },
    {
      icon: <FaEdit className="w-8 h-8" />,
      title: "Comprehensive Post Management",
      description: "Take full control of your content. Edit, update, or remove your posts with our intuitive management tools. Track post performance and engagement metrics."
    },
    {
      icon: <FaUserCircle className="w-8 h-8" />,
      title: "Personalized Dashboard",
      description: "Get a bird's-eye view of your blogging journey. Monitor your posts, track engagement, manage comments, and access all your content in one place."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-gray-900"></div>
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
              ThinkInk
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Welcome to ThinkInk, where your ideas come to life. Our modern MERN-powered platform combines powerful technology with elegant design to create the perfect space for writers, developers, and content creators. Share your stories, connect with like-minded individuals, and build your digital presence with our comprehensive suite of blogging tools.
            </p>
            <div className="flex gap-6 justify-center">
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
                >
                  Start Writing Now
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gray-800 text-white rounded-full font-medium hover:bg-gray-700 transition-colors"
                >
                  Sign In
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3D Model Section */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 space-y-4"
          >
            <h2 className="text-4xl font-bold">AI-Powered Content Writing</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of content creation with our advanced AI-powered writing tools. Generate ideas, enhance your writing, and create compelling content that engages your audience like never before.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="w-full max-w-7xl h-[800px] rounded-xl overflow-hidden border border-gray-600 shadow-2xl relative" ref={splineRef}>
              {/* Spline viewer will be dynamically added here */}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-4xl font-bold">Everything You Need to Succeed</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              ThinkInk provides a comprehensive suite of features designed to elevate your blogging experience. From content creation to community engagement, we've got you covered.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-indigo-500 transition-colors"
              >
                <div className="text-indigo-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold">Begin Your Writing Journey Today</h2>
            <p className="text-xl text-gray-300">
              Join our growing community of writers and content creators. Share your stories, connect with readers, and make your mark in the digital world. With ThinkInk, your voice matters.
            </p>
            <div className="flex gap-6 justify-center">
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
                >
                  Create Your Account
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 bg-gray-900 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <FaRocket className="text-indigo-400" />
            <span className="text-xl font-bold">ThinkInk</span>
          </div>
          <p className="text-gray-400 mt-4 md:mt-0">© 2024 ThinkInk. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
