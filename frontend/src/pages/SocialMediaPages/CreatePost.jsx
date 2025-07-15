import React, { useState } from 'react';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [clusterInput, setClusterInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Suggestions for clusters (can be names or objects)
  const suggestions = ['WebDevelopment', 'MachineLearning', 'CampusLife', 'DataStructures'];

  const handleClusterChange = (e) => {
    setClusterInput(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setClusterInput(suggestion);
    setShowSuggestions(false);
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      title,
      content,
      cluster: clusterInput,
      image: imageFile,
    });

    // You can add actual API logic here
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create a New Post</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:outline-none"
            placeholder="Enter your post title"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="6"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:outline-none"
            placeholder="Write your thoughts..."
          ></textarea>
        </div>

        {/* Cluster with Suggestions */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Cluster</label>
          <input
            type="text"
            value={clusterInput}
            onChange={handleClusterChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:outline-none"
            placeholder="Type cluster name..."
          />
          {showSuggestions && clusterInput && (
            <ul className="absolute z-10 bg-white border border-gray-300 w-full rounded-md mt-1 shadow text-sm">
              {suggestions
                .filter((s) => s.toLowerCase().includes(clusterInput.toLowerCase()))
                .map((s, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                    onClick={() => handleSuggestionClick(s)}
                  >
                    d/{s}
                  </li>
                ))}
              {suggestions.filter(s => s.toLowerCase().includes(clusterInput.toLowerCase())).length === 0 && (
                <li className="px-4 py-2 text-gray-400">No matches</li>
              )}
            </ul>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm"
          />
          {imageFile && (
            <p className="text-xs text-gray-600 mt-1">Selected: {imageFile.name}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-2 rounded-md"
        >
          Submit Post
        </button>
      </form>
    </div>
  );
}
