import fetch from 'node-fetch';

export async function getSpotifyToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

export async function fetchLatestPost(artistId, token) {
  const url = `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=single,album,compilation,appears_on&limit=1&market=ES`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.error('Error fetching latest release:', response.statusText);
    return null;
  }

  const data = await response.json();
  const latestRelease = data.items[0];

  if (!latestRelease) {
    return null;
  }

  // Si es un álbum o compilación, obten las canciones
  if (latestRelease.album_type === 'album' || latestRelease.album_type === 'compilation') {
    const tracksUrl = `https://api.spotify.com/v1/albums/${latestRelease.id}/tracks`;

    const tracksResponse = await fetch(tracksUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!tracksResponse.ok) {
      console.error('Error fetching tracks:', tracksResponse.statusText);
      return null;
    }

    const tracksData = await tracksResponse.json();
    latestRelease.tracks = tracksData.items; // Añade las canciones al lanzamiento
  }

  return latestRelease;
}
