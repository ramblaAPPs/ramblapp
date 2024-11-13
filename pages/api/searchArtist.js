import { getSpotifyToken } from '../../lib/spotify';

export default async function handler(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const token = await getSpotifyToken();
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Error fetching artists:', response.statusText);
      return res.status(500).json([]);
    }

    const data = await response.json();
    const artists = data.artists?.items || []; // Asegúrate de devolver un array

    res.status(200).json(artists);
  } catch (error) {
    console.error('Error searching for artist:', error);
    res.status(500).json([]);
  }
}
