import { useState } from 'react';
import { getSpotifyToken, fetchLatestPost } from '../lib/spotify';

export default function Home() {
  const [artistId, setArtistId] = useState('');
  const [latestPost, setLatestPost] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setLatestPost(null);

    try {
      // Obtener token de Spotify
      const token = await getSpotifyToken();
      // Obtener el último lanzamiento del artista
      const latestPostData = await fetchLatestPost(artistId, token);
      setLatestPost(latestPostData);
    } catch (error) {
      console.error('Error fetching latest post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Spotify Latest Post Prototype</h1>
      <input
        type="text"
        placeholder="Enter artist ID"
        value={artistId}
        onChange={(e) => setArtistId(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {loading && <p>Loading...</p>}

      {latestPost && (
        <div>
          <h2>{latestPost.name}</h2>
          <p>Release Date: {latestPost.release_date}</p>
          <img src={latestPost.images[0]?.url} alt={latestPost.name} width="200" />

          {latestPost.tracks && (
            <div>
              <h3>Tracks:</h3>
              <ul>
                {latestPost.tracks.map((track) => (
                  <li key={track.id}>{track.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
