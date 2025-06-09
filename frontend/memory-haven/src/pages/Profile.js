import { useEffect, useState } from "react";
import API_URL from "../api"; // Import backend URL

function Profile() {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserCapsules = async () => {
      const token = localStorage.getItem("token");
      console.log("Token:", token); // Debugging Token

      if (!token) {
        setError("You are not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching from:", `${API_URL}/api/memoryhaven`); // Check API URL

        const response = await fetch(`${API_URL}/api/memoryhaven`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Response status:", response.status); // Debug response status

        if (!response.ok) {
          throw new Error(`Failed to fetch capsules. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Capsules:", data); // Debug response data
        setCapsules(data);
      } catch (error) {
        console.error("Error fetching user capsules:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCapsules();
  }, []);

  return (
    <div>
      <h1>❤️ Your Profile ✨</h1>
      <p>Manage your time capsules here.</p>

      <h2>Your Capsules</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : capsules.length > 0 ? (
        <div className="capsule-container">
          {capsules.map((capsule) => (
            <div key={capsule._id} className="capsule">
              <h3 className="capsule-title">{capsule.title}</h3>
              <p className="capsule-description">{capsule.description}</p>

              {/* Check if media exists and display it */}
              {capsule.media && capsule.media.length > 0 && (
                <div className="media-container">
                  {capsule.media.map((file, index) => {
                    const fileUrl = file.startsWith("http")
                      ? file
                      : `${API_URL.replace(/\/$/, "")}/uploads/${file.replace(/^\/+/, "")}`;
                    const fileType = file.split(".").pop();

                    if (["png", "jpg", "jpeg", "gif"].includes(fileType)) {
                      return (
                        <img
                          key={index}
                          src={fileUrl}
                          alt="Capsule Media"
                          className="media-image"
                        />
                      );
                    } else if (["mp4", "webm"].includes(fileType)) {
                      return (
                        <video key={index} controls className="media-video">
                          <source src={fileUrl} type={`video/${fileType}`} />
                          Your browser does not support the video tag.
                        </video>
                      );
                    } else if (["mp3", "wav", "opus", "mp4"].includes(fileType)) {
                      return (
                        <audio key={index} controls className="media-audio">
                          <source src={fileUrl} type={`audio/${fileType}`} />
                          Your browser does not support the audio element.
                        </audio>
                      );
                    } else {
                      return <p key={index}>Unsupported media type</p>;
                    }
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>You haven't created any capsules yet.</p>
      )}
    </div>
  );
}

export default Profile;
