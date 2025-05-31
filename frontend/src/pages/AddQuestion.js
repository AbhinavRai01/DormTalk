import React, { use } from 'react'
import { useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext';
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";
import { storage } from "../config/firebase";


export default function AddQuestion() {

  const { user } = useAuthContext();

  const [questionName, setQuestionName] = useState("");
  const [questionDescription, setQuestionDescription] = useState("");
  const [tags, setTags] = useState([]);

  const [url, setUrl] = useState("");

  function handleImageUpload(event) {

    const file = event.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `images/${file.name}`);
    uploadBytes(storageRef, file)
      .then((snapshot) => getDownloadURL(snapshot.ref))
      .then((url) => {
        console.log("Image URL:", url);
        setUrl(url);  // Update the state with the image URL
        // You can set this URL to state if you want to display the image
      })
      .catch((error) => {
        console.error("Upload error:", error);
      });
    }

    const handleTagChange = (e) => {
      const { value, checked } = e.target;
      console.log("Tag changed:", value, checked);
      if (checked) {
        setTags((prevTags) => [...prevTags, value]);
      } else {
        setTags((prevTags) => prevTags.filter((tag) => tag !== value));
      }
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      const questionData = {
        question: questionName,
        description: questionDescription,
        tags: tags,
        senderID: user.userId ,
        imageURL : url
      };

      console.log("Question Data:", questionData);
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
      } catch (error) {
        console.error('Error submitting question:', error);
      }
    }

    return (
      <div>
        <main class="max-w-4xl mx-auto px-2 py-4 sm: px-6 py-16">
          <h2 class="text-3xl font-bold text-slate-800 mb-8 text-center">Ask a Question</h2>

          <form action="/submit-question" method="POST" class="bg-white p-8 rounded-2xl shadow-md space-y-6">
            <div>
              <label for="question" class="block text-sm font-medium text-gray-700 mb-1">Question</label>
              <input type="text" id="question" name="question" value={questionName} onChange={(e) => setQuestionName(e.target.value)}
                class="w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-400 px-4 py-2"
                placeholder="e.g. How does async/await work in JavaScript?" required />
            </div>

            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 mb-1" >Description</label>
              <textarea id="description" name="description" rows="5" onChange={(e) => setQuestionDescription(e.target.value)}
                class="w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-400 px-4 py-2"
                placeholder="Describe your problem or question in detail..." required></textarea>
            </div>

            <div>
              <span class="block text-sm font-medium text-gray-700 mb-2">Tags</span>
              <div class="flex flex-wrap gap-4">
                <div class="flex items-center space-x-2">
                  <input type="checkbox" id="tag-cpp" name="tags" value="cpp"
                    class="border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-200" onChange={handleTagChange} />
                  <label for="tag-cpp" class="text-sm font-medium text-gray-700">C++</label>
                </div>

                <div class="flex items-center space-x-2" >
                  <input type="checkbox" id="tag-webdev" name="tags" value="webdev"
                    class="border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-200" onChange={handleTagChange} />
                  <label for="tag-webdev" class="text-sm font-medium text-gray-700"  >Web Development</label>
                </div>

                <div class="flex items-center space-x-2">
                  <input type="checkbox" id="tag-js" name="tags" value="javascript"
                    class="border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-200" onChange={handleTagChange} />
                  <label for="tag-js" class="text-sm font-medium text-gray-700" >JavaScript</label>
                </div>

                <div class="flex items-center space-x-2">
                  <input type="checkbox" id="tag-python" name="tags" value="python"
                    class="border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-200" onChange={handleTagChange} />
                  <label for="tag-python" class="text-sm font-medium text-gray-700" >Python</label>
                </div>
              </div>
            </div>
            <div>Upload Image :  <input type="file" onChange={handleImageUpload} /></div>

            <div class="text-right">
              <button type="submit" onClick={handleSubmit}
                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-sm font-medium transition">
                Post Question
              </button>
            </div>
          </form>
        </main>

      </div>
    )
  }
