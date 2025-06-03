import React, { use, useEffect, useState } from 'react';
import Select from 'react-select';
import { useAuthContext } from '../hooks/useAuthContext';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";
import { useNavigate } from 'react-router-dom';

export default function AddQuestion() {
  const { user,loading } = useAuthContext();
  const navigate = useNavigate();

  const [questionName, setQuestionName] = useState("");
  const [questionDescription, setQuestionDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [url, setUrl] = useState("");

  const allTags = [
    'Maths', 'Physics', 'Chemistry', 'Mechanical', 'Electrical', 'Civil', 'Computer Science',
    'Electronics', 'Information Technology', 'Chemical Engineering', 'Biotechnology',
    'Aerospace Engineering', 'Materials Science', 'Data Science', 'Artificial Intelligence'
  ];

  const tagOptions = allTags.map(tag => ({ value: tag, label: tag }));

  const handleTagSelect = (selectedOptions) => {
    const selectedTags = selectedOptions.map(option => option.value);
    setTags(selectedTags);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `images/${file.name}`);
    uploadBytes(storageRef, file)
      .then((snapshot) => getDownloadURL(snapshot.ref))
      .then((url) => {
        console.log("Image URL:", url);
        setUrl(url);
      })
      .catch((error) => {
        console.error("Upload error:", error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const questionData = {
      question: questionName,
      description: questionDescription,
      tags: tags,
      senderID: user.userId,
      imageURL: url
    };

    try {
      const response = await fetch('http://localhost:5000/api/questions/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Question submitted successfully:', data);
       // Redirect to the questions list page
    } catch (error) {
      console.error('Error submitting question:', error);
    }
    navigate('/all-questions');
  };

  useEffect(() => {
    console.log("User:", user);
    console.log("Loading:", loading);
    if (!user && !loading) {
      navigate('/login');
    }
  }, [loading]);

  return (
    <div>
      <main className="max-w-4xl mx-auto px-2 py-4 sm:px-6 py-16">
        <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Ask a Question</h2>

        <form className="bg-white p-8 rounded-2xl shadow-md space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">Question</label>
            <input type="text" id="question" name="question" value={questionName}
              onChange={(e) => setQuestionName(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-400 px-4 py-2"
              placeholder="e.g. How does async/await work in JavaScript?" required />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea id="description" name="description" rows="5"
              onChange={(e) => setQuestionDescription(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-400 px-4 py-2"
              placeholder="Describe your problem or question in detail..." required></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <Select
              isMulti
              name="tags"
              options={tagOptions}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={handleTagSelect}
              placeholder="Search and select tags..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
            <input type="file" onChange={handleImageUpload} />
          </div>

          <div className="text-right">
            <button type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-sm font-medium transition">
              Post Question
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
