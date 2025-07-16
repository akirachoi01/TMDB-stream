// pages/api/stream.js
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const id = req.query.id;

  if (!id) {
    return res.status(400).json({ error: "Missing TMDB ID" });
  }

  const metadataPath = path.join(process.cwd(), 'public', 'streams', id, 'metadata.json');

  try {
    const fileContent = fs.readFileSync(metadataPath, 'utf-8');
    const metadata = JSON.parse(fileContent);

    res.status(200).json(metadata);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: `Metadata not found for ID ${id}` });
  }
}
