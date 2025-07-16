// pages/api/stream.js

export default async function handler(req, res) {
  const tmdbId = req.query.id;
  if (!tmdbId) return res.status(400).json({ error: "Missing TMDB ID" });

  try {
    // Fetch movie info from TMDB
    const tmdbRes = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${process.env.TMDB_API_KEY}`
    );
    if (!tmdbRes.ok) throw new Error("TMDB fetch failed");
    const movie = await tmdbRes.json();

    // Sample logic to dynamically build a stream URL (replace with real logic)
    const streamUrl = `https://tmdb-stream.vercel.app/stream/${tmdbId}.mpd`;

    res.status(200).json({
      tmdbId,
      title: movie.title || "Unknown",
      release_date: movie.release_date || "Unknown",
      streamUrl
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch movie info" });
  }
}
