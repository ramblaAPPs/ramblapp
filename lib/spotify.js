import axios from 'axios';

export async function getSpotifyToken() {
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    })
  );

  return response.data.access_token;
}

export async function fetchLatestPost(artistId, token) {
  const response = await axios.get(
    `https://api.spotify.com/v1/artists/${artistId}/albums?limit=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.items[0];
}
