/* funciona sin track duration 

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
  try {
    // Buscar álbumes y singles por separado
    const [albumsResponse, singlesResponse] = await Promise.all([
      axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album&market=ES&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=single&market=ES&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    // Combinar y ordenar por fecha de lanzamiento
    const allReleases = [...albumsResponse.data.items, ...singlesResponse.data.items];
    const sortedReleases = allReleases.sort(
      (a, b) => new Date(b.release_date) - new Date(a.release_date)
    );

    // Seleccionar la publicación más reciente
    const latestRelease = sortedReleases[0];

    // Intentar obtener el nombre del artista de la última publicación
    let artistName = latestRelease.artists?.[0]?.name || null;

    // Si el nombre del artista no está presente, buscar en publicaciones anteriores
    if (!artistName) {
      for (const release of sortedReleases) {
        if (release.artists?.[0]?.name) {
          artistName = release.artists[0].name;
          break;
        }
      }
    }

    // Retornar la última publicación con el nombre del artista, si se encontró
    return { ...latestRelease, artist_name: artistName };
  } catch (error) {
    console.error('Error fetching latest release:', error);
    throw new Error('Error fetching latest release');
  }
}*/

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
  try {
    // Realizamos dos solicitudes: una para álbumes y otra para singles
    const [albumsResponse, singlesResponse] = await Promise.all([
      axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album&market=ES&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=single&market=ES&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    // Combinamos y ordenamos todas las publicaciones por fecha de lanzamiento
    const allReleases = [...albumsResponse.data.items, ...singlesResponse.data.items];
    const sortedReleases = allReleases.sort(
      (a, b) => new Date(b.release_date) - new Date(a.release_date)
    );

    // Seleccionamos la última publicación
    const latestRelease = sortedReleases[0];

    // Intentamos obtener la duración de la pista
    let trackDuration = null;
    if (latestRelease.album_type === 'single' && latestRelease.tracks?.items?.length) {
      // Si es una canción individual (single) y tiene información de tracks
      trackDuration = latestRelease.tracks.items[0].duration_ms;
    } else if (latestRelease.album_type === 'single') {
      // Si es un single sin tracks.items, hacemos una solicitud adicional para el track
      const trackDetails = await axios.get(`https://api.spotify.com/v1/albums/${latestRelease.id}/tracks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      trackDuration = trackDetails.data.items[0]?.duration_ms || null;
    }

    // Obtenemos el nombre del artista desde la publicación
    const artistName = latestRelease.artists?.[0]?.name || null;

    // Retornamos la última publicación junto con el nombre del artista y duración de la pista
    return { ...latestRelease, artist_name: artistName, track_duration: trackDuration };
  } catch (error) {
    console.error('Error fetching latest release:', error);
    throw new Error('Error fetching latest release');
  }
}

