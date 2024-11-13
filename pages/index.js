import { useState } from 'react';
import { getSpotifyToken, searchArtists, fetchLatestPost } from '../lib/spotify';

export default function Home() {
  const [query, setQuery] = useState('');
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [latestPost, setLatestPost] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleArtistSearch = async () => {
    setLoading(true);
    setArtists([]);
    setLatestPost(null);

    try {
      const token = await getSpotifyToken();
      if (!token) {
        console.error("No token received from Spotify");
        return;
      }
      
      const artistResults = await searchArtists(query, token);
      setArtists(artistResults);
    } catch (error) {
      console.error('Error fetching artists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleArtistSelect = async (artistId) => {
    setLoading(true);
    setLatestPost(null);
    setSelectedArtist(artistId);

    try {
      const token = await getSpotifyToken();
      if (!token) {
        console.error("No token received from Spotify");
        return;
      }
      
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
      <h1>Spotify Artist Search and Latest Release</h1>
      <input
        type="text"
        placeholder="Enter artist name"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleArtistSearch}>Search Artists</button>

      {loading && <p>Loading...</p>}

      <div>
        {artists && artists.length > 0 && (
          <div>
            <h2>Artists</h2>
            <ul>
              {artists.map((artist) => (
                <li key={artist.id} onClick={() => handleArtistSelect(artist.id)}>
                  {artist.name}
                </li>
              ))}
            </ul>
          </div>
        )}

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
    </div>
  );
}
