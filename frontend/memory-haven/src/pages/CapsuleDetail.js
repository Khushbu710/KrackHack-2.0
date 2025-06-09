import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_URL from "../api"; 

function CapsuleDetail() {
  const { id } = useParams();
  const [capsule, setCapsule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCapsuleDetails = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const response = await fetch(`${API_URL}/api/memoryhaven/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch capsule details.");
        }

        const data = await response.json();
        setCapsule(data);
      } catch (error) {
        console.error("Error fetching capsule details:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCapsuleDetails();
  }, [id]);

  return (
    <div>
      <h1>Capsule Details</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : capsule ? (
        <div>
          <h2>{capsule.title}</h2>
          <p>{capsule.description}</p>
          <p>Created on: {new Date(capsule.createdAt).toLocaleDateString()}</p>

          {/* Display Media */}
          {capsule.media && capsule.media.length > 0 && (
            <div>
              <h3>Attached Media:</h3>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                {capsule.media.map((mediaPath, index) => {
                  const fullPath = mediaPath.startsWith("http") ? mediaPath : `${API_URL}${mediaPath}`;
        
                  if (mediaPath.endsWith(".mp4")) {
                    return (
                      <div key={index} style={{ textAlign: "center", maxWidth: "100px" }}>
                        <video controls src={fullPath} style={{ width: "100%", maxHeight: "80px" }} />
                        <p>
                          <a href={fullPath} target="_blank" rel="noopener noreferrer">
                            Watch full video
                          </a>
                        </p>
                      </div>
                    );
                  } 
        
                  else if (mediaPath.endsWith(".mp3", ".opus", ".wav", ".mp4")) {
                  //else if ([".mp3", ".opus", ".wav", ".mp4"].some(ext => mediaPath.endsWith(ext))) {  
                    return (
                      <div key={index} style={{ textAlign: "center", maxWidth: "100px" }}>
                        <audio controls src={fullPath} style={{ width: "100%" }} />
                        <p>
                          <a href={fullPath} target="_blank" rel="noopener noreferrer">
                            Listen to full audio
                          </a>
                        </p>
                      </div>
                    );
                  } 
        
                  else {
                    return (
                      <div key={index} style={{ textAlign: "center", maxWidth: "100px" }}>
                        <img 
                          src={fullPath} 
                          alt="Memory Media" 
                          className="thumbnail"
                          onClick={() => {
                            console.log("Opening:", fullPath); // Debugging
                            window.open(fullPath, "_blank");}}
                        />

                        {/* <p>
                          <a href={fullPath} target="_blank" rel="noopener noreferrer">
                            View full image
                          </a>
                        </p> */}
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          )}

        </div>
      ) : (
        <p>Capsule not found.</p>
      )}
    </div>
  );
}

export default CapsuleDetail;