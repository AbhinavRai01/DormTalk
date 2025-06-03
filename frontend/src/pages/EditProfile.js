import React, { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useEffect } from 'react';
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";
import { storage } from "../config/firebase";

export default function EditProfile() {

  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const [name, setName] = useState('Ava Johnson');
  const [bio, setBio] = useState('PhD in History • Assistant Professor of History at Harvard University');
  const [profilePic, setProfilePic] = useState('/avatar-placeholder.jpg');
  const [imagePreview, setImagePreview] = useState(profilePic);
  
      function handleImageUpload(event) {
  
      const file = event.target.files[0];
      if (!file) return;
  
      const storageRef = ref(storage, `images/${file.name}`);
      uploadBytes(storageRef, file)
          .then((snapshot) => getDownloadURL(snapshot.ref))
          .then((url) => {
              console.log("Image URL:", url);
              setProfilePic(url);  // Update the state with the image URL
              // You can set this URL to state if you want to display the image
              setImagePreview(URL.createObjectURL(file));
          })
          .catch((error) => {
              console.error("Upload error:", error);
          });
        }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    // handle save logic (API call or state update)
    console.log({ name, bio, profilePic });
    const userId = user.userId;
    const updateUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/update/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            bio,
            imageURL: profilePic,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update user data');
        }
        const data = await response.json();
        console.log('User data updated successfully:', data);
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    }
    updateUserData()
  };

  useEffect(() =>{
    if(user){
        const userId = user.userId;
        console.log(userId);
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/users/${userId}`);

                console.log(response);
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
                console.log(data);
                setName(data.name || '');
                setBio(data.bio || '');
                setImagePreview(data.imageURL || '/avatar-placeholder.jpg');
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }
  },[])



  return (
    <div className=" bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-200 w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h1>

        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-8 mb-8">
          <div className="relative w-24 h-24 mb-4 sm:mb-0">
            <img
              src={imagePreview}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full object-cover border"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
              title="Change profile picture"
            />
          </div>

          <div className="flex-1 space-y-4 w-full">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
