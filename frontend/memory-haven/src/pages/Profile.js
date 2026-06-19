import { useEffect, useState } from "react";
import API_URL from "../api";

function Profile() {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserCapsules = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You are not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/memoryhaven`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch capsules.`);
        }

        const data = await response.json();
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

              {/* Media Preview */}
              {capsule.media && capsule.media.length > 0 && (
                <div className="media-container">
                  {capsule.media.map((file, index) => {
                    const fileUrl = file.startsWith("http")
                      ? file
                      : `${API_URL}${file}`;

                    const extension = file.split(".").pop().toLowerCase();

                    // 🖼 Images
                    if (["png", "jpg", "jpeg", "gif", "webp"].includes(extension)) {
                      return (
                        <img
                          key={index}
                          src={fileUrl}
                          alt="Capsule Media"
                          className="media-image"
                        />
                      );
                    }

                    // 🎥 Videos
                    if (["mp4", "webm", "mov"].includes(extension)) {
                      return (
                        <video key={index} controls className="media-video">
                          <source src={fileUrl} type={`video/${extension}`} />
                          Your browser does not support the video tag.
                        </video>
                      );
                    }

                    // 🎵 Audio
                    if (["mp3", "wav", "opus"].includes(extension)) {
                      return (
                        <audio key={index} controls className="media-audio">
                          <source src={fileUrl} type={`audio/${extension}`} />
                          Your browser does not support the audio element.
                        </audio>
                      );
                    }

                    return (
                      <a key={index} href={fileUrl} target="_blank" rel="noopener noreferrer">
                        View File
                      </a>
                    );
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