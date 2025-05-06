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

  //GENERATIVE AI  
  const handleGenerate = async () => {
    if (!aiPrompt) return alert("Write a blog post on [your topic] that outlines key actionable insights, tips, or takeaways rather than a summary. The content should be structured with clear subheadings and bullet points, written in a helpful, engaging tone. Avoid fluff — focus on delivering real value the reader can apply.");
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
          <h4 className="ai-feature-title">USE AI FOR SUGGESTION</h4>
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
                  WAIT A MIN BIATCH
                </>
              ) : (
                "Generate AI Content"
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
          padding: 1rem;
          background-color: #f5f5f5;
        }
        
        .create-post-layout {
          display: flex;
          gap: 1rem;
          width: 100%;
          max-width: 1800px;
          margin: 0 auto;
        }
        
        .create-post-card {
          flex: 1;
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          min-height: calc(100vh - 2rem);
          display: flex;
          flex-direction: column;
        }
        
        .ai-feature-card {
          flex: 1;
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          min-height: calc(100vh - 2rem);
          display: flex;
          flex-direction: column;
          border: 2px solid transparent;
          background-image: linear-gradient(white, white), 
                          linear-gradient(45deg, #ff6b6b, #9c27b0, #ff1493);
          background-origin: border-box;
          background-clip: padding-box, border-box;
        }
        
        .create-post-title {
          font-size: 1.75rem;
          margin-bottom: 1.5rem;
          color: #333;
          text-align: center;
          font-weight: 600;
        }
        
        .ai-feature-title {
          font-size: 1.75rem;
          margin-bottom: 1.5rem;
          background: linear-gradient(45deg, #ff6b6b, #9c27b0, #ff1493);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-align: center;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        
        .create-post-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          flex: 1;
        }
        
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
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
          background: #fff;
        }
        
        .create-post-input:focus,
        .ai-prompt-input:focus {
          outline: none;
          border-color: #333;
          box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
        }

        .create-post-file-input {
          font-size: 0.875rem;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: #fff;
        }

        .create-post-button,
        .generate-button {
          background: #000;
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

        .create-post-button:hover,
        .generate-button:hover {
          background: #333;
          transform: translateY(-2px);
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

        .ai-prompt-input {
          width: 100%;
          padding: 1rem;
          border: 2px solid transparent;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
          color: #333;
          background-image: linear-gradient(white, white), 
                          linear-gradient(45deg, #ff6b6b, #9c27b0, #ff1493);
          background-origin: border-box;
          background-clip: padding-box, border-box;
        }

        .ai-prompt-input:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(156, 39, 176, 0.2);
        }

        .ai-prompt-input::placeholder {
          color: #9c27b0;
          opacity: 0.7;
        }

        .generate-button {
          background: linear-gradient(45deg, #ff6b6b, #9c27b0, #ff1493);
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
          position: relative;
          overflow: hidden;
        }

        .generate-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(156, 39, 176, 0.3);
        }

        .generate-button:active {
          transform: translateY(0);
        }

        .generate-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          background: linear-gradient(45deg, #ccc, #999, #ccc);
        }

        .generated-content-preview {
          margin-top: 1.5rem;
          border: 2px solid transparent;
          border-radius: 8px;
          padding: 1rem;
          background: white;
          flex: 1;
          display: flex;
          flex-direction: column;
          background-image: linear-gradient(white, white), 
                          linear-gradient(45deg, #ff6b6b, #9c27b0, #ff1493);
          background-origin: border-box;
          background-clip: padding-box, border-box;
        }

        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid transparent;
          background-image: linear-gradient(white, white), 
                          linear-gradient(45deg, #ff6b6b, #9c27b0, #ff1493);
          background-origin: border-box;
          background-clip: padding-box, border-box;
        }

        .preview-header h4 {
          margin: 0;
          background: linear-gradient(45deg, #ff6b6b, #9c27b0, #ff1493);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-size: 1.1rem;
          font-weight: 500;
        }

        .copy-button {
          background: linear-gradient(45deg, #ff6b6b, #9c27b0, #ff1493);
          color: white;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .copy-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(156, 39, 176, 0.3);
        }

        .preview-content {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          background: white;
          border-radius: 4px;
          color: #333;
        }

        .preview-content::-webkit-scrollbar {
          width: 8px;
        }

        .preview-content::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .preview-content::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #ff6b6b, #9c27b0, #ff1493);
          border-radius: 4px;
        }

        .preview-content::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #ff1493, #9c27b0, #ff6b6b);
        }

        .ProseMirror {
          min-height: 200px;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          outline: none;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9c27b0;
          pointer-events: none;
          height: 0;
          font-style: italic;
          opacity: 0.7;
        }

        .ProseMirror:focus {
          border-color: #9c27b0;
          box-shadow: 0 0 0 2px rgba(156, 39, 176, 0.1);
        }

        @media (max-width: 1024px) {
          .create-post-layout {
            flex-direction: column;
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
