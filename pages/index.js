// pages/index.js

import { useEffect, useRef, useState } from 'react';
import shaka from 'shaka-player';

export default function Home() {
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [tmdbId, setTmdbId] = useState("1087192");
  const [title, setTitle] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
const video = document.getElementById("video"); // <video id="video"></video>
const manifestUri = `https://tmdb-stream.vercel.app/stream/${type}/${id}.mpd`; // or whatever path you're using

async function initPlayer() {
  const player = new shaka.Player(video);
  try {
    await player.load(manifestUri);
    console.log("The video has now been loaded!");
  } catch (e) {
    console.error("Error loading video", e);
  }
}
shaka.polyfill.installAll();
if (shaka.Player.isBrowserSupported()) {
  initPlayer();
} else {
  console.error("Browser not supported!");
}

  useEffect(() => {
    shaka.polyfill.installAll();
  }, []);

  const loadStream = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/stream?id=${tmdbId}`);
      const data = await res.json();

      const player = new shaka.Player(videoRef.current);
      await player.load(data.streamUrl);

      setTitle(data.title);
      setReleaseDate(data.release_date);
    } catch (err) {
      alert("Failed to load stream");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>🎬 TMDB Stream Player</h1>

      <input
        type="text"
        placeholder="Enter TMDB ID"
        value={tmdbId}
        onChange={(e) => setTmdbId(e.target.value)}
        style={{ padding: 10, width: 200 }}
      />
      <button onClick={loadStream} style={{ marginLeft: 10, padding: 10 }}>
        Load Stream
      </button>

      {loading && <p>Loading...</p>}

      <video
        ref={videoRef}
        width="640"
        height="360"
        controls
        autoPlay
        style={{ marginTop: 20, background: '#000' }}
      />

      {title && (
        <div style={{ marginTop: 10 }}>
          <h2>{title}</h2>
          <p>Release Date: {releaseDate}</p>
        </div>
      )}
    </div>
  );
}
