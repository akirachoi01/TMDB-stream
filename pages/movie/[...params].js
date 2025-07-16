// pages/movie/[...params].js

import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import shaka from "shaka-player";

export default function MoviePlayer() {
  const router = useRouter();
  const { params } = router.query;
  const tmdbId = params?.[0];
  const videoRef = useRef(null);
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    if (!tmdbId) return;

    // Initialize Shaka
    shaka.polyfill.installAll();
    if (!shaka.Player.isBrowserSupported()) {
      console.error("Browser not supported by Shaka Player");
      return;
    }

    // Fetch metadata + stream URL
    fetch(`/api/stream?id=${tmdbId}`)
      .then(res => res.json())
      .then(data => {
        setMovie(data);
        return data.streamUrl;
      })
      .then(async (manifestUri) => {
        const player = new shaka.Player(videoRef.current);
        await player.load(manifestUri);
      })
      .catch(err => console.error("Error loading stream:", err));
  }, [tmdbId]);

  if (!tmdbId) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>🎥 Playing Movie ID: {tmdbId}</h1>
      {movie && <h2>{movie.title} ({movie.release_date})</h2>}

      <video
        ref={videoRef}
        width="100%"
        height="auto"
        controls
        autoPlay
        style={{ backgroundColor: "#000" }}
      />
    </div>
  );
}
