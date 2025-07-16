// pages/api/stream.js

export default async function handler(req, res) {
  const tmdbId = req.query.id;
  if (!tmdbId) return res.status(400).json({ error: "Missing TMDB ID" });

  try {
    const tmdbRes = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${process.env.TMDB_API_KEY}`
    );

    if (!tmdbRes.ok) throw new Error("TMDB fetch failed");

    const movie = await tmdbRes.json();

    // This is a static DASH URL (replace with your dynamic one later)
    const streamUrl = "https://tglmp01.akamaized.net/out/v1/de55fad9216e4fe7ad8d2eed456ba1ec/manifest.mpd";

    res.status(200).json({
      tmdbId,
      title: movie.title || "Unknown",
      release_date: movie.release_date || "Unknown",
      streamUrl
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movie info" });
  }
}
