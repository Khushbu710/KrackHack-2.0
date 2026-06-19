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

          {new Date(capsule.openDate) > new Date() ? (
            <p>
              🔒 This capsule is locked until{" "}
              {new Date(capsule.openDate).toLocaleDateString()}
            </p>
          ) : (
            <p>{capsule.description}</p>
          )}

          <p>
            Created on:{" "}
            {new Date(capsule.createdAt).toLocaleDateString()}
          </p>

          {/* Display Media */}
          {capsule.media && capsule.media.length > 0 && (
            <div>
              <h3>Attached Media:</h3>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                {capsule.media.map((mediaPath, index) => {
                  const fullPath = mediaPath.startsWith("http")
                    ? mediaPath
                    : `${API_URL}${mediaPath}`;

                  const lowerPath = mediaPath.toLowerCase();

                  // 🎥 Video
                  if (lowerPath.endsWith(".mp4")) {
                    return (
                      <div key={index} style={{ maxWidth: "150px" }}>
                        <video
                          controls
                          src={fullPath}
                          style={{ width: "100%" }}
                        />
                      </div>
                    );
                  }

                  // 🎵 Audio
                  if (
                    [".mp3", ".wav", ".opus"].some((ext) =>
                      lowerPath.endsWith(ext)
                    )
                  ) {
                    return (
                      <div key={index} style={{ maxWidth: "150px" }}>
                        <audio
                          controls
                          src={fullPath}
                          style={{ width: "100%" }}
                        />
                      </div>
                    );
                  }

                  // 🖼 Image (default)
                  return (
                    <div key={index} style={{ maxWidth: "150px" }}>
                      <img
                        src={fullPath}
                        alt="Memory Media"
                        style={{
                          width: "100%",
                          cursor: "pointer",
                        }}
                        onClick={() => window.open(fullPath, "_blank")}
                      />
                    </div>
                  );
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