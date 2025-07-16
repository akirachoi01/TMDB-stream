import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import shaka from "shaka-player";

export default function MoviePlayer() {
  const { query } = useRouter();
  const movieId = query?.params?.[0]; // TMDB ID from route
  const videoRef = useRef(null);
  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieId) return;

    // Load Shaka polyfills and check support
    shaka.polyfill.installAll();
    if (!shaka.Player.isBrowserSupported()) {
      setError("❌ Shaka Player is not supported in your browser.");
      return;
    }

    // Fetch stream metadata
    fetch(`/api/stream?id=${movieId}`)
      .then((res) => res.json())
      .then(async (data) => {
        setMetadata(data);

        const player = new shaka.Player(videoRef.current);
        try {
          await player.load(data.streamUrl); // Load DASH stream
        } catch (e) {
          console.error("Error loading video:", e);
          setError("❌ Failed to load video.");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("❌ Could not fetch stream metadata.");
      });
  }, [movieId]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!movieId) return <p>Loading route...</p>;

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>🎬 Playing Movie ID: {movieId}</h1>
      {metadata && (
        <>
          <h2>
            {metadata.title} ({metadata.release_date})
          </h2>
          <video
            ref={videoRef}
            width="100%"
            height="auto"
            controls
            autoPlay
            style={{ backgroundColor: "#000", borderRadius: "8px" }}
            poster={metadata.posterUrl || "/placeholder.jpg"}
          />
        </>
      )}
      {!metadata && <p>⏳ Fetching video data...</p>}
    </div>
  );
}
