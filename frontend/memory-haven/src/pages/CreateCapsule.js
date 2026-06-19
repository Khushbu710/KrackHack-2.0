import React, { useState } from "react";
import "../index.css";
import API_URL from "../api";

function CreateCapsule() {
  const [title, setTitle] = useState("");
  const [openDate, setOpenDate] = useState("");
  const [message, setMessage] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDateChange = (e) => setOpenDate(e.target.value);
  const handleMessageChange = (e) => setMessage(e.target.value);

  const handleFileChange = (e, index) => {
    const files = [...mediaFiles];
    files[index] = e.target.files[0];
    setMediaFiles(files);
  };

  const addMediaInput = () => {
    setMediaFiles([...mediaFiles, null]);
  };

  const removeMediaInput = (index) => {
    const files = mediaFiles.filter((_, i) => i !== index);
    setMediaFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !openDate || !message) {
      alert("Please fill all fields!");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("User not authenticated! Please log in.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("openDate", openDate);
    formData.append("description", message);

    // Append media files
    mediaFiles.forEach((file) => {
      if (file) {
        formData.append("media", file);
      }
    });

    try {
      const response = await fetch(`${API_URL}/api/memoryhaven`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Capsule created successfully!");
        setTitle("");
        setOpenDate("");
        setMessage("");
        setMediaFiles([]);
      } else {
        alert(data.message || "Error creating capsule");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create capsule. Try again later.");
    }
  };

  return (
    <div>
      <h1>💖 Create a Time Capsule ✨</h1>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={handleTitleChange}
          />

          <input
            type="date"
            value={openDate}
            onChange={handleDateChange}
          />

          <textarea
            placeholder="Write your message..."
            value={message}
            onChange={handleMessageChange}
          ></textarea>

          {/* File Upload Inputs */}
          {mediaFiles.map((file, index) => (
            <div key={index} className="file-input-container">
              <input
                type="file"
                accept="image/*, video/*, audio/*"
                onChange={(e) => handleFileChange(e, index)}
              />
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeMediaInput(index)}
              >
                ❌
              </button>
            </div>
          ))}

          <button
            type="button"
            className="add-media-btn"
            onClick={addMediaInput}
          >
            ➕ Add More Media
          </button>

          <br />

          <button type="submit" className="create-btn">
            Create Capsule
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateCapsule;