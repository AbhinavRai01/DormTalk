import React from 'react'
import { useState, useEffect } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";
import { storage } from "../config/firebase";

export default function ImageTest() {
    const [url,setUrl] = useState("");

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
  return (
    <div>
        <input type="file" onChange={handleImageUpload} />
      
    </div>
  )
}
