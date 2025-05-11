import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { createPost, generateAIContent } from "../services/api";
// 🛡️ New Editor Imports
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';


const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const { token } = useContext(AuthContext);

  // Initialize Tiptap Editor with Placeholder
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your post here...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Get the first file from the input
  };

  const handleCopyContent = () => {
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = generatedContent;
    
    // Function to process text nodes and preserve formatting
    const processNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent;
      }
      
      if (node.nodeType === Node.ELEMENT_NODE) {
        let text = '';
        
        // Handle different elements
        switch (node.tagName.toLowerCase()) {
          case 'p':
            text = '\n\n' + Array.from(node.childNodes).map(processNode).join('') + '\n';
            break;
          case 'br':
            text = '\n';
            break;
          case 'strong':
          case 'b':
            text = Array.from(node.childNodes).map(processNode).join('');
            break;
          case 'em':
          case 'i':
            text = Array.from(node.childNodes).map(processNode).join('');
            break;
          case 'li':
            text = '\n• ' + Array.from(node.childNodes).map(processNode).join('');
            break;
          default:
            text = Array.from(node.childNodes).map(processNode).join('');
        }
        
        return text;
      }
      
      return '';
    };
    
    // Process the content
    const formattedText = processNode(tempDiv)
      .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
      .trim(); // Remove leading/trailing whitespace
    
    // Copy the formatted text
    navigator.clipboard.writeText(formattedText);
    alert("Content copied to clipboard!");
  };

  //GENERATIVE AI       PROMPPT 
  const handleGenerate = async () => {
    if (!aiPrompt) return 
    alert("Write a blog post on [your topic] that outlines key actionable insights, tips, or takeaways rather than a summary. The content should be structured with clear subheadings and bullet points, written in a helpful, engaging tone. Avoid fluff — focus on delivering real value the reader can apply.");
    
    setAiLoading(true);
    try {
      const generated = await generateAIContent(aiPrompt);
      setGeneratedContent(generated);
      editor?.commands.setContent(''); // Clear the editor content
      setContent(''); // Clear the content state
    } catch (err) {
      console.error("AI Error:", err);
      alert("❌ AI failed to generate content.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!title || !content) {
      alert("Title and content are required!");
      setIsLoading(false);
      return;
    }

    // ✅ Create FormData to send the image file
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    if (image) {
      console.log("Image to be uploaded:", image); // Log the image file
      formData.append("image", image); // Attach image if present
    }

    try {
      const res = await createPost(formData, token);
      console.log("✅ Post created successfully:", res);
      alert("✅ Post created successfully!");
      // Clear form
      setTitle("");
      setContent("");
      setImage(null);
      editor?.commands.setContent(''); // Reset the editor
    } catch (error) {
      console.error("🚨 Create Post Error:", error.message);
      if (error.response) {
        console.error("Response Data:", error.response.data);
        console.error("Response Status:", error.response.status);
      }
      if (error.request) {
        console.error("Request Data:", error.request);
      }
      alert("Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <div className="create-post-layout">
        <div className="create-post-card">
          <h2 className="create-post-title">Create New Post</h2>
          <form onSubmit={handleSubmit} className="create-post-form">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="create-post-input"
              disabled={isLoading}
            />
            

            {/* 🖊️ Mantine Rich Text Editor */}
            <RichTextEditor editor={editor} style={{ minHeight: 200 }}>
              <RichTextEditor.Toolbar sticky stickyOffset={60}>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Bold />
                  <RichTextEditor.Italic />
                  <RichTextEditor.Underline />
                  <RichTextEditor.Strikethrough />
                  <RichTextEditor.ClearFormatting />
                </RichTextEditor.ControlsGroup>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.H1 />
                  <RichTextEditor.H2 />
                  <RichTextEditor.H3 />
                  <RichTextEditor.Blockquote />
                </RichTextEditor.ControlsGroup>
              </RichTextEditor.Toolbar>

              <RichTextEditor.Content />
            </RichTextEditor>

            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="create-post-file-input"
              disabled={isLoading}
            />
            
            <button 
              type="submit" 
              className="create-post-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating post...
                </>
              ) : (
                "Create Post"
              )}
            </button>
          </form>
        </div>

        <div className="ai-feature-card">
          <h4 className="ai-feature-title">AI Content Assistant</h4>
          <div className="ai-feature-form">
            <div className="mb-4">
              <label className="block mb-1 font-medium">AI Prompt</label>
              <input
                type="text"
                placeholder="e.g., Write about benefits of yoga"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="ai-prompt-input"
                disabled={isLoading || aiLoading}
              />
            </div>
            <button
              onClick={handleGenerate}
              className="generate-button"
              disabled={aiLoading || !aiPrompt}
            >
              {aiLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                "Generate Content"
              )}
            </button>

            {generatedContent && (
              <div className="generated-content-preview">
                <div className="preview-header">
                  <h4>Generated Content</h4>
                  <button onClick={handleCopyContent} className="copy-button">
                    Copy Content
                  </button>
                </div>
                <div className="preview-content" dangerouslySetInnerHTML={{ __html: generatedContent }} />
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .create-post-container {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 100vh;
          padding: 2rem;
          background-color: #f8f9fa;
          color: #333333;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        
        .create-post-layout {
          display: flex;
          gap: 2rem;
          width: 100%;
          max-width: 1800px;
          margin: 0 auto;
          padding-top: 80px;
          scroll-behavior: smooth;
        }
        
        .create-post-card {
          flex: 1;
          background: #ffffff;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          min-height: calc(100vh - 100px);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          scroll-behavior: smooth;
        }
        
        .ai-feature-card {
          flex: 1;
          background: #ffffff;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          min-height: calc(100vh - 100px);
          display: flex;
          flex-direction: column;
          border: 1px solid #e9ecef;
          overflow-y: auto;
          scroll-behavior: smooth;
        }
        
        .create-post-title {
          font-size: 1.75rem;
          margin-bottom: 1.5rem;
          color: #333333;
          text-align: center;
          font-weight: 600;
        }
        
        .ai-feature-title {
          font-size: 1.75rem;
          margin-bottom: 1.5rem;
          color: #333333;
          text-align: center;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        
        .create-post-form,
        .ai-feature-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          flex: 1;
        }
        
        .create-post-input,
        .ai-prompt-input {
          width: 100%;
          padding: 1rem;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #ffffff;
          color: #333333;
        }
        
        .create-post-input:focus,
        .ai-prompt-input:focus {
          outline: none;
          border-color: #dee2e6;
          box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);
        }

        .create-post-file-input {
          font-size: 0.875rem;
          padding: 0.75rem;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          background: #ffffff;
          color: #333333;
        }

        .create-post-button {
          background: #333333;
          color: white;
          padding: 1rem 2rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
        }

        .generate-button {
          background: linear-gradient(45deg, #ff6b6b, #ff1493);
          color: white;
          padding: 1rem 2rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
        }

        .create-post-button:hover {
          background: #444444;
          transform: translateY(-2px);
        }

        .generate-button:hover {
          background: linear-gradient(45deg, #ff1493, #ff6b6b);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(255, 20, 147, 0.3);
        }

        .create-post-button:active,
        .generate-button:active {
          transform: translateY(0);
        }

        .create-post-button:disabled,
        .generate-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .generated-content-preview {
          margin-top: 1.5rem;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 1rem;
          background: #ffffff;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e9ecef;
        }

        .preview-header h4 {
          margin: 0;
          color: #333333;
          font-size: 1.1rem;
          font-weight: 500;
        }

        .copy-button {
          background: linear-gradient(45deg, #ff6b6b, #ff1493);
          color: white;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .copy-button:hover {
          background: linear-gradient(45deg, #ff1493, #ff6b6b);
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(255, 20, 147, 0.3);
        }

        .preview-content {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          background: #ffffff;
          border-radius: 4px;
          color: #333333;
        }

        .preview-content::-webkit-scrollbar {
          width: 8px;
        }

        .preview-content::-webkit-scrollbar-track {
          background: #f8f9fa;
        }

        .preview-content::-webkit-scrollbar-thumb {
          background: #dee2e6;
          border-radius: 4px;
        }

        .preview-content::-webkit-scrollbar-thumb:hover {
          background: #ced4da;
        }

        .ProseMirror {
          min-height: 200px;
          padding: 1rem;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          outline: none;
          background: #ffffff;
          color: #333333;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
          font-style: italic;
        }

        .ProseMirror:focus {
          border-color: #dee2e6;
          box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);
        }

        /* Smooth scrollbar styling */
        .create-post-card::-webkit-scrollbar,
        .ai-feature-card::-webkit-scrollbar,
        .preview-content::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .create-post-card::-webkit-scrollbar-track,
        .ai-feature-card::-webkit-scrollbar-track,
        .preview-content::-webkit-scrollbar-track {
          background: #f8f9fa;
          border-radius: 4px;
        }

        .create-post-card::-webkit-scrollbar-thumb,
        .ai-feature-card::-webkit-scrollbar-thumb,
        .preview-content::-webkit-scrollbar-thumb {
          background: #dee2e6;
          border-radius: 4px;
          transition: background 0.3s ease;
        }

        .create-post-card::-webkit-scrollbar-thumb:hover,
        .ai-feature-card::-webkit-scrollbar-thumb:hover,
        .preview-content::-webkit-scrollbar-thumb:hover {
          background: #ced4da;
        }

        /* Smooth transitions for all interactive elements */
        .create-post-input,
        .ai-prompt-input,
        .create-post-file-input,
        .create-post-button,
        .generate-button,
        .copy-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Smooth hover effects */
        .create-post-card:hover,
        .ai-feature-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 1024px) {
          .create-post-layout {
            flex-direction: column;
            padding-top: 100px; /* Increase padding for mobile */
          }
          
          .create-post-card,
          .ai-feature-card {
            min-height: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default CreatePost;
