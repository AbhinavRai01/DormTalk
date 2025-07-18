import React, { useState, useEffect } from 'react';
import useNavigate from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuthContext } from '../../hooks/useAuthContext';
import { storage } from '../../config/firebase';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [clusterInput, setClusterInput] = useState('');
  const [imageFile, setImageFile] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedClusterId, setSelectedClusterId] = useState(null);

  const { user } = useAuthContext();

  // Suggestions for clusters (can be names or objects)
  const [suggestions, setSuggestions] = useState([]);

  const handleClusterChange = (e) => {
    setClusterInput(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setClusterInput(suggestion.name);            // Show cluster name in input
    setSelectedClusterId(suggestion._id);
    setShowSuggestions(false);
  };

  const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;
  
      const storageRef = ref(storage, `images/${file.name}`);
      uploadBytes(storageRef, file)
        .then((snapshot) => getDownloadURL(snapshot.ref))
        .then((url) => {
          console.log("Image URL:", url);
          setImageFile(url);
        })
        .catch((error) => {
          console.error("Upload error:", error);
        });
    };

const handleSubmit = async(e) => {
  e.preventDefault();
  if (!title || !content || !selectedClusterId) {
    alert("Please fill all fields");
    return;
  }

  const response = await fetch('http://localhost:5000/api/posts/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      content,
      cluster: selectedClusterId,
      authorID: user.userId,
      imageURL: imageFile
    }),
  });

  // Submit this data to backend
};

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (clusterInput.length > 0) {
        fetch(`http://localhost:5000/api/clusters/searchform/${clusterInput}`)
          .then(res => res.json())
          .then(data => setSuggestions(data));
      } else {
        setSuggestions([]);
      }
    }, 300); // debounce: wait 300ms after typing stops

    return () => clearTimeout(delayDebounce);
  }, [clusterInput]);

  useEffect(()=>{
    console.log(user);
  })


  return (
    <div className="max-w-3xl text-left mx-auto px-4 pt-8">
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
                .filter((s) =>
                  s.name.toLowerCase().includes(clusterInput.toLowerCase())
                )
                .map((s, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                    onClick={() => handleSuggestionClick(s)}
                  >
                    d/{s.name}
                  </li>
                ))}
              {suggestions.filter(s =>
                s.name.toLowerCase().includes(clusterInput.toLowerCase())
              ).length === 0 && (
                  <li className="px-4 py-2 text-gray-400">No matches</li>
                )}
            </ul>
          )}
        </div>

        {/* Image Upload */}
        <div className="flex flex-col gap-2 min-w-[200px]">
            <label className="text-sm text-left font-medium text-gray-700">
              Upload image <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="file"
              onChange={handleImageUpload}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm text-gray-700 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
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
